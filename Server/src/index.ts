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
// import { upload } from "./utils/multer.js";
// import { uploadOnCloudinary } from "./utils/cloudinary.js";
// import { asyncHandler } from "./utils/asyncHandler.js";

const app = express();
app.use(
  cors({
    origin: "*", //TODO: change this to your frontend URL in production
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
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

// for checking cloudinary is working or not
// app.post("/cloudinary" ,upload.single("image"), asyncHandler(async(req,res)=>{
//   if(!req.file) {
//     throw new ApiError(400, "Image is required")
//   }
//   const result:any  =await uploadOnCloudinary(
//     req.file?.path
//   ) 
//   console.log("result", result)
//   const imageUrl = result.secure_url as string
//   res.status(201).json(new ApiResponse(201, {imageUrl, result}, "Product uploaded"))
// }))

const PORT = process.env.PORT as string
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
