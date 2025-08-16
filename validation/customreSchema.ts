import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(["active", "inactive", "blocked"], {
    required_error: "Status is required",
    invalid_type_error: "Invalid status",
  }),
  profileImage: z.any().optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
