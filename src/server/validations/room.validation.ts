import { z } from "zod";
import { Base64 } from "js-base64";

export const updateRoomSchema = z.object({
  id: z.string({ required_error: "این فیلد اجباری است" }),
  title: z.string({
    required_error: "این فیلد اجباری است",
    description: "نام",
  }),
  description: z.string({ description: "توضیحات" }).optional(),
  logo_rule: z.string().optional(),
  price: z.number().optional(),
  capacity: z.number().optional(),
  companyId: z.string(),
});

export const roomIdSchema = z.object({
  id: z.string({ required_error: "این فیلد اجباری است" }),
});

export const createRoomSchema = z.object({
  title: z.string({ required_error: "این فیلد اجباری است" }),
  logo_rule: z.string(),
  price: z.number(),
  capacity: z.number(),
  description: z.string().optional(),
  companyId: z.string({ required_error: "این فیلد اجباری است" }),
});
