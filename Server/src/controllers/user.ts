import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { user } from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { User } from "../utils/auth.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { seller } from "../models/seller.js";

export const applyForSeller = asyncHandler(async (req, res) => {
  const user = req.user as User;
  if (!user?.id) {
    throw new ApiError(401, "User not authenticated");
  }
  const existing = await db
    .select()
    .from(seller)
    .where(eq(seller.userId, user.id));
  if (existing[0]) {
    throw new ApiError(400, "Application already submitted");
  }
  const {
    storeName,
    storeDescription,
    storeLocation,
    panNumber,
    aadharNumber,
    gstNumber,
  } = req.body;

  const gstCertificate = (req.files as any)?.gstCertificate?.[0];
  const shopImage = (req.files as any)?.shopImage?.[0];
  if (
    !storeName ||
    !panNumber ||
    panNumber.length !== 10 ||
    !aadharNumber ||
    aadharNumber.length !== 12 ||
    !gstNumber ||
    gstNumber.length !== 15
  ) {
    throw new ApiError(400, "Invalid Input");
  }
  if (!gstCertificate || !shopImage) {
    throw new ApiError(400, "Files are required");
  }

  const gstCertificateUrl = await uploadOnCloudinary(gstCertificate.path);
  const shopImageUrl = await uploadOnCloudinary(shopImage.path);

  if (!gstCertificateUrl || !shopImageUrl) {
    throw new ApiError(500, "Cloudinary error");
  }
  const result = await db
    .insert(seller)
    .values({
      storeName,
      ...(storeDescription && { storeDescription }),
      ...(storeLocation && { storeLocation }),
      userId: user.id,
      panNumber,
      aadharNumber,
      gstNumber,
      gstCertificate: gstCertificateUrl.secure_url,
      shopImage: shopImage.secure_url,
    })
    .returning();

  if (!result[0]) {
    throw new ApiError(500, "DB error");
  }
  return res.json(new ApiResponse(200, result[0], "Applied successfully"));
});
