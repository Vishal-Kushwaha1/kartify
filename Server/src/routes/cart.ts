import express from "express";
import { attachCart } from "../middleware/cart.js";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateQuantity,
} from "../controllers/cart.js";
import { attachUserSession } from "../middleware/auth.js";

const router = express.Router();

router.use(attachUserSession, attachCart);

router.get("/", getCart);
router.post("/add", addToCart);
router.post("/remove", removeFromCart);
router.put("/update", updateQuantity);
router.delete("/clear", clearCart);

export default router;
