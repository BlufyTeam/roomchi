import { z } from "zod";
import { Base64 } from "js-base64";

export const updateCompanySchema = z.object({
  id: z.string({ required_error: "این فیلد اجباری است" }),
  name: z
    .string({ required_error: "این فیلد اجباری است", description: "نام" })
    .min(3, "حداقل باید 3 کاراکتر باشد"),
  description: z.string({ description: "توضیحات" }).optional(),
  logo_base64: z.string().optional(),
});

export const companyIdSchema = z.object({
  id: z.string({ required_error: "این فیلد اجباری است" }),
});
