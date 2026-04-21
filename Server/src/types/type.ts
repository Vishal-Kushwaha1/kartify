export type EmailProps = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
};


export type UserRoleEnum = "user" | "seller" | "admin";
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  phone?: string | null;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}