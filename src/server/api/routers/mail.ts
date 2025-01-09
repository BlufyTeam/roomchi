import { z } from "zod";
import { getNodemailerTransport } from "~/lib/mail/nodemailer-config";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminAndSuperAdminProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import {
  nodemailerConfigSchema,
  sendEmailSchema,
} from "~/server/validations/mail.validation";

export interface AdminConfig {
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  emailFrom: string;
}

// const DEFAULT_CONFIG: AdminConfig = {
//   smtpHost: "smtp.example.com",
//   smtpPort: 587,
//   smtpSecure: false,
//   smtpUser: "user@example.com",
//   smtpPass: "password",
//   emailFrom: "noreply@example.com",
// };

export const mailRouter = createTRPCRouter({
  getAdminConfig: adminAndSuperAdminProcedure.query(async ({ input, ctx }) => {
    const config = await ctx.prisma.mailConfig.findFirst({
      orderBy: { created_at: "desc" },
    });
    return config;
  }),

  setAdminConfig: adminAndSuperAdminProcedure
    .input(nodemailerConfigSchema)
    .mutation(async ({ ctx, input }) => {
      const config = await ctx.prisma.mailConfig.findFirst({
        orderBy: { created_at: "desc" },
      });
      if (config) {
        return await ctx.prisma.mailConfig.update({
          where: {
            id: config.id,
          },
          data: {
            smtpHost: input.smtpHost,
            emailFrom: input.emailFrom,
            smtpPass: input.smtpPass,
            smtpPort: input.smtpPort,
            smtpSecure: input.smtpSecure,
            smtpUser: input.smtpUser,
          },
        });
      }
      return await ctx.prisma.mailConfig.create({
        data: {
          smtpHost: input.smtpHost,
          emailFrom: input.emailFrom,
          smtpPass: input.smtpPass,
          smtpPort: input.smtpPort,
          smtpSecure: input.smtpSecure,
          smtpUser: input.smtpUser,
        },
      });
    }),
  sendEmail: adminAndSuperAdminProcedure
    .input(sendEmailSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const transporter = await getNodemailerTransport();
        const adminConfig = await ctx.prisma.mailConfig.findFirst({
          orderBy: { created_at: "desc" },
        });
        const info = await transporter.sendMail({
          from: adminConfig.emailFrom,
          to: input.to,
          subject: input.subject,
          text: input.text,
          html: input.html,
        });
        console.log("Message sent: %s", info.messageId);
        return info;
      } catch (error) {
        console.error("Error sending email:", error);
        throw error;
      }
    }),
});

export async function getAdminConfig(): Promise<AdminConfig> {
  const config = await prisma.mailConfig.findFirst({
    orderBy: { created_at: "desc" },
  });

  return config;
}

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html?: string
) {
  try {
    const transporter = await getNodemailerTransport();
    const adminConfig = await getAdminConfig();
    const info = await transporter.sendMail({
      from: adminConfig.emailFrom,
      to,
      subject,
      text,
      html,
    });
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
