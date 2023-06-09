import { z } from "zod";

export const createRoomSchema = z.object({
  title: z.string({ required_error: "این فیلد اجباری است" }),
  image: z.string().optional(),
  price: z.number({ required_error: "این فیلد اجباری است" }),
  capacity: z.number({ required_error: "این فیلد اجباری است" }),
  description: z.string().optional(),
  companyId: z.string({ required_error: "این فیلد اجباری است" }),
});

export const roomIdSchema = z.object({
  id: z.string({ required_error: "این فیلد اجباری است" }),
});

export const updateRoomSchema = createRoomSchema.extend({
  id: z.string({ required_error: "این فیلد اجباری است" }),
});
