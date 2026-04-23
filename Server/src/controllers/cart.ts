import { and, eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { cartItem } from "../models/cartItem.js";
import type { CartType } from "../types/type.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { product } from "../models/product.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getCart = asyncHandler(async (req, res) => {
  const cart = req.cart as CartType;
  if (!cart?.id) {
    throw new ApiError(401, "Cart not found");
  }

  const cartItemData = await db
    .select()
    .from(cartItem)
    .leftJoin(product, eq(product.id, cartItem.productId))
    .where(eq(cartItem.cartId, cart.id));

  return res.json(new ApiResponse(200, cartItemData, "Cart fetched"));
});

export const addToCart = asyncHandler(async (req, res) => {
  const cart = req.cart as CartType;
  const { productId } = req.body;

  if (!cart?.id) throw new ApiError(401, "Cart not found");
  if (!productId) throw new ApiError(400, "ProductId required");

  const result = await db.transaction(async (tx) => {
    const productData = await tx
      .select()
      .from(product)
      .where(eq(product.id, productId));

    if (!productData[0]) {
      return res.json(new ApiError(404, "Product not found"));
    }

    const cartItemData = await tx
      .select()
      .from(cartItem)
      .where(
        and(eq(cartItem.cartId, cart.id), eq(cartItem.productId, productId)),
      );

    if (!cartItemData[0]) {
      const addedCartItemData = await tx
        .insert(cartItem)
        .values({
          quantity: 1,
          price: productData[0].price,
          productId: productId,
          cartId: cart.id,
        })
        .returning();

      return addedCartItemData[0];
    }

    const quantity = cartItemData[0].quantity + 1;
    const updatedCartItemData = await tx
      .update(cartItem)
      .set({ quantity })
      .where(
        and(eq(cartItem.cartId, cart.id), eq(cartItem.productId, productId)),
      )
      .returning();

    return updatedCartItemData[0];
  });
  return res.json(new ApiResponse(200, result, "Item added to cart"));
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = req.cart as CartType;
  const { productId } = req.body;

  if (!cart?.id) throw new ApiError(401, "Cart not found");
  if (!productId) throw new ApiError(400, "ProductId required");

  const cartItemData = await db
    .select()
    .from(cartItem)
    .where(
      and(eq(cartItem.cartId, cart.id), eq(cartItem.productId, productId)),
    );

  if (!cartItemData[0]) {
    throw new ApiError(500, "Item not in cart");
  }

  const quantity = cartItemData[0].quantity;
  if (quantity <= 1) {
    const deletedCartItemData = await db
      .delete(cartItem)
      .where(
        and(eq(cartItem.cartId, cart.id), eq(cartItem.productId, productId)),
      )
      .returning();
    return res.json(
      new ApiResponse(200, deletedCartItemData[0], "Item removed"),
    );
  } else {
    const newQuantity = quantity - 1;
    const updatedCartItemData = await db
      .update(cartItem)
      .set({ quantity: newQuantity })
      .where(
        and(eq(cartItem.cartId, cart.id), eq(cartItem.productId, productId)),
      )
      .returning();
    return res.json(
      new ApiResponse(200, updatedCartItemData[0], "Item updated"),
    );
  }
});

export const updateQuantity = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = req.cart as CartType;

  if (!cart?.id) throw new ApiError(401, "Cart not found");
  if (!productId) throw new ApiError(400, "ProductId required");
  if (!quantity || quantity < 1)
    throw new ApiError(400, "Quantity must be >= 1");

  const cartItemData = await db
    .select()
    .from(cartItem)
    .where(
      and(eq(cartItem.cartId, cart.id), eq(cartItem.productId, productId)),
    );
  if (!cartItemData[0]) {
    throw new ApiError(404, "Item not in cart");
  }

  const updatedCartItemData = await db
    .update(cartItem)
    .set({ quantity })
    .where(and(eq(cartItem.cartId, cart.id), eq(cartItem.productId, productId)))
    .returning();

  return res.json(
    new ApiResponse(200, updatedCartItemData[0], "Quantity updated"),
  );
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = req.cart as CartType;
  if (!cart?.id) throw new ApiError(401, "Cart not found");

  await db.delete(cartItem).where(eq(cartItem.cartId, cart.id));

  return res.json(new ApiResponse(200, {}, "Cart cleared"));
});
