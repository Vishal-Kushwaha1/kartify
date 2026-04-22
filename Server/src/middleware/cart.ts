import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { cart } from "../models/cart.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { cartItem } from "../models/cartItem.js";


export const attachCart = asyncHandler(async(req,res,next)=>{
    const userId = req.user?.id as string
    if(!userId){
        return res.json(new ApiError(400, "Login first"))
    }
    const cartData = await db.select().from(cart).where(eq(cart.userId, userId ))
    if(!cartData.length){
        return res.json(new ApiError(404, "Cart not found"))
    }
    const cartItemsData = await db.select().from(cartItem).where(eq(cartItem.cartId, cartData[0]?.id as string))
    req.cart = cartData[0];
    req.cartItems = cartItemsData
    next()
}) 

export const isCartEmpty= asyncHandler(async(req,res,next)=>{
    if(!req.cartItems?.length){
        return res.status(400).json(new ApiError(400, "Cart is empty"))
    }  
    next()
}) 