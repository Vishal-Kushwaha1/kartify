import {asyncHandler} from "../utils/asyncHandler.js";
import {db} from "../db/db.js";
import {seller} from "../models/seller.js";
import {and, eq} from "drizzle-orm";
import {ApiResponse} from "../utils/ApiResponse.js";
import {user} from "../models/index.js";
import {ApiError} from "../utils/ApiError.js";
import {order} from "../models/order.js";
import {orderItem} from "../models/orderItem.js";

export const getAllPendingSellers = asyncHandler(async (req, res) => {
    const result = await db.select().from(seller).where(eq(seller.isVerified, false))
    res.json(new ApiResponse(200, result, "List of all pending seller"))
})

export const getAllSellers = asyncHandler(async (req, res) => {
    const result = await db.select().from(seller)
    res.json(new ApiResponse(200, result, "List of seller"))
})

export const getSellerById = asyncHandler(async (req, res) => {
    const {id} = req.params
    if(!id){
        throw new ApiError(400, "Seller id is required")
    }
    const result = await db.select().from(seller).where(eq(seller.id, id as string))
    if(!result){
        throw new ApiError(404, "Seller not found")
    }
    res.json(new ApiResponse(200, result[0], "Seller found"))
})

export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params
    const result = await db.select().from(user).where(eq(user.id, id as string))
    if(!result[0]){
        throw new ApiError(404, "User does not exist")
    }
    res.json(new ApiResponse(200, result[0], "user"))
})

export const getAllUsers = asyncHandler(async (req, res) => {
    const result = await db.select().from(user)
    res.json(new ApiResponse(200, result, "List of users"))
})

export const makeSellerVerified = asyncHandler(async (req, res) => {
    const {id} = req.params as {id: string};
    if (!id) throw new ApiError(404, "Seller id is required")
    const result = await db.update(seller).set({isVerified: true}).where(and(eq(seller.id, id), eq(seller.isVerified, false))).returning()
    if (!result[0]) {
        throw new ApiError(402, "Seller already verified")
    }
    res.json(new ApiResponse(200, null, "Seller verified"))
})

export const blockSeller = asyncHandler(async (req, res) => {
    const {id} = req.params as {id:string}
    if (!id) throw new ApiError(404, "Seller id is required")
    const result = await db.update(seller).set({isActive: false}).where(and(eq(seller.id, id), eq(seller.isActive, true))).returning()
    if (!result[0]) {
        throw new ApiError(402, "Seller already blocked or not found")
    }
    res.json(new ApiResponse(200, null, "Seller blocked"))
})

export const unBlockSeller = asyncHandler(async (req, res) => {
    const {id} = req.params as {id:string}
    if (!id) throw new ApiError(404, "Seller id is required")
    const result = await db.update(seller).set({isActive: true}).where(and(eq(seller.id, id), eq(seller.isActive, false))).returning()
    if (!result[0]) {
        throw new ApiError(402, "Seller already active or not found")
    }
    res.json(new ApiResponse(200, null, "Seller unblocked"))
})

export const blockUser = asyncHandler(async (req, res) => {
    const {id} = req.params as {id:string}
    if (!id) throw new ApiError(404, "User id is required")
    const result = await db.update(user).set({isActive: false}).where(and(eq(user.id, id), eq(user.isActive, true))).returning()
    if (!result[0]) {
        throw new ApiError(402, "User already blocked or not found")
    }
    res.json(new ApiResponse(200, null, "User blocked"))
})

export const unBlockUser = asyncHandler(async (req, res) => {
    const {id} = req.params as {id:string}
    if (!id) throw new ApiError(404, "User id is required")
    const result = await db.update(user).set({isActive: true}).where(and(eq(user.id, id), eq(user.isActive, false))).returning()
    if (!result[0]) {
        throw new ApiError(402, "User already active or not found")
    }
    res.json(new ApiResponse(200, null, "User unblocked"))
})

export const getAllOrders = asyncHandler(async (req, res) => {
    const result = await db.select().from(order).leftJoin(orderItem, eq(orderItem.orderId, order.id))
    if(!result[0]){
        throw new ApiError(404, "No order found")
    }
    res.json(new ApiResponse(200, result[0], "Orders found"))
})