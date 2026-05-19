import { and, eq } from "drizzle-orm";
import { db, dbPool } from "../db/db.js";
import { address as addressTable } from "../models/address.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getAllAddress = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  const result = await db
    .select()
    .from(addressTable)
    .where(eq(addressTable.userId, user.id));

  res.json(new ApiResponse(200, result, "OK"));
});

export const addNewAddress = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  const result = await dbPool.transaction(async(trx)=>{
    if(req.body.isDefault){
      await trx.update(addressTable).set({isDefault: false}).where(eq(addressTable.userId, user.id))
    }
  
    const data = await trx
      .insert(addressTable)
      .values({ ...req.body, userId: user.id })
      .returning();
      return data
  })


  if (!result[0]) throw new ApiError(500, "Failed to save address");

  res.json(new ApiResponse(200, result[0], "Address added"));
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  const addressId = req.params.id as string;
  if (!addressId) throw new ApiError(400, "Address ID required");

  await db
    .delete(addressTable)
    .where(
      and(eq(addressTable.id, addressId), eq(addressTable.userId, user.id)),
    );

  res.json(new ApiResponse(200, null, "Address deleted"));
});

export const defaultAddress = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(400, "Unauthorized");
  }
  const addressId = req.params.id as string;

  const result =await dbPool.transaction(async (trx) => {
    await trx
      .update(addressTable)
      .set({ isDefault: false })
      .where(eq(addressTable.userId, user.id));

    const data = await trx
      .update(addressTable)
      .set({ isDefault: true })
      .where(
        and(eq(addressTable.id, addressId), eq(addressTable.userId, user.id)),
      ).returning()

      return data
  });
  res.json(new ApiResponse(200, result[0], "Address set to default"))
});
