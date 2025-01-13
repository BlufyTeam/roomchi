import { z } from "zod";

export const createCompanySchema = z.object({
  name: z
    .string({ required_error: "This field is required", description: "نام" })
    .min(3, "At least 3 characters"),
  description: z.string({ description: "توضیحات" }).optional(),
  logo_base64: z.string().optional(),
});

export const updateCompanySchema = z.object({
  id: z.string({ required_error: "This field is required" }),
  name: z
    .string({ required_error: "This field is required", description: "نام" })
    .min(3, "At least 3 characters"),
  description: z.string().nullish(),
  logo_base64: z.string().optional(),
});

export const companyIdSchema = z.object({
  id: z.string({ required_error: "This field is required" }),
});
