import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { review } from "../models/review.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { user as userTable } from "../models/user.js";

export const getAllReviewOfProduct = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };
  if (!id) throw new ApiError(400, "Product id is required");

  const reviews = await db
    .select()
    .from(review)
    .leftJoin(userTable, eq(userTable.id, review.userId))
    .where(eq(review.productId, id))

    res.json(new ApiResponse(200, reviews, "All reviews"))
});

export const createReviewOfProduct = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, "Unauthorized");
  const { id } = req.params as { id: string };
  if (!id) throw new ApiError(400, "Product id is required");

  const { comment, rating } = req.body;

  await db.insert(review).values({
    rating,
    comment,
    userId: user.id,
    productId: id,
  });

  res.json(new ApiResponse(200, null, "Review added"));
});
