import express from "express";
import {
  createCodOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
  verifyStripe,
  createStripeOrder,
  cancelOrder,
  getAllOrders,
  getOrderById,
  getAllSellerOrders,
  getSellerOrderById,
  updateSellerOrderStatus,
} from "../controllers/order.js";
import {
  attachUserSession,
  isEmailVerified,
  isUserActive,
} from "../middleware/auth.js";
import { isSeller } from "../middleware/role.js";

const router = express.Router();

router.use(attachUserSession);

router.get("/", getAllOrders);
router.get("/:orderId", getOrderById);

router.use(isUserActive, isEmailVerified);

router.get("/seller/order", isSeller, getAllSellerOrders);
router.get("/seller/order/:orderId", isSeller, getSellerOrderById);
router.put("/seller/order/:orderId/status", isSeller, updateSellerOrderStatus);

router.post("/cash", createCodOrder);

router.post("/razorpay/create", createRazorpayOrder);
router.post("/razorpay/verify", verifyRazorpayPayment);
router.post("/razorpay/cancel", cancelOrder);

router.post("/stripe/create", createStripeOrder);
router.post("/stripe/verify", verifyStripe);
router.post("/stripe/cancel", cancelOrder);

export default router;
