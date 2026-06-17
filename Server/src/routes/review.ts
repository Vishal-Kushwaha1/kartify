import express from "express";
import {
  createReviewOfProduct,
  getAllReviewOfProduct,
} from "../controllers/review.js";
import { attachUserSession } from "../middleware/auth.js";
import { validateReviewInput } from "../middleware/review.js";

const router = express.Router();

router.get("/:id", getAllReviewOfProduct);

router.use(attachUserSession);
router.post("/:id", validateReviewInput, createReviewOfProduct);

export default router;
