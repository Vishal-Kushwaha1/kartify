import { Redis } from "ioredis"
import dotenv from "dotenv"
dotenv.config()

const redis = new Redis(process.env.REDIS_URL!)

redis.on("connect",()=>console.log("connected redis"))
redis.on("error",(err:any)=>console.log("Redis Error: ", err))

export default redis