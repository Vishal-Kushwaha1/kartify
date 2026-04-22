import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Full name is required").trim(),
  description: z.string().trim().optional(),
  price: z.number().positive("Price must be positive"),
  stock: z.number().nonnegative("Stock cannot be negative").optional(),
  category: z.array(z.string()).optional().nullable(),
  image: z.array(z.string()).optional().nullable(),
  isActive: z.boolean().optional(),
  sellerId: z.uuid("Invalid seller id"),
  discountId: z.uuid().optional().nullable(),
});
