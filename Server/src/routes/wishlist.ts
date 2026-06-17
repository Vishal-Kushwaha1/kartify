import express from "express";
import {
  addToWishlist,
  getWishlist,
  moveToCart,
  removeFromWishlist,
} from "../controllers/wishlist.js";
import { attachUserSession } from "../middleware/auth.js";

const router = express.Router();

router.get("/", attachUserSession, getWishlist);
router.post("/", attachUserSession, addToWishlist);
router.delete("/:productId", attachUserSession, removeFromWishlist);
router.post("/move-to-cart", attachUserSession, moveToCart);

export default router;
