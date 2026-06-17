import { newAddressSchema } from "../types/schema.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const validateAddressInput = asyncHandler(async (req, res, next) => {
  const result = newAddressSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, result.error.message);
  }
  req.body = result.data;
  next();
});
