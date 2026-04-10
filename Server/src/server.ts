import express from "express"
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth.js";

const app = express()

app.all("/api/auth/*", toNodeHandler(auth))

app.use(express.json())

app.get('/', (req, res)=>{
  res.send('Server is running fine on website')
})

export default app