import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { product } from "../models/product.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { productSchema } from "../types/schema.js";
import type { User } from "../utils/auth.js";
import redis from "../db/redis.js";
export const attachProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params as { id: string };
  if (!id) {
    throw new ApiError(400, "Product Id is required");
  }
  const productKey = `product:${id}`;
  const cached = await redis.get(productKey);
  if (cached) {
    req.product = JSON.parse(cached);
    return next();
  }

  const productData = await db.select().from(product).where(eq(product.id, id));
  if (!productData[0]) {
    throw new ApiError(404, "Product not found");
  }
  await redis.set(productKey, JSON.stringify(productData[0]), "EX", 600);
  req.product = productData[0];
  next();
});

export const isProductAvailable = asyncHandler(async (req, res, next) => {
  const product = req.product;

  if (!product || product.stock === undefined || product.stock <= 0) {
    throw new ApiError(400, "Product is out of stock");
  }
  next();
});

export const isProductActive = asyncHandler(async (req, res, next) => {
  if (!req.product?.isActive) {
    throw new ApiError(403, "Product is not active");
  }
  next();
});

export const isProductOwner = asyncHandler(async (req, res, next) => {
  const user = req.user as User;
  if (req.product?.userId !== user?.id) {
    throw new ApiError(403, "Unauthorized");
  }
  next();
});

export const validateProductInput = asyncHandler(async (req, res, next) => {
  const result = productSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, result.error.message);
  }
  req.body = result.data;
  next();
});
