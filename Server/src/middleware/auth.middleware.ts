import { fromNodeHeaders } from "better-auth/node";
import { asyncHandler } from "../utils/asyncHandler.js";
import { auth } from "../utils/auth.js";
import { ApiError } from "../utils/ApiError.js";

export const attachSession = asyncHandler(async (req, res, next) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (!session) {
    throw new ApiError(401, "Unauthorized - No session found");
  }
  req.user = session?.user ?? undefined;
  req.session = session?.session ?? undefined;
  next();
});

export const isEmailVerified = asyncHandler(async (req, res, next) => {
  if (!req.session) {
    throw new ApiError(401, "Unauthorized - No session found");
  }
  if (!req.user?.emailVerified) {
    throw new ApiError(403, "Email not verified");
  }
  next();
});

export const isActive = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  if (!req.user?.isActive) {
    throw new ApiError(403, "Account is not active");
  }
  next();
});

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
