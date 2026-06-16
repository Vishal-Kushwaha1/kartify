import { and, eq } from "drizzle-orm";
import { db, dbPool } from "../db/db.js";
import { cartItem } from "../models/cartItem.js";
import type { CartType } from "../types/type.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { product } from "../models/product.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import redis from "../db/redis.js";

export const getCart = asyncHandler(async (req, res) => {
  const user = req.user;
  const cart = req.cart as CartType;
  
  if (!user) throw new ApiError(401, "Unauthorized");
  if (!cart?.id) throw new ApiError(401, "Cart not found");

  const cacheKey = `cart:${user.id}`;
  const cachedCart = await redis.get(cacheKey);
  if (cachedCart) {
    return res.json(new ApiResponse(200, JSON.parse(cachedCart), "Cart fetched from cache"));
  }

  const cartItemData = await db
    .select()
    .from(cartItem)
    .leftJoin(product, eq(product.id, cartItem.productId))
    .where(eq(cartItem.cartId, cart.id));

  await redis.set(cacheKey, JSON.stringify(cartItemData), "EX", 3600); // Cache for 1 hour
  return res.json(new ApiResponse(200, cartItemData, "Cart fetched"));
});

export const addToCart = asyncHandler(async (req, res) => {
  const user = req.user;
  const cart = req.cart as CartType;
  const { productId } = req.body;

  if (!user) throw new ApiError(401, "Unauthorized");
  if (!cart?.id) throw new ApiError(401, "Cart not found");
  if (!productId) throw new ApiError(400, "ProductId required");

  await dbPool.transaction(async (tx) => {
    const productData = await tx
      .select()
      .from(product)
      .where(eq(product.id, productId));

    if (!productData[0]) {
      throw new ApiError(404, "Product not found");
    }

    const cartItemData = await tx
      .select()
      .from(cartItem)
      .where(
        and(eq(cartItem.cartId, cart.id), eq(cartItem.productId, productId)),
      );

    if (!cartItemData[0]) {
      await tx
        .insert(cartItem)
        .values({
          quantity: 1,
          price: productData[0].price,
          productId: productId,
          cartId: cart.id,
        })
        .returning();
    } else {
      const quantity = cartItemData[0].quantity + 1;
      await tx
        .update(cartItem)
        .set({ quantity })
        .where(
          and(eq(cartItem.cartId, cart.id), eq(cartItem.productId, productId)),
        )
        .returning();
    }
  });

  // Return full updated cart
  const updatedCart = await db
    .select()
    .from(cartItem)
    .leftJoin(product, eq(product.id, cartItem.productId))
    .where(eq(cartItem.cartId, cart.id));

  await redis.del(`cart:${user.id}`);
  return res.json(new ApiResponse(200, updatedCart, "Item added to cart"));
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const user = req.user;
  const cart = req.cart as CartType;
  const { productId } = req.body;

  if (!user) throw new ApiError(401, "Unauthorized");
  if (!cart?.id) throw new ApiError(401, "Cart not found");
  if (!productId) throw new ApiError(400, "ProductId required");

  const cartItemData = await db
    .select()
    .from(cartItem)
    .where(
      and(eq(cartItem.cartId, cart.id), eq(cartItem.productId, productId)),
    );

  if (!cartItemData[0]) {
    throw new ApiError(404, "Item not in cart");
  }

  await db
    .delete(cartItem)
    .where(
      and(eq(cartItem.cartId, cart.id), eq(cartItem.productId, productId)),
    );

  // Return full updated cart
  const updatedCart = await db
    .select()
    .from(cartItem)
    .leftJoin(product, eq(product.id, cartItem.productId))
    .where(eq(cartItem.cartId, cart.id));

  await redis.del(`cart:${user.id}`);
  return res.json(new ApiResponse(200, updatedCart, "Item removed from cart"));
});

export const updateQuantity = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = req.cart as CartType;
  const user = req.user;

  if (!user) throw new ApiError(401, "Unauthorized");
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

  await db
    .update(cartItem)
    .set({ quantity })
    .where(and(eq(cartItem.cartId, cart.id), eq(cartItem.productId, productId)))
    .returning();

  // Return full updated cart
  const updatedCart = await db
    .select()
    .from(cartItem)
    .leftJoin(product, eq(product.id, cartItem.productId))
    .where(eq(cartItem.cartId, cart.id));
  await redis.del(`cart:${user.id}`);
  return res.json(new ApiResponse(200, updatedCart, "Quantity updated"));
});

export const clearCart = asyncHandler(async (req, res) => {
  const user = req.user;
  const cart = req.cart as CartType;
  if (!user) throw new ApiError(401, "Unauthorized");
  if (!cart?.id) throw new ApiError(401, "Cart not found");

  await db.delete(cartItem).where(eq(cartItem.cartId, cart.id));
  await redis.del(`cart:${user.id}`);
  return res.json(new ApiResponse(200, [], "Cart cleared"));
});
