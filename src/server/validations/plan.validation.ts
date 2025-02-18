import { z } from "zod";

export const updatePlanSchema = z.object({
  id: z.string({ required_error: "This field is required" }),
  title: z.string({ required_error: "This field is required" }),
  userId: z.string({ required_error: "This field is required" }),
  roomId: z.string({ required_error: "This field is required" }),
  start_datetime: z.date({ required_error: "This field is required" }),
  end_datetime: z.date({ required_error: "This field is required" }),
  description: z.string().optional(),
  send_email: z.boolean().default(false),
});

export const planIdSchema = z.object({
  id: z.string({ required_error: "This field is required" }),
});
export const planDeleteSchema = z.object({
  id: z.string({ required_error: "This field is required" }),
  send_email: z.boolean().default(false),
});

export const planDateAndRoomSchema = z.object({
  roomId: z.string({ required_error: "This field is required" }),
  date: z.string(),
});
export const planDateSchema = z.object({
  start_datetime: z.date(),
  end_datetime: z.date(),
  onlyPlansIParticipateIn: z.boolean().optional().default(false),
});

export const createPlanSchema = z.object({
  room: z.any({ required_error: "Choosing room is mandatory" }),
  title: z.string({ required_error: "Title is mandatory" }),
  roomId: z.string({ required_error: "Choosing room is mandatory" }),
  start_datetime: z.date({ required_error: "This field is required" }),
  end_datetime: z.date({ required_error: "This field is required" }),
  description: z.string().optional(),
  link: z.string().nullish().optional(),
  is_confidential: z.boolean().default(false),
  send_email: z.boolean().default(false),
  participantsIds: z.array(z.string()),

  // repeatType: z.string(z.enum(["none", "daily", "weekly", "monthly"])),
  // repeatUntilDate: z.date({ required_error: "This field is required" }),
});
