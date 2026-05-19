import express from "express";
import { applyForSeller } from "../controllers/user.js";
import {
  attachUserSession,
  isEmailVerified,
  isUserActive,
} from "../middleware/auth.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

router.post(
  "/applyForSeller",
  attachUserSession,
  isEmailVerified,
  isUserActive,
  upload.fields([
    { name: "gstCertificate", maxCount: 1 },
    { name: "shopImage", maxCount: 1 },
  ]),
  applyForSeller,
);

export default router;
