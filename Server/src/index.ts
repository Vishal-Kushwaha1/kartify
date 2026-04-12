import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth.js";
import { db } from "./config/db.js"

const app = express()

app.all("/api/auth/*any", toNodeHandler(auth))

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get('/', (req, res)=>{
  res.send('Server is running fine on website')
})

const PORT = process.env.PORT
const startServer = async () => {
  try {
    await db.execute("SELECT 1"); // test query

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("❌ Failed to connect to DB", err);
    process.exit(1);
  }
};

startServer();