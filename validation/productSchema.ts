import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),

  description: z.string().max(1000).optional(),

  // Prisma Decimal wants string, so coerce -> validate -> string
  price: z
    .preprocess((val) => (val !== "" ? String(val) : val), z.string())
    .refine((val) => !isNaN(Number(val)), { message: "Must be a number" })
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
      message: "Max 2 decimal places allowed",
    }),

  discount: z
    .preprocess((val) => (val !== "" ? String(val) : undefined), z.string().optional())
    .refine((val) => (val ? !isNaN(Number(val)) : true), { message: "Must be a number" })
    .refine((val) => (val ? /^\d+(\.\d{1,2})?$/.test(val) : true), {
      message: "Max 2 decimal places allowed",
    })
    .optional(),

  quantity: z.preprocess((val) => (val !== "" ? Number(val) : undefined), z.number().int().nonnegative().optional()),

  isActive: z.boolean().default(true).optional(),

  sizes: z.array(z.enum(["S", "M", "L", "XL"])).nonempty("At least one size is required"),

  colors: z.array(z.enum(["red", "black", "white"])).nonempty("At least one color is required"),

  category: z.string().max(100).optional(),

  imageUrl: z.any(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
