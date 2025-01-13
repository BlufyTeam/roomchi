import { z } from "zod";

export const createRoomSchema = z.object({
  title: z.string({ required_error: "This field is required" }),
  image: z.string().optional(),
  price: z.number({ required_error: "This field is required" }),
  capacity: z.number({ required_error: "This field is required" }),
  description: z.string().optional(),
  companyId: z.string({ required_error: "This field is required" }),
});

export const roomIdSchema = z.object({
  id: z.string({ required_error: "This field is required" }),
});

export const updateRoomSchema = createRoomSchema.extend({
  id: z.string({ required_error: "This field is required" }),
});
