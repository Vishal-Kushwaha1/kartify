import dotenv from "dotenv";

dotenv.config();
import {neon, Pool} from "@neondatabase/serverless";
import {drizzle} from "drizzle-orm/neon-http";
import {drizzle as drizzlePool} from "drizzle-orm/neon-serverless";
import {ApiError} from "../utils/ApiError.js";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    throw new ApiError(500, "Missing DATABASE_URL environment variable");
}

export const sql = neon(DATABASE_URL);
export const db = drizzle({client: sql});

const pool = new Pool({connectionString: DATABASE_URL});
export const dbPool = drizzlePool(pool)
