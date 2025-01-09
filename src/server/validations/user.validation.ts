import { z } from "zod";

// Update the role enum to include "SUPER_ADMIN"
const baseUserSchema = z.object({
  name: z
    .string({ required_error: "این فیلد اجباری است" })
    .min(3, "حداقل باید 3 کاراکتر باشد"),
  email: z.string().nullish(),
  username: z
    .string({ required_error: "این فیلد اجباری است" })
    .min(3, "یوزرنیم نمیتواند کمتر از 3 حرف باشد"),
  password: z
    .string({ required_error: "این فیلد اجباری است" })
    .min(6, "پسورد نمیتواند کمتر از 6 حرف باشد."),
  description: z.string().optional(),
  // Add "SUPER_ADMIN" to the role enum
  role: z.enum(["ADMIN", "USER", "ROOM", "SUPER_ADMIN"], {
    required_error: "نقش کاربری اجباری است",
  }),
  companyId: z.string().optional(),
});

// Add the refinement logic (produces a ZodEffects)
export const createUserSchema = baseUserSchema.superRefine((data, ctx) => {
  // Only require companyId if the role is not ADMIN or SUPER_ADMIN
  if (data.role !== "ADMIN" && data.role !== "SUPER_ADMIN" && !data.companyId) {
    ctx.addIssue({
      code: "custom",
      path: ["companyId"],
      message: "companyId is required for non-ADMIN and non-SUPER_ADMIN roles.",
    });
  }
});

// Extend the base schema for the update schema
export const updateUserSchema = baseUserSchema
  .extend({
    id: z.string(),
  })
  .superRefine((data, ctx) => {
    // For updating, if the user is SUPER_ADMIN, no need for companyId
    if (data.role === "SUPER_ADMIN" && data.companyId) {
      ctx.addIssue({
        code: "custom",
        path: ["companyId"],
        message: "SUPER_ADMIN should not have a companyId.",
      });
    }

    // If the role is not SUPER_ADMIN, companyId must be present
    if (data.role !== "SUPER_ADMIN" && !data.companyId) {
      ctx.addIssue({
        code: "custom",
        path: ["companyId"],
        message: "companyId is required for non-SUPER_ADMIN roles.",
      });
    }
  });

export const userIdSchema = z.object({
  id: z.string({ required_error: "این فیلد اجباری است" }),
});

export const userLoginSchema = z.object({
  username: z
    .string({ required_error: "این فیلد اجباری است" })
    .min(3, "یوزرنیم نمیتواند کمتر از 3 حرف باشد"),
  password: z
    .string({ required_error: "این فیلد اجباری است" })
    .min(6, "پسورد نمیتواند کمتر از 6 حرف باشد."),
});
