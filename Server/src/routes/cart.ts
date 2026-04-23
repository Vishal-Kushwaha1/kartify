import express from "express"
import { attachCart } from "../middleware/cart.js"
import { addToCart, clearCart, getCart, removeFromCart, updateQuantity } from "../controllers/cart.js"

const router = express.Router()

router.use(attachCart)

router.get("/", getCart)
router.post("/add", addToCart)
router.post("/remove", removeFromCart)
router.patch("/update",updateQuantity)
router.delete("/clear",clearCart)

export default router