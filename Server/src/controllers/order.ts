import { and, eq, sql, gte } from "drizzle-orm";
import { dbPool } from "../db/db.js";
import { cart } from "../models/cart.js";
import { cartItem } from "../models/cartItem.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { order } from "../models/order.js";
import { orderItem } from "../models/orderItem.js";
import { RazorpayInstance } from "../utils/razorpay.js";
import { payment } from "../models/payment.js";
import crypto from "crypto";
import Stripe from "stripe";
import { product } from "../models/product.js";

const createOrderFromCart = async ({
  trx,
  userId,
  addressId,
}: {
  trx: any;
  userId: string;
  addressId: string;
}) => {
  const userCart = await trx.select().from(cart).where(eq(cart.userId, userId));

  if (!userCart[0]) throw new ApiError(404, "Cart not found");

  const cartItems = await trx
    .select()
    .from(cartItem)
    .where(eq(cartItem.cartId, userCart[0].id));

  if (!cartItems[0]) throw new ApiError(402, "Cart is empty");

  const amount = cartItems.reduce((sum: number, row: any) => {
    return sum + Number(row.price) * row.quantity;
  }, 0);

  const subTotal = Number(amount.toFixed(2));
  const deliveryFee = subTotal > 400 ? 0 : 60;
  const gst = Number((subTotal * 0.18).toFixed(2));
  const total = Number((subTotal + gst + deliveryFee).toFixed(2));

  const orderData = await trx
    .insert(order)
    .values({
      status: "pending",
      totalAmount: String(total),
      addressId,
      userId,
    })
    .returning();

  if (!orderData[0]) throw new ApiError(400, "Order not created");

  const createdOrder = orderData[0];

  const orderItems = cartItems.map((row: any) => ({
    orderId: createdOrder.id,
    productId: row.productId,
    quantity: row.quantity,
    price: String(row.price),
  }));

  await trx.insert(orderItem).values(orderItems);

  return {
    createdOrder,
    total,
    cartId: userCart[0].id,
  };
};

const insertPayment = async ({
  trx,
  provider,
  providerPaymentId,
  amount,
  orderId,
  userId,
  currency = "INR",
}: {
  trx: any;
  provider: "cash" | "razorpay" | "stripe";
  providerPaymentId: string;
  amount: number;
  orderId: string;
  userId: string;
  currency?: string;
}) => {
  await trx.insert(payment).values({
    provider,
    providerPaymentId,
    amount: String(amount),
    currency,
    status: "pending",
    orderId,
    userId,
  });
};

const deductStock = async (trx: any, orderId: string) => {
  const items = await trx
    .select()
    .from(orderItem)
    .where(eq(orderItem.orderId, orderId));

  if (!items.length) return;

  await Promise.all(
    items.map((item: any) =>
      trx
        .update(product)
        .set({
          stock: sql`GREATEST(${product.stock} - ${item.quantity}, 0)`,
        })
        .where(
          and(
            eq(product.id, item.productId),
            gte(product.stock, item.quantity),
          ),
        ),
    ),
  );
};

const confirmOrder = async ({
  trx,
  orderId,
  userId,
}: {
  trx: any;
  orderId: string;
  userId: string;
}) => {
  await trx
    .update(order)
    .set({ status: "confirmed" })
    .where(eq(order.id, orderId));

  await deductStock(trx, orderId);

  const userCart = await trx.select().from(cart).where(eq(cart.userId, userId));
  if (userCart[0]) {
    await trx.delete(cartItem).where(eq(cartItem.cartId, userCart[0].id));
  }
};

export const createCodOrder = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, "Unauthorized");

  const { addressId } = req.body;
  if (!addressId) throw new ApiError(400, "Please select any address");

  await dbPool.transaction(async (trx) => {
    const { createdOrder, total } = await createOrderFromCart({
      trx,
      userId: user.id,
      addressId,
    });

    await insertPayment({
      trx,
      provider: "cash",
      providerPaymentId: `COD-${createdOrder.id}`,
      amount: total,
      orderId: createdOrder.id,
      userId: user.id,
    });

    await confirmOrder({ trx, orderId: createdOrder.id, userId: user.id });
  });

  res.json(new ApiResponse(201, null, "COD order created successfully"));
});

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, "Unauthorized");

  const { addressId } = req.body;
  if (!addressId) throw new ApiError(400, "Please select any address");

  const result = await dbPool.transaction(async (trx) => {
    const { createdOrder, total } = await createOrderFromCart({
      trx,
      userId: user.id,
      addressId,
    });

    const options = {
      amount: Math.floor(total * 100),
      currency: "INR",
      receipt: `RAZORPAY-${Date.now()}`,
    };

    const razorpayOrder = await RazorpayInstance.orders.create(options);

    await insertPayment({
      trx,
      provider: "razorpay",
      providerPaymentId: razorpayOrder.id,
      amount: total,
      orderId: createdOrder.id,
      userId: user.id,
    });

    return {
      orderId: createdOrder.id,
      razorpayOrderId: razorpayOrder.id,
      amount: Math.floor(total * 100),
      currency: "INR",
    };
  });
  res.json(new ApiResponse(201, result, "RazorPay order created"));
});

export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, "Unauthorized");

  const {
    orderId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;
  if (
    !orderId ||
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    throw new ApiError(400, "All payment fields are required");
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");
  if (expectedSignature !== razorpay_signature) {
    throw new ApiError(400, "Invalid payment signature");
  }

  await dbPool.transaction(async (trx) => {
    const existingPayment = await trx
      .select()
      .from(payment)
      .where(eq(payment.orderId, orderId));

    if (existingPayment[0]?.status === "success") {
      return;
    }

    await trx
      .update(payment)
      .set({
        status: "success",
        providerPaymentId: razorpay_payment_id,
      })
      .where(eq(payment.orderId, orderId));

    await confirmOrder({ trx, orderId, userId: user.id });
  });
  res.json(new ApiResponse(200, { orderId }, "Payment verified"));
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, "Unauthorized");

  const { orderId } = req.body;
  if (!orderId) throw new ApiError(400, "Order ID is required");

  await dbPool.transaction(async (trx) => {
    const existingOrder = await trx
      .select()
      .from(order)
      .where(eq(order.id, orderId));
    if (!existingOrder[0] || existingOrder[0].userId !== user.id) {
      throw new ApiError(404, "Order not found");
    }
    if (existingOrder[0].status === "pending") {
      await trx
        .update(order)
        .set({ status: "cancelled" })
        .where(eq(order.id, orderId));
      await trx
        .update(payment)
        .set({ status: "failed" })
        .where(eq(payment.orderId, orderId));
    }
  });

  res.json(new ApiResponse(200, null, "Order cancelled"));
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const createStripeOrder = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, "Unauthorized");
  const { addressId } = req.body;
  if (!addressId) throw new ApiError(400, "AddressId is required");

  const result = await dbPool.transaction(async (trx) => {
    const { createdOrder, total } = await createOrderFromCart({
      trx,
      userId: user.id,
      addressId,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card","upi","pay_by_bank", "amazon_pay"],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout?stripe_cancelled=true&orderId=${createdOrder.id}`,
      line_items: [
        {
          price_data: {
            currency: "INR",
            product_data: {
              name: "Kartify Order",
            },
            unit_amount: Math.round(total * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: createdOrder.id,
      },
    });

    await insertPayment({
      trx,
      provider: "stripe",
      providerPaymentId: session.id,
      amount: total,
      orderId: createdOrder.id,
      userId: user.id,
    });
    return { url: session.url };
  });
  res.json(new ApiResponse(201, result, "Stripe session created"));
});

export const verifyStripe = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, "Unauthorized");

  const { sessionId } = req.body;
  if (!sessionId) throw new ApiError(400, "Session ID is required");

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (!session || session.payment_status !== "paid") {
    throw new ApiError(400, "Payment verification failed");
  }

  const orderId = session.metadata?.orderId;
  if (!orderId) {
    throw new ApiError(400, "OrderId not found in stripe session");
  }

  await dbPool.transaction(async (trx) => {
    const existingPayment = await trx
      .select()
      .from(payment)
      .where(eq(payment.orderId, orderId));

    if (existingPayment[0]?.status === "success") {
      return;
    }

    await trx
      .update(payment)
      .set({
        status: "success",
        providerPaymentId: (session.payment_intent as string) || sessionId,
      })
      .where(eq(payment.orderId, orderId));
    await confirmOrder({ trx, orderId, userId: user.id });
  });

  res.json(new ApiResponse(200, { orderId }, "Payment verified successfully"));
});
