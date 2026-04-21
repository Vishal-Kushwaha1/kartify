import "dotenv/config";
import { Resend } from "resend";
import type { EmailProps } from "../types/type.js";

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
      console.error("error sending email: ", error);
      process.exit(1);
    }
  } catch (error) {
    return console.log("Something went wrong email: ", error);
  }
};
