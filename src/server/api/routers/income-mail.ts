import Imap from "imap";
import ICAL from "ical.js";

import { simpleParser } from "mailparser";
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
  incomeMailConfigSchema,
  nodemailerConfigSchema,
  sendEmailSchema,
} from "~/server/validations/mail.validation";
import { api } from "~/utils/api";

import { TRPCError } from "@trpc/server";
import moment from "jalali-moment";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "~/server/auth";
import { Appointment, keepConnectionAlive } from "~/server/email";
import { sendPlanNotificationEmail } from "~/server/helpers/plan-notify";
import { createPlanSchema } from "~/server/validations/plan.validation";

const emailSchema = z.object({
  id: z.string(),
  subject: z.string().nullable(),
  from: z.string().nullable(),
  date: z.string().nullable(),
  text: z.string().nullable(),
  html: z.string().nullable(),
});

export const incomeMailRouter = createTRPCRouter({
  getAdminConfig: adminAndSuperAdminProcedure.query(async ({ input, ctx }) => {
    const config = await ctx.prisma.incomeMailConfig.findFirst({
      where: {
        company: {
          id: ctx.session.user.company.id,
        },
      },
    });
    return config;
  }),

  setAdminConfig: adminAndSuperAdminProcedure
    .input(incomeMailConfigSchema)
    .mutation(async ({ ctx, input }) => {
      const config = await ctx.prisma.incomeMailConfig.findFirst({
        where: {
          company: {
            id: ctx.session.user.company.id,
          },
        },
      });

      if (config) {
        return await ctx.prisma.incomeMailConfig.update({
          where: {
            id: config.id,
          },
          data: {
            smtpHost: input.smtpHost,
            smtpPass: input.smtpPass,
            smtpPort: input.smtpPort,
            smtpSecure: input.smtpSecure,
            smtpUser: input.smtpUser,
            company: {
              connect: {
                id: ctx.session.user.company.id,
              },
            },
          },
        });
      }
      return await ctx.prisma.incomeMailConfig.create({
        data: {
          smtpHost: input.smtpHost,

          smtpPass: input.smtpPass,
          smtpPort: input.smtpPort,
          smtpSecure: input.smtpSecure,
          smtpUser: input.smtpUser,
          company: {
            connect: {
              id: ctx.session.user.company.id,
            },
          },
        },
      });
    }),
  runIncommingEmailListener: adminAndSuperAdminProcedure.mutation(
    async ({ ctx, input }) => {
      const config = await ctx.prisma.incomeMailConfig.findFirst({
        where: {
          company: {
            id: ctx.session.user.company.id,
          },
        },
      });
      // console.log({ config });

      runConnection(
        {
          user: config.smtpUser,
          password: config.smtpPass,
          host: config.smtpHost,
          port: config.smtpPort,
          tls: config.smtpSecure,

          authTimeout: 1000 * 60,
          connTimeout: 1000 * 60,
          tlsOptions: {
            rejectUnauthorized: true,
          },

          keepalive: {
            interval: 10000, // Send a NOOP command every 10 seconds
            idleInterval: 300000, // IDLE command every 5 minutes
            forceNoop: true, // Ensures NOOP is sent even when IDLE is supported
          },
        },
        ctx.session.user.company.id
      );
      return config;
    }
  ),
  stopIncommingEmailListener: adminAndSuperAdminProcedure.mutation(
    async ({ ctx, input }) => {
      stopConnection(ctx.session.user.company.id);
      return true;
    }
  ),
  isIncommingMailConnectionRunning: adminAndSuperAdminProcedure.query(
    async ({ ctx, input }) => {
      console.log({ imapInstances: imapInstances.size });
      return isConnectionRunning(ctx.session.user.company.id);
    }
  ),
});

const imapInstances = new Map<string, Imap>(); // Store IMAP connections globally

export function runConnection(imapConfig: Imap.Config, companyId: string) {
  if (imapInstances.has(companyId)) {
    console.log(`IMAP listener already running for company: ${companyId}`);
    return { message: "IMAP listener is already running" };
  }

  let imapInstance = new Imap(imapConfig);
  imapInstances.set(companyId, imapInstance);

  keepConnectionAlive(imapInstance, (appointment, action) => {
    if (action === "CREATE") {
      createAppointment(appointment, companyId);
    }
    if (action === "CANCELED") {
      deleteAppointment(appointment);
    }
  });

  imapInstance.once("end", () => {
    console.log(`IMAP connection closed for company: ${companyId}`);
    imapInstance.end();
    setTimeout(() => {
      imapInstance.connect();
    }, 2000);
    // imapInstances.delete(companyId); // Remove instance on disconnect
  });

  imapInstance.once("error", (err) => {
    console.error("IMAP connection error:", err);
    imapInstance.end();
    setTimeout(() => {
      imapInstance.connect();
    }, 2000);
  });
  imapInstance.connect(); // Start IMAP connection

  return { message: "IMAP listener started" };
}

export function stopConnection(companyId: string) {
  const imap = imapInstances.get(companyId);
  if (!imap) {
    return { message: "No IMAP listener is running for this company" };
  }

  imap.end(); // Gracefully close the connection
  imapInstances.delete(companyId);
  return { message: `IMAP listener stopped for company: ${companyId}` };
}

export function isConnectionRunning(companyId: string) {
  return imapInstances.has(companyId);
}

type CreatePlanInput = z.infer<typeof createPlanSchema>;
async function createPlan(input: CreatePlanInput, userId, companyId) {
  if (moment(input.end_datetime).isSameOrBefore(moment(input.start_datetime))) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "زمان پایان نمی تواند مساوی یا کمتر از زمان شروع باشد",
    });
  }

  // Check for overlapping plans
  const conflictingPlans = await prisma.plan.findMany({
    where: {
      roomId: input.roomId,
      AND: [
        {
          start_datetime: {
            lt: input.end_datetime, // Existing plan starts before the new plan ends
          },
        },
        {
          end_datetime: {
            gt: input.start_datetime, // Existing plan ends after the new plan starts
          },
        },
      ],
    },
  });

  if (conflictingPlans.length > 0) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "جلسه ای در این بازه زمانی از قبل وجود دارد.",
    });
  }

  const plan = await prisma.plan.create({
    data: {
      title: input.title,
      userId: userId,
      roomId: input.roomId,
      start_datetime: input.start_datetime,
      description: input.description,
      end_datetime: input.end_datetime,
      is_confidential: input.is_confidential,
      link: input?.link,
      participants: {
        create: input.participantsIds.map((participantId) => ({
          user: {
            connect: {
              id: participantId, // Replace with the participant's user ID
            },
          },
          hasAccepted: true,
          assignedBy: userId,
        })),
      },
    },
    include: {
      room: true,
      participants: {
        include: {
          user: true,
        },
      },
    },
  });

  // Notify the users about the new plan

  if (input.participantsIds.length > 0 && input.send_email)
    await sendPlanNotificationEmail(
      undefined,
      plan,
      "یک جلسه تشکل شد",
      "جزئیات جلسه",
      "CREATE",
      companyId
    );
  // console.log("A PLAN CREATED ", plan);
  return plan;
}

export async function createAppointment(appointment: Appointment, companyId) {
  // TODO: create new plan
  console.log("Creating Appointment");
  try {
    const user = await prisma.user.findFirst({
      where: {
        role: "ADMIN",
      },
    });
    const room = await prisma.room.findFirst({
      where: {
        title: appointment.location.trim(),
      },
    });

    if (!room) {
      console.log("Room does not exists");
      return;
    }

    const participants = await prisma.user.findMany({
      where: {
        email: {
          in: appointment.attendees.map((a) => {
            return a.email.split(":")[1];
          }),
        },
      },
    });
    await createPlan(
      {
        room: appointment.location.trim(),
        roomId: room.id,
        start_datetime: new Date(appointment.start),
        end_datetime: new Date(appointment.end),
        description: appointment.description,
        title: appointment.subject,
        participantsIds: participants.map((a) => a.id),
        is_confidential: appointment.isPrivate,
        send_email: false,
      },
      user.id,
      companyId
    );
  } catch {}

  // console.log({ appointment: JSON.stringify(appointment, null, 2) });
}

export async function deleteAppointment(appointment: Appointment) {
  console.log("Deleting Appointment");
  await prisma.$transaction(async (tx) => {
    await prisma.participant.deleteMany({
      where: {
        user: {
          email: {
            in: appointment.attendees.map((a) => {
              return a.email.split(":")[1];
            }),
          },
        },
      },
    });

    const plan = await prisma.plan.findFirst({
      where: {
        start_datetime: new Date(appointment.start),
        end_datetime: new Date(appointment.end),
        room: {
          title: appointment.location.trim(),
        },
      },
    });
    await prisma.plan.delete({
      where: {
        id: plan.id,
      },
    });
  });
}
