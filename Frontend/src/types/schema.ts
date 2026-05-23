import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(6, "Minimum 6 characters required")
    .max(20, "Maximum 20 characters allowed"),
});
export type LoginProps = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Minimum 2 characters required")
    .max(100, "Maximum 100 characters allowed"),
  email: z.email("Invalid email"),
  password: z
    .string()
    .min(6, "Minimum 6 characters required")
    .max(20, "Maximum 20 characters allowed"),
});
export type RegisterProps = z.infer<typeof registerSchema>;

export const sellerSchema = z.object({
  storeName: z.string().min(2, "Minimum 2 characters required").trim(),
  storeDescription: z.string().trim().optional(),
  storeLocation: z.string().trim().optional(),
  panNumber: z
    .string()
    .trim()
    .min(10, "Write valid Pan Number")
    .max(10, "Write valid Pan Number"),
  aadharNumber: z
    .string()
    .trim()
    .min(12, "Write valid Aadhar Number")
    .max(12, "Write valid Aadhar Number"),
  gstNumber: z
    .string()
    .trim()
    .min(15, "Write valid GST Number")
    .max(15, "Write valid GST Number"),
  gstCertificate: z.any(), // TODO: set validation for image
  shopImage: z.any(),
});
export type SellerProps = z.infer<typeof sellerSchema>;

export const newProductSchema = z.object({
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

  category: z.array(z.string().trim()).optional(),
  image: z
    .instanceof(FileList)
    .optional()
    .refine((list) => !list || list.length <= 5, "Maximum 5 images allowed")
    .transform((list) => (list ? Array.from(list) : [])),
});

export type NewProductInputProps = z.input<typeof newProductSchema>;
export type NewProductProps = z.infer<typeof newProductSchema>;

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
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter valid postal code"),
  country: z.string().trim().min(2),
  latitude: z.number(),
  longitude: z.number(),
  isDefault: z.boolean(),
});

export type NewAddressProps = z.infer<typeof newAddressSchema>;


export const reviewSchema = z.object({
  rating: z.number().min(1, "Please select star as rating").max(5,"maximum 5 is allowed"),
  comment: z.string().nullable().optional()
})
export type ReviewProps = z.infer<typeof reviewSchema>