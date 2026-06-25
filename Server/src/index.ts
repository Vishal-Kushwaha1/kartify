import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth.js";
import { db } from "./db/db.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import { ApiError } from "./utils/ApiError.js";
import userRouter from "./routes/user.js";
import productRouter from "./routes/product.js";
import cartRouter from "./routes/cart.js";
import recommendationRouter from "./routes/recommendation.js";
import wishlistRouter from "./routes/wishlist.js";
import addressRouter from "./routes/address.js";
import orderRouter from "./routes/order.js";
import reviewRouter from "./routes/review.js";
import adminRouter from "./routes/admin.js";

const app = express();
app.set("trust proxy", 1);
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin || true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "Accept"],
    exposedHeaders: ["Set-Cookie"],
  }),
);

app.all("/api/auth/*any", toNodeHandler(auth));

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json(new ApiResponse(200, null, "Server is running fine 🚀"));
});

app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/recommendation", recommendationRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/address", addressRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/admin", adminRouter);

const PORT = process.env.PORT as string;
const startServer = async () => {
  try {
    await db.execute("SELECT 1"); // test query

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err: any) {
    throw new ApiError(500, "Failed to connect to DB", [err.message]);
  }
};

startServer();
