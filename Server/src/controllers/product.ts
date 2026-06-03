import { and, arrayContains, asc, count, eq, ilike, or } from "drizzle-orm";
import { db } from "../db/db.js";
import { product } from "../models/product.js";
import { seller } from "../models/seller.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { User } from "../utils/auth.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Fuse from "fuse.js";

export const createProduct = asyncHandler(async (req, res) => {
  const user = req.user as User;
  if (!user?.id) {
    throw new ApiError(401, "User not authenticated");
  }

  const { name, description, price, stock, category } = req.body;
  if (!name || !price) {
    throw new ApiError(400, "Name and price are required");
  }

  const sellerData = await db
    .select()
    .from(seller)
    .where(eq(seller.userId, user.id));

  if (!sellerData[0]) {
    throw new ApiError(403, "Seller account not found");
  }

  const files = req.files as { [fieldName: string]: Express.Multer.File[] };
  const images = files?.image || [];
  if (images.length > 5) {
    throw new ApiError(400, "Maximum 5 images allowed");
  }

  const uploaded = await Promise.all(
    images.map(async (file) => {
      const response = await uploadOnCloudinary(file.path);
      return response?.secure_url;
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
      category: Array.isArray(category) ? category : [],
      image: imageUrls || [],
      isActive: true,
      sellerId: sellerData[0].id,
      userId: user.id,
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
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const search = req.query.search;
  const skip = (page - 1) * limit;

  if (search) {
    const totalProducts = await db.select().from(product);
    const fuse = new Fuse(totalProducts, {
      keys: ["name", "description", "category"],
      threshold: 0.4,
    });
    const result = await fuse.search(search as string, { limit: 20 });
    if (!result) {
      return res.json(new ApiResponse(201, [], "No product found"));
    }
    const products = result.map(r=> r.item)
    const responseData = {
      products: products,
      totalPages: 1,
      currentPage: Number(1),
      totalProducts: totalProducts.length,
    };
    return res.json(new ApiResponse(200, responseData, "Product fetched"));
  } else {
    const totalProducts = await db
      .select({ value: count(product.id) })
      .from(product);
    const totalCount = Number(totalProducts[0]?.value);
    const totalPages = Math.ceil(totalCount / limit);

    const allProducts = await db
      .select()
      .from(product)
      .orderBy(asc(product.id))
      .limit(limit)
      .offset(skip);
    if (!allProducts[0] && totalCount > 0) {
      return res.json(new ApiResponse(201, [], "No product found"));
    }
    const responseData = {
      products: allProducts,
      totalPages: totalPages,
      currentPage: Number(page),
      totalProducts: totalCount,
    };
    return res.json(new ApiResponse(200, responseData, "Product fetched"));
  }
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

  let sellerStore = "Kartify Seller";
  if (productData[0]?.sellerId) {
    const sellerData = await db
      .select()
      .from(seller)
      .where(eq(seller.id, productData[0].sellerId));
    if (sellerData.length > 0 && sellerData[0]?.storeName) {
      sellerStore = sellerData[0].storeName;
    }
  }

  const responseData = { ...productData[0], sellerStore };
  return res.json(new ApiResponse(200, responseData, "Product founded"));
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

export const toggleProduct = asyncHandler(async (req, res) => {
  const current = req.product;

  if (!current) throw new ApiError(404, "Product not found");

  const updated = await db
    .update(product)
    .set({ isActive: !current.isActive })
    .where(eq(product.id, current.id))
    .returning();

  if (!updated[0]) {
    throw new ApiError(500, "Failed to update product");
  }

  return res.json(
    new ApiResponse(
      200,
      updated[0],
      `Product ${updated[0].isActive ? "activated" : "deactivated"}`,
    ),
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

export const getAllProductsOfSeller = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  const result = await db
    .select()
    .from(product)
    .where(eq(product.userId, user.id));

  res.json(new ApiResponse(200, result, "All products found"));
});

export const getSellerProductById = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  const { id } = req.params as { id: string };
  if (!id) {
    throw new ApiError(404, "Product id is required");
  }

  const result = await db
    .select()
    .from(product)
    .where(and(eq(product.id, id), eq(product.userId, user.id)));
  if (!result[0]) {
    throw new ApiError(404, "Product not found");
  }
  res.json(new ApiResponse(200, result[0], "Product found"));
});
