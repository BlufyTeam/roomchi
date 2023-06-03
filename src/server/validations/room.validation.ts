import { z } from "zod";

export const updateRoomSchema = z.object({
  id: z.string({ required_error: "این فیلد اجباری است" }),
  title: z.string({
    required_error: "این فیلد اجباری است",
    description: "نام",
  }),
  description: z.string({ description: "توضیحات" }).optional(),
  image: z.string().optional(),
  price: z.number().optional(),
  capacity: z.number().optional(),
  companyId: z.string(),
});

export const roomIdSchema = z.object({
  id: z.string({ required_error: "این فیلد اجباری است" }),
});

export const createRoomSchema = z.object({
  title: z.string({ required_error: "این فیلد اجباری است" }),
  image: z.string().optional(),
  price: z.number({ required_error: "این فیلد اجباری است" }),
  capacity: z.number({ required_error: "این فیلد اجباری است" }),
  description: z.string().optional(),
  companyId: z.string({ required_error: "این فیلد اجباری است" }),
});
