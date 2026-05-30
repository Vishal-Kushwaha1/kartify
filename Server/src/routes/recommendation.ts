import express from "express";
import {attachUserSession, isUserActive} from "../middleware/auth.js";
import {getRecommendations, trackActivity} from "../controllers/recommendation.js";

const router = express.Router()

router.use( attachUserSession, isUserActive,)

router.get("/", getRecommendations)
router.post("/track",trackActivity)


export default router