import { z } from "zod";
import { Base64 } from "js-base64";

export const updateCompanySchema = z.object({
  id: z.string({ required_error: "این فیلد اجباری است" }),
  name: z
    .string({ required_error: "این فیلد اجباری است" })
    .min(3, "حداقل باید 3 کاراکتر باشد"),
  description: z.string().optional(),
  logo_url: z.string().optional().refine(Base64.isValid, {
    message: "error:its not base64",
  }),
});

export const companyIdSchema = z.object({
  id: z.string({ required_error: "این فیلد اجباری است" }),
});
