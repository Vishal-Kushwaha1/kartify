import * as z from 'zod'; 

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6,"Minimum 6 character required.").max(20, "Maximum 20 character allowed"),
});
export type LoginProps = z.infer<typeof loginSchema>


export const registerSchema = z.object({
  fullName: z.string(),
  email: z.string().email("Invalid email"),
  password: z.string().min(6,"Minimum 6 character required.").max(20, "Maximum 20 character allowed"),
})
export type RegisterProps = z.infer<typeof registerSchema>