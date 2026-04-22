import { and, arrayContained, arrayContains, eq, ilike, lte, or } from "drizzle-orm";
import { db } from "../db/db.js";
import { product } from "../models/product.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, category, image } = req.body;
  if (!name || !price) {
    return res.json(new ApiError(400, "Name and price are required"));
  }
  const newProduct = await db
    .insert(product)
    .values({
      name,
      price,
      ...(description && { description }),
      ...(stock && { stock }),
      ...(category && {
        category: Array.isArray(category) ? category : [category],
      }),
      ...(image && { image: Array.isArray(image) ? image : [image] }),
    })
    .returning();
  return res.json(
    new ApiResponse(201, newProduct[0], "Product added successfully"),
  );
});

export const updateProduct = asyncHandler(async (req, res) => {
  const {
    id,
    name,
    description,
    price,
    stock,
    category,
    image,
    isActive = false,
  } = req.body;
  if (!id) {
    return res.json(new ApiError(400, "Product id is required"));
  }
  if (!name || !price) {
    return res.json(new ApiError(400, "Name and price are required"));
  }
  const updatedProduct = await db
    .update(product)
    .set({
      name,
      price,
      isActive,
      ...(description && { description }),
      ...(stock && { stock }),
      ...(category && {
        category: Array.isArray(category) ? category : [category],
      }),
      ...(image && { image: Array.isArray(image) ? image : [image] }),
    })
    .where(eq(product.id, id))
    .returning();
  return res.json(
    new ApiResponse(201, updatedProduct[0], "Product updated successfully"),
  );
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const allProducts = await db.select().from(product);
  if (!allProducts.length) {
    return res.json(new ApiResponse(201, [], "No product found"));
  }
  return res.json(
    new ApiResponse(200, allProducts, "Product fetched successfully"),
  );
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
    return res.json(new ApiError(400, "Product id is required"));
  }
  const deletedProduct = await db
    .delete(product)
    .where(eq(product.id, id))
    .returning();
  return res.json(
    new ApiResponse(200, deletedProduct, "Product deleted successfully"),
  );
});

export const updateProductStock = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };
  const { stock } = req.body;
  if (!id) {
    return res.json(new ApiError(400, "Product id is required"));
  }
  if (stock === undefined || stock === null) {
    return res.json(new ApiError(400, "Stock is required"));
  }
  const updatedProduct = await db
    .update(product)
    .set({ stock })
    .where(eq(product.id, id))
    .returning();
  return res.json(
    new ApiResponse(
      200,
      updatedProduct[0],
      "Product stock updated successfully",
    ),
  );
});

export const searchProducts = asyncHandler(async (req, res) => {
  const { productName } = req.query as { productName: string };
  if (!productName) {
    return res.json(new ApiError(400, "Product name is required"));
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
  if (!searchedProducts.length) {
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
  const {price,stock, category, isActive} = req.query
  if(!price || !stock || !category || !isActive){
    return res.json(new ApiError(400,"Give data to apply filter"))
  }
  const filteredProduct = await db.select().from(product).where(or(
    lte(product.price, `${price}`),
    ilike(product.isActive, `${isActive}`),
    arrayContains(product.category, [`${category}`])
  ))
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
