import "dotenv/config";
import Razorpay from "razorpay";
import { ApiError } from "./ApiError.js";

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

if (!key_id || !key_secret) {
  throw new ApiError(
    404,
    "Razorpay keys are missing from environment variables",
  );
}

export const RazorpayInstance = new Razorpay({
  key_id,
  key_secret,
});
