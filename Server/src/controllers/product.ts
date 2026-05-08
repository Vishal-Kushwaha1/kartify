import {
  and,
  arrayContained,
  arrayContains,
  eq,
  ilike,
  lte,
  or,
} from "drizzle-orm";
import { db } from "../db/db.js";
import { product } from "../models/product.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { User } from "../utils/auth.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createProduct = asyncHandler(async (req, res) => {
  const user = req.user as User;
  if (!user?.id) {
    throw new ApiError(401, "User not authenticated");
  }

  const { name, description, price, stock, category } = req.body;
  if (!name || !price) {
    throw new ApiError(400, "Name and price are required");
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const images = files?.image || [];
  if (images.length > 5) {
    throw new ApiError(400, "Maximum 5 images allowed");
  }

  const uploaded = await Promise.all(
    images.map(async (file) => {
      const res = await uploadOnCloudinary(file.path);
      return res?.secure_url;
    }),
  );

  const imageUrls = uploaded.filter(Boolean) as string[];

  if (imageUrls.length !== images.length) {
    throw new ApiError(500, "Some images failed to upload");
  }

  const newProduct = await db
    .insert(product)
    .values({
      name,
      description: description || "",
      price: Number(price),
      stock: stock ? Number(stock) : 0,
      category: category || [],
      image: imageUrls || [],
      isActive: true,
      sellerId: user.id,
    })
    .returning();

  if (!newProduct || !newProduct[0]) {
    throw new ApiError(500, "DB error");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, newProduct[0], "Product created successfully"));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };
  const {
    name,
    description,
    price,
    stock,
    category,
    isActive = false,
  } = req.body;

  const files = req.files as { [filedname: string]: Express.Multer.File[] };
  const image = files?.image || [];

  if (image.length > 5) {
    throw new ApiError(400, "Maximum 5 images allowed");
  }

  const updates: Partial<typeof product.$inferInsert> = {};

  if (name) updates.name = name;
  if (description) updates.description = description;
  if (price) updates.price = price;
  if (stock !== undefined) updates.stock = Number(stock);
  if (isActive !== undefined) updates.isActive = isActive;
  if (category) {
    updates.category = Array.isArray(category) ? category : [category];
  }
  if (image.length > 0) {
    const uploaded = await Promise.all(
      image.map(async (file) => {
        const res = await uploadOnCloudinary(file.path);
        return res?.secure_url;
      }),
    );
    const imageUrls = uploaded.filter(Boolean) as string[];

    if (imageUrls.length !== image.length) {
      throw new ApiError(500, "Some images failed to upload");
    }

    updates.image = imageUrls;
  }
  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "No filed to update");
  }

  const updatedProduct = await db
    .update(product)
    .set(updates)
    .where(eq(product.id, id))
    .returning();

  if (!updatedProduct[0]) {
    throw new ApiError(500, "Failed to update product");
  }
  return res.json(
    new ApiResponse(201, updatedProduct[0], "Product updated successfully"),
  );
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const allProducts = await db.select().from(product);
  if (!allProducts[0]) {
    return res.json(new ApiResponse(201, [], "No product found"));
  }
  return res.json(new ApiResponse(200, allProducts, "Product fetched"));
});

export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };
  if (!id) {
    return res.json(new ApiError(400, "Product id is required"));
  }
  const productData = await db.select().from(product).where(eq(product.id, id));
  if (!productData.length) {
    return res.json(new ApiError(404, "Product not found"));
  }
  return res.json(new ApiResponse(200, productData[0], "Product founded"));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };
  if (!id) {
    throw new ApiError(400, "Product id is required");
  }
  const deletedProduct = await db
    .delete(product)
    .where(eq(product.id, id))
    .returning();
  return res.json(
    new ApiResponse(200, deletedProduct[0], "Product deleted successfully"),
  );
});

export const updateProductStock = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };
  const { stock } = req.body;
  if (!id) {
    throw new ApiError(400, "Product id is required");
  }
  if (stock === undefined || stock < 0) {
    throw new ApiError(400, "Stock is required");
  }
  const updatedProduct = await db
    .update(product)
    .set({ stock })
    .where(eq(product.id, id))
    .returning();
  return res.json(new ApiResponse(200, updatedProduct[0], "Stock updated"));
});

export const searchProducts = asyncHandler(async (req, res) => {
  const { productName } = req.query as { productName: string };
  if (!productName) {
    throw new ApiError(400, "Product name is required");
  }
  const searchedProducts = await db
    .select()
    .from(product)
    .where(
      or(
        ilike(product.name, `%${productName}%`),
        arrayContains(product.category, [productName]),
      ),
    );
  if (!searchedProducts[0]) {
    return res.json(new ApiResponse(404, [], "Product not found"));
  }
  return res.json(
    new ApiResponse(
      200,
      searchedProducts,
      `${searchedProducts.length} products found`,
    ),
  );
});

//TODO: work pending in filter product
export const filterProduct = asyncHandler(async (req, res) => {
  const { price, stock, category, isActive } = req.query;
  if (!price || !stock || !category || !isActive) {
    return res.json(new ApiError(400, "Give data to apply filter"));
  }
  const filteredProduct = await db
    .select()
    .from(product)
    .where(
      or(
        ilike(product.isActive, `${isActive}`),
        arrayContains(product.category, [`${category}`]),
      ),
    );
  if (!filteredProduct.length) {
    return res.json(new ApiResponse(404, [], "Product not found"));
  }
  return res.json(
    new ApiResponse(
      200,
      filteredProduct,
      `${filteredProduct.length} products found`,
    ),
  );
});
