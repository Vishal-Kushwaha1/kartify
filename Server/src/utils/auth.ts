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
          from: process.env.EMAIL_FROM || "onboarding@resend.dev",
          to: email,
          subject: subjects[type] || "Your OTP for Kartify",
          text: `Your OTP is ${otp}`,
          html: `
    <div style="font-family: sans-serif; max-width: 400px; margin: auto; padding: 20px;">
      
      <h2 style="color: #D85A30; margin-bottom: 10px;">
        Kartify Verification
      </h2>

      <p style="font-size: 14px; color: #555;">
        Hello,
      </p>

      <p style="font-size: 14px; color: #555;">
        Use the OTP below to continue:
      </p>

      <div style="
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 4px;
        background: #f4f4f5;
        padding: 12px;
        text-align: center;
        border-radius: 8px;
        margin: 16px 0;
      ">
        ${otp}
      </div>

      <p style="font-size: 12px; color: #888;">
        This OTP is valid for 5 minutes. Do not share it with anyone.
      </p>

    </div>
  `,
        });
      },
    }),
  ],
  advanced:{
    ipAddress:{
      ipv6Subnet: 64,
    }
  },
  rateLimit:{
    enabled: true,
    window: 60,
    max: 5,
  }
});
