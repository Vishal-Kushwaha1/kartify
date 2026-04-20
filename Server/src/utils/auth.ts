import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../config/db.js";
import * as userSchema from "../models/index.js";
import { sendEmail } from "./resend.js";
import { emailOTP } from "better-auth/plugins";

const subjects: Record<string, string> = {
  "sign-in": "Your sign-in OTP for BetterAuth",
  "sign-up": "Your sign-up OTP for BetterAuth",
  "reset-password": "Your password reset OTP for BetterAuth",
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: userSchema,
  }),
  trustedOrigins: ["http://localhost:5173"],
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await sendEmail({
          from: process.env.EMAIL_FROM as string || "onboarding@resend.dev", // TODO: hardcoded value
          to: "vishalkrk4@gmail.com", //email
          subject: subjects[type] || "Your OTP for BetterAuth",
          text: otp,
          html: `<h3>Email: ${email}</h3><br/><p>OTP: ${otp}</p>`,
        });
      },
    }),
  ],
});
