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


export const newAddressSchema = z.object({
  name: z.string().trim().min(1),
  recipientName: z.string().trim().min(2),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter valid mobile number"),
  address: z.string().trim().min(5),
  city: z.string().trim().min(2),
  state: z.string().trim().min(2),
  postalCode: z.string().trim().regex(/^\d{6}$/, "Enter valid postal code"),
  country: z.string().trim().min(2),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  isDefault: z.boolean(),
});


export const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating"),
  comment: z.string().nullable().optional()
})