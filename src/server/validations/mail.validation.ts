import { z } from "zod";

export const nodemailerConfigSchema = z.object({
  smtpHost: z.string(),
  smtpPort: z.number(),
  smtpSecure: z.boolean(),
  smtpUser: z.string(),
  smtpPass: z.string(),
  emailFrom: z.string(),
  sender_name: z.string().nullish(),
});

export const incomeMailConfigSchema = z.object({
  smtpHost: z.string(),
  smtpPort: z.number(),
  smtpSecure: z.boolean(),
  smtpUser: z.string(),
  smtpPass: z.string(),
});

export const sendEmailSchema = z.object({
  to: z.string(),
  subject: z.string(),
  text: z.string(),
  html: z.string().nullish(),
});
