import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { cart } from "../models/cart.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { User } from "../utils/auth.js";
import type { CartType } from "../types/type.js";

export const attachCart = asyncHandler(async (req, res, next) => {
  const user = req.user as User;

  if (!user) {
    throw new ApiError(401, "Login required");
  }

  const cartData = await db
    .select()
    .from(cart)
    .where(eq(cart.userId, user?.id));
  
    let userCart = cartData[0]
    if(!userCart){
      const newCart = await db.insert(cart).values({userId: user.id}).returning()
      userCart = newCart[0]
    }

  req.cart = userCart as CartType;
  next();
});
