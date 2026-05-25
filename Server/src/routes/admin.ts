import express from "express";
import {
    blockSeller, blockUser, getAllOrders,
    getAllPendingSellers,
    getAllSellers,
    getAllUsers,
    getSellerById,
    getUserById,
    makeSellerVerified, unBlockSeller, unBlockUser,
    getOrderById, updateOrderStatus
} from "../controllers/admin.js";
import {attachUserSession} from "../middleware/auth.js";
import {isAdmin} from "../middleware/role.js";

const router = express.Router();

router.use(attachUserSession, isAdmin)

router.get("/seller", getAllSellers)
router.get("/seller/:id", getSellerById)
router.get("/user", getAllUsers)
router.get("/user/:id", getUserById)
router.get("/pending", getAllPendingSellers)
router.get("/orders", getAllOrders)
router.get("/orders/:id", getOrderById)
router.put("/orders/:id/status", updateOrderStatus)

router.put("/seller/:id", makeSellerVerified)
router.put("/seller/ban/:id", blockSeller)
router.put("/seller/unban/:id", unBlockSeller)
router.put("/user/ban/:id", blockUser)
router.put("/user/unban/:id", unBlockUser)


export default router;