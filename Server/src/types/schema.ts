import { z } from "zod";
import { ApiError } from "../utils/ApiError.js";

export const productSchema = z.object({
  name: z.string().trim().min(2, "Minimum 2 characters required"),
  description: z.string().trim().optional(),
  price: z.coerce
    .number()
    .positive("Price must be greater than 0")
    .multipleOf(0.01, "Max 2 decimal places"),
  stock: z.coerce
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),

  category: z
    .union([z.string().trim(), z.array(z.string().trim())])
    .optional()
    .transform((val) => {
      if (!val) return [];
      return Array.isArray(val) ? val : [val];
    }),
});

