import { z } from "zod";

// Update the role enum to include "SUPER_ADMIN"
const baseUserSchema = z.object({
  name: z
    .string({ required_error: "This field is required" })
    .min(3, "At least 3 characters"),
  email: z.string().nullish(),
  username: z
    .string({ required_error: "This field is required" })
    .min(3, "Username can not be less than 3 characters"),
  password: z.string().nullish(), // Allow null initially
  description: z.string().optional(),
  // Add "SUPER_ADMIN" to the role enum
  role: z.enum(["ADMIN", "USER", "ROOM", "SUPER_ADMIN"], {
    required_error: "User role is mandatory",
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
    user_type: z.enum(["DOMAIN", "LOCAL"]).optional(), // Add user_type for condition checking
  })
  .superRefine((data, ctx) => {
    // Allow password to be null only if user_type is DOMAIN
    if (data.user_type === "LOCAL" && !data.password) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "Password is required unless user_type is DOMAIN.",
      });
    }

    // If SUPER_ADMIN, companyId must be null
    if (data.role === "SUPER_ADMIN" && data.companyId) {
      ctx.addIssue({
        code: "custom",
        path: ["companyId"],
        message: "SUPER_ADMIN should not have a companyId.",
      });
    }

    // If not SUPER_ADMIN, companyId is required
    if (data.role !== "SUPER_ADMIN" && !data.companyId) {
      ctx.addIssue({
        code: "custom",
        path: ["companyId"],
        message: "companyId is required for non-SUPER_ADMIN roles.",
      });
    }
  });

export const userIdSchema = z.object({
  id: z.string({ required_error: "This field is required" }),
});

export const userLoginSchema = z.object({
  username: z
    .string({ required_error: "This field is required" })
    .min(3, "Username can not be less than 3 characters"),
  password: z
    .string({ required_error: "This field is required" })
    .min(6, "Password can not be less than 3 characters"),
});

export const createAcUserSchema = z.array(
  z.object({
    email: z.string().nullish(),
    display_name: z
      .string({ required_error: "This field is required" })
      .min(3, "Username can not be less than 3 characters"),
    username: z
      .string({ required_error: "This field is required" })
      .min(3, "Username can not be less than 3 characters"),
  })
);
