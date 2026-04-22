import express from "express";
import {
  attachProduct,
  isProductActive,
  isProductOwner,
  validateProductInput,
} from "../middleware/product.js";
import { isSeller } from "../middleware/role.js";
import { attachUserSession, isEmailVerified } from "../middleware/auth.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  searchProducts,
  updateProduct,
  updateProductStock,
} from "../controllers/product.js";

const router = express.Router();

router.post(
  "/product",
  attachUserSession,
  isEmailVerified,
  isSeller,
  validateProductInput,
  createProduct,
);
router.put(
  "/:id",
  attachUserSession,
  isEmailVerified,
  isSeller,
  validateProductInput,
  updateProduct,
);
router.patch(
  "/:id",
  attachUserSession,
  isEmailVerified,
  isSeller,
  attachProduct,
  isProductOwner,
  updateProductStock,
);
router.delete(
  "/:id",
  attachUserSession,
  isEmailVerified,
  isSeller,
  attachProduct,
  isProductOwner,
  deleteProduct,
);
router.get("/all", getAllProducts);
router.get("/search", searchProducts);
router.get("/:id", attachProduct, isProductActive, getProductById);

export default router;
