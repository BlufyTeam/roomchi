import { z } from "zod";

export const createCompanySchema = z.object({
  name: z
    .string({ required_error: "این فیلد اجباری است", description: "نام" })
    .min(3, "حداقل باید 3 کاراکتر باشد"),
  description: z.string({ description: "توضیحات" }).optional(),
  logo_base64: z.string().optional(),
});

export const updateCompanySchema = z.object({
  id: z.string({ required_error: "این فیلد اجباری است" }),
  name: z
    .string({ required_error: "این فیلد اجباری است", description: "نام" })
    .min(3, "حداقل باید 3 کاراکتر باشد"),
  description: z.string().nullish(),
  logo_base64: z.string().optional(),
});

export const companyIdSchema = z.object({
  id: z.string({ required_error: "این فیلد اجباری است" }),
});
