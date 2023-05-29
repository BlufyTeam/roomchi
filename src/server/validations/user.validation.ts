import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string({ required_error: "این فیلد اجباری است" })
    .min(3, "حداقل باید 3 کاراکتر باشد"),
  email: z.string({ required_error: "این فیلد اجباری است" }).email(),
  username: z
    .string({ required_error: "این فیلد اجباری است" })
    .min(3, "یوزرنیم نمیتواند کمتر از 3 حرف باشد"),
  password: z
    .string({ required_error: "این فیلد اجباری است" })
    .min(6, "پسورد نمیتواند کمتر از 6 حرف باشد."),
  description: z.string().optional(),
  role: z.enum(["ADMIN", "USER"]),
});
