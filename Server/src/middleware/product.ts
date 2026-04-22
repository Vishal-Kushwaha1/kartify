import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { product } from "../models/product.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { productSchema } from "../types/schema.js";

export const attachProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params as { id: string };
  if (!id) {
    return res.json(new ApiError(400, "Product id is required"));
  }
  const productData = await db.select().from(product).where(eq(product.id, id));
  if (!productData.length) {
    return res.json(new ApiError(404, "Product not found"));
  }
  req.product = productData[0];
  next();
});

export const isProductAvailable = asyncHandler(async (req, res, next) => {
  const product = req.product;
  if (!product?.stock || product?.stock < 1) {
    return res.json(new ApiError(400, "Product is out of stock"));
  }
  next();
});

export const isProductActive = asyncHandler(async (req, res, next) => {
  const product = req.product;
  if (!product?.isActive) {
    return res.json(new ApiError(403, "Product is not active"));
  }
  next();
});

export const isProductOwner = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const product = req.product;
  if (!product?.sellerId || product?.sellerId === user?.id) {
    return res.json(new ApiError(403, "Unauthorized access"));
  }
  next();
});

export const validateProductInput = asyncHandler(async (req, res, next) => {
  const result = productSchema.safeParse(req.body);
  if (!result.success) {
    return res.json(new ApiError(400, result.error.message));
  }
  next();
});
