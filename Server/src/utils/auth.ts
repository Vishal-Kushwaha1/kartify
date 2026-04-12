import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../config/db.js";
import * as userSchema from "../models/index.js"

const getTrustedOrigins = (): string[] => {
  const originsEnv = process.env.TRUSTED_ORIGINS;
  if (originsEnv) {
    return originsEnv.split(',').map(origin => origin.trim()).filter(Boolean);
  }
  return ["http://localhost:5173"];
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: userSchema,
  }),
  trustedOrigins: getTrustedOrigins(),
  emailAndPassword: {
    enabled: true,
  },
});