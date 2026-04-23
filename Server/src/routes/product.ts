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
import { isPayloadMethod } from "better-auth/client";

const router = express.Router();


router.get("/", getAllProducts)
router.get("/search", searchProducts)
router.get("/:id",attachProduct, isProductActive, getProductById)


router.use(attachUserSession, isEmailVerified,isSeller)

router.post("/", validateProductInput, createProduct)
router.put("/:id", attachProduct, isProductOwner, updateProduct)
router.patch("/:id/stock", attachProduct, isPayloadMethod, updateProductStock)
router.delete("/:id", attachProduct, isProductOwner, deleteProduct)