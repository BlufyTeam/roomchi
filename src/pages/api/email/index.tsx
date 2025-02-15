import { TRPCError } from "@trpc/server";
import Imap from "imap";
import moment from "jalali-moment";
import { simpleParser } from "mailparser";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";
import { Appointment, keepConnectionAlive } from "~/server/email";
import { sendPlanNotificationEmail } from "~/server/helpers/plan-notify";
import { createPlanSchema } from "~/server/validations/plan.validation";

let isRunning = false;
const imapConfig: Imap.Config = {
  user: "meet@rouginedarou.com", // Your Gmail address
  password: "MeEt123", // Your Gmail App Password
  host: "mail.rouginedarou.com", // Gmail IMAP server
  port: 993, // IMAP port (usually 993 for SSL)
  tls: true, // Use TLS
};
const imap = new Imap(imapConfig);
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!isRunning) {
    keepConnectionAlive(imap, async (appointment, action) => {
      if (action === "CREATE") {
        const session = await getServerAuthSession({ req, res });
        createAppointment(appointment, session.user.company.id);
      }
      if (action === "CANCELED") {
        deleteAppointment(appointment);
      }
    });

    isRunning = true;
    res.status(200).json({ message: "IMAP listener started" });
  } else {
    res.status(200).json({ message: "IMAP listener is already running" });
  }
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
  console.log("A PLAN CREATED ", plan);
  return plan;
}

async function createAppointment(appointment: Appointment, companyId) {
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

  console.log({ appointment: JSON.stringify(appointment, null, 2) });
}

async function deleteAppointment(appointment: Appointment) {
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
