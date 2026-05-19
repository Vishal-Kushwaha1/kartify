import { asyncHandler } from "../utils/asyncHandler.js";
import type { User } from "better-auth";
import { ApiError } from "../utils/ApiError.js";
import { db, dbPool } from "../db/db.js";
import { wishlist } from "../models/wishlist.js";
import { and, eq } from "drizzle-orm";
import { product } from "../models/product.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { cart } from "../models/cart.js";
import { cartItem } from "../models/cartItem.js";

export const getWishlist = asyncHandler(async (req, res) => {
  const user = req.user as User;
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  const items = await db
    .select({
      wishlist,
      product,
    })
    .from(wishlist)
    .innerJoin(product, eq(wishlist.productId, product.id))
    .where(eq(wishlist.userId, user.id));

  res.json(new ApiResponse(200, items, "Wishlist fetched successfully"));
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const user = req.user as User;
  if (!user) {
    throw new ApiError(401, "User not found");
  }
  const { productId } = req.body;
  if (!productId) {
    throw new ApiError(400, "ProductId is required");
  }

  const existing = await db
    .select()
    .from(wishlist)
    .where(
      and(eq(wishlist.userId, user.id), eq(wishlist.productId, productId)),
    );

  if (existing.length > 0) {
    throw new ApiError(409, " Product already in wishlist!");
  }

  const newItem = await db
    .insert(wishlist)
    .values({
      userId: user.id,
      productId,
    })
    .returning();

  res.json(new ApiResponse(200, newItem[0], "Added to wishlist"));
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const user = req.user as User;
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  const { productId } = req.params as { productId: string };
  if (!productId) {
    throw new ApiError(400, "ProductId is required");
  }

  const removed = await db
    .delete(wishlist)
    .where(and(eq(wishlist.userId, user.id), eq(wishlist.productId, productId)))
    .returning();

  if (!removed[0]) {
    throw new ApiError(404, "Item not found in wishlist");
  }

  res.json(new ApiResponse(200, removed[0], "Removed from wishlist"));
});

export const moveToCart = asyncHandler(async (req, res) => {
  const user = req.user as User;
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }
  const { productId } = req.body;
  if (!productId) {
    throw new ApiError(400, "ProductId is required");
  }

  const wishListItem = await db
    .select()
    .from(wishlist)
    .where(
      and(eq(wishlist.userId, user.id), eq(wishlist.productId, productId)),
    );
  if (!wishListItem[0]) {
    throw new ApiError(404, "Item not found in wishlist");
  }

  const productData = await db
    .select()
    .from(product)
    .where(eq(product.id, productId));
  const productRow = productData[0];

  if (!productRow) {
    throw new ApiError(404, "Product not found");
  }

  await dbPool.transaction(async (trx) => {
    const userCartRows = await trx
      .select()
      .from(cart)
      .where(eq(cart.userId, user.id));
    let userCartRow = userCartRows[0];
    if (!userCartRow) {
      const insertedCart = await trx
        .insert(cart)
        .values({
          userId: user.id,
        })
        .returning();
      userCartRow = insertedCart[0];
    }
    if (!userCartRow) {
      throw new ApiError(500, "Failed to create cart");
    }

    await trx.insert(cartItem).values({
      cartId: userCartRow.id,
      productId,
      price: productRow.price,
      quantity: 1,
    });

    await trx
      .delete(wishlist)
      .where(
        and(eq(wishlist.userId, user.id), eq(wishlist.productId, productId)),
      )
      .returning();
  });
  res.json(new ApiResponse(200, null, "Moved to cart"));
});
