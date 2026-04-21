import "dotenv/config";
import { Resend } from "resend";
import type { EmailProps } from "../types/type.js";
import { ApiError } from "./ApiError.js";
import { ApiResponse } from "./ApiResponse.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  from,
  to,
  subject,
  text,
  html,
}: EmailProps) => {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      text,
      html,
    });
    if (error) {
      throw new ApiError(500, "Email sending failed", [error]);
    }
    return new ApiResponse(200, data, "Email sent successfully");
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message, error.errors || []);
  }
};
