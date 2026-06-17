import express from "express";
import { attachUserSession } from "../middleware/auth.js";
import {
  addNewAddress,
  defaultAddress,
  deleteAddress,
  getAllAddress,
} from "../controllers/address.js";
import { validateAddressInput } from "../middleware/address.js";

const router = express.Router();

router.use(attachUserSession);
router.get("/", getAllAddress);
router.post("/", validateAddressInput, addNewAddress);
router.put("/:id", defaultAddress);
router.delete("/:id", deleteAddress);

export default router;
