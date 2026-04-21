import * as z from 'zod'; 

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters required").max(20, "Maximum 20 characters allowed"),
});
export type LoginProps = z.infer<typeof loginSchema>


export const registerSchema = z.object({
  fullName: z.string().min(2, "Minimum 2 characters required").max(100, "Maximum 100 characters allowed"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters required").max(20, "Maximum 20 characters allowed"),
});
export type RegisterProps = z.infer<typeof registerSchema>