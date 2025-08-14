import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(1000).optional(),
  price: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "Must be a number",
  }),
});

export type ProductFormValues = z.infer<typeof productSchema>;
