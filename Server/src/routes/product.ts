import express from "express";
import {
  attachProduct,
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
import { upload } from "../utils/multer.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/search", searchProducts);
router.get("/:id", attachProduct, getProductById);

router.use(attachUserSession, isEmailVerified, isSeller);

router.post(
  "/",
  upload.fields([{ name: "image", maxCount: 5 }]),
  validateProductInput,
  createProduct,
);
router.patch("/:id",upload.fields([{ name: "image", maxCount: 5 }]), attachProduct, isProductOwner, updateProduct);
router.patch("/:id/stock", attachProduct, isProductOwner, updateProductStock);
router.delete("/:id", attachProduct, isProductOwner, deleteProduct);

export default router;
