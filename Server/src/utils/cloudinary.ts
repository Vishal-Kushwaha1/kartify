import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiResponse } from "./ApiResponse.js";
import { ApiError } from "./ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

export const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
    });
    return new ApiResponse(200, result, "Image uploaded successfully");
  } catch (error: any) {
    throw new ApiError(500, "Cloudinary upload failed", [error]);
  } finally {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
  }
};
