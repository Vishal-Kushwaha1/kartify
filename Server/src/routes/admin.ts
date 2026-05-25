import express from "express";
import {
    blockSeller, blockUser,
    getAllPendingSellers,
    getAllSellers,
    getAllUsers,
    getSellerById,
    getUserById,
    makeSellerVerified, unBlockSeller, unBlockUser
} from "../controllers/admin.js";

const router = express.Router();

router.get("/seller", getAllSellers)
router.get("/seller/:id", getSellerById)
router.get("/user", getAllUsers)
router.get("/user/:id", getUserById)
router.get("/pending", getAllPendingSellers)

router.put("/seller/:id", makeSellerVerified)
router.put("/seller/ban/:id", blockSeller)
router.put("/seller/unban/:id", unBlockSeller)
router.put("/user/ban/:id", blockUser)
router.put("/user/unban/:id", unBlockUser)


export default router;