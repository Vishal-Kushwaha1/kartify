import express from "express";
import {
  createCodOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
  verifyStripe,
  createStripeOrder,
  cancelOrder,
} from "../controllers/order.js";
import {
  attachUserSession,
  isEmailVerified,
  isUserActive,
} from "../middleware/auth.js";

const router = express.Router();

router.use(attachUserSession, isUserActive, isEmailVerified);

router.post("/cash", createCodOrder);

router.post("/razorpay/create", createRazorpayOrder);
router.post("/razorpay/verify", verifyRazorpayPayment);
router.post("/razorpay/cancel", cancelOrder);

router.post("/stripe/create", createStripeOrder);
router.post("/stripe/verify", verifyStripe);
router.post("/stripe/cancel", cancelOrder);

export default router;
