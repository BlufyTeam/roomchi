import { z } from "zod";

export const updatePlanSchema = z.object({
  id: z.string({ required_error: "این فیلد اجباری است" }),
  title: z.string({ required_error: "این فیلد اجباری است" }),
  userId: z.string({ required_error: "این فیلد اجباری است" }),
  roomId: z.string({ required_error: "این فیلد اجباری است" }),
  start_datetime: z.date({ required_error: "این فیلد اجباری است" }),
  end_datetime: z.date({ required_error: "این فیلد اجباری است" }),
  description: z.string().optional(),
});

export const planIdSchema = z.object({
  id: z.string({ required_error: "این فیلد اجباری است" }),
});
export const planDateAndRoomSchema = z.object({
  roomId: z.string({ required_error: "این فیلد اجباری است" }),
  start_datetime: z.date(),
  end_datetime: z.date(),
});
export const planDateSchema = z.object({
  start_datetime: z.date(),
  end_datetime: z.date(),
});

export const createPlanSchema = z.object({
  room: z.any({ required_error: "انتخاب اتاق ضروری است" }),
  title: z.string({ required_error: "داشتن عنوان اجباری است " }),
  roomId: z.string({ required_error: "انتخاب اتاق اجباری است " }),
  start_datetime: z.date({ required_error: "این فیلد اجباری است" }),
  end_datetime: z.date({ required_error: "این فیلد اجباری است" }),
  description: z.string().optional(),
});
