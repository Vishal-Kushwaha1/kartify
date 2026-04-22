import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const isSeller = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  if (req.user.role !== "seller" || !req.user.emailVerified) {
    throw new ApiError(403, "you are not seller");
  }
  next();
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  if (req.user.role !== "admin" || !req.user.emailVerified) {
    throw new ApiError(403, "You are not admin");
  }
  next();
});
