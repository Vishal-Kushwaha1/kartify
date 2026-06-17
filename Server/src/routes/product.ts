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
  getAllProductsOfSeller,
  getProductById,
  getSellerProductById,
  searchProducts,
  toggleProduct,
  updateProduct,
} from "../controllers/product.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/search", searchProducts);

// Seller routes MUST come before the dynamic /:id route
const sellerAuth = [attachUserSession, isEmailVerified, isSeller];
router.get("/seller", sellerAuth, getAllProductsOfSeller);
router.get(
  "/seller/:id",
  sellerAuth,
  attachProduct,
  isProductOwner,
  getSellerProductById,
);

// Public dynamic route
router.get("/:id", attachProduct, getProductById);

// Middleware for remaining mutating routes
router.use(attachUserSession, isEmailVerified, isSeller);

router.post(
  "/",
  upload.fields([{ name: "image", maxCount: 5 }]),
  validateProductInput,
  createProduct,
);
router.patch(
  "/:id",
  upload.fields([{ name: "image", maxCount: 5 }]),
  attachProduct,
  isProductOwner,
  updateProduct,
);
router.patch("/:id/toggle", attachProduct, isProductOwner, toggleProduct);
router.delete("/:id", attachProduct, isProductOwner, deleteProduct);

export default router;
