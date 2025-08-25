import { TRPCError } from "@trpc/server";
import moment from "jalali-moment";
import momentTz from "moment-timezone";
import { tree } from "next/dist/build/templates/app-page";
import { z } from "zod";
import { createTransport } from "nodemailer";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminAndSuperAdminProcedure,
} from "~/server/api/trpc";
import { $exists } from "~/server/helpers/exists";
import { sendPlanNotificationEmail } from "~/server/helpers/plan-notify";
import {
  planIdSchema,
  createPlanSchema,
  updatePlanSchema,
  planDateSchema,
  planDateAndRoomSchema,
  planDeleteSchema,
} from "~/server/validations/plan.validation";
import { RoomStatus } from "~/types";
import ical, { ICalCalendarMethod } from "ical-generator";

export const planRouter = createTRPCRouter({
  getPlansByRoomId: protectedProcedure
    .input(z.object({ roomId: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.plan.findMany({
        where: { roomId: input?.roomId },
      });
    }),
  getPlans: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.plan.findMany({
      include: {
        room: true,
        participants: true,
      },
    });
  }),
  getPlanById: protectedProcedure
    .input(planIdSchema)
    .query(({ ctx, input }) => {
      return ctx.prisma.plan.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  getPlansByDateAndRoom: protectedProcedure // will be tablet or roomProcedure in the future
    .input(planDateAndRoomSchema)
    .query(async ({ ctx, input }) => {
      // console.log(
      //   "hee",
      //   input.date,
      //   moment(new Date(input.date)).locale("en").utc().startOf("day").toDate()
      // );
      const plans = await ctx.prisma.plan.findMany({
        where: {
          roomId: input.roomId,
          start_datetime: {
            gte: moment(new Date(input.date))
              .locale("en")
              .utc()
              .startOf("day")
              .toDate(),
            lt: moment(new Date(input.date))
              .locale("en")
              .utc()
              .endOf("day")
              .toDate(),
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
        orderBy: { start_datetime: "asc" },
      });

      return plans.map((plan, i) => {
        let status = "Open"; // Default status

        momentTz.locale("fa"); // Set the locale to Persian (fa)

        // Get the current time in UTC and subtract 3 hours and 30 minutes (Tehran offset)
        // const now = momentTz().subtract(3, "hours").subtract(30, "minutes"); // Subtract Tehran offset
        const now = momentTz(); // Subtract Tehran offset

        // Parse the start and end times
        const start = momentTz(plan.start_datetime);
        const end = momentTz(plan.end_datetime);

        // Log the raw UTC timestamps for debugging
        // console.log({
        //   nowUTC: now.toISOString(), // Raw UTC string for now
        //   startUTC: start.toISOString(), // Raw UTC string for start
        //   endUTC: end.toISOString(), // Raw UTC string for end
        // });

        // console.log({
        //   i,
        //   title: plan.title,
        //   now: now.format("YYYY-MM-DD | HH:mm:ss"), // Now with manual subtraction
        //   start: start.format("YYYY-MM-DD | HH:mm:ss"), // Start time in local time
        //   end: end.format("YYYY-MM-DD | HH:mm:ss"), // End time in local time
        //   jalaliNow: now.format("YYYY/MM/DD | HH:mm:ss"), // Jalali date in local time
        //   IS: now.isBetween(start, end), // Check if now is between start and end
        // });

        // Compare times
        if (now.isBetween(start, end)) status = "AlreadyStarted"; // If now is between start and end
        if (now.isAfter(end)) status = "Done"; // If now is after the end time
        if (now.isBefore(start)) status = "Reserved"; // If now is before the start time

        return {
          ...plan,
          status, // Add the computed status
        };
      });
    }),
  getPlansBetWeenDates: protectedProcedure
    .input(planDateSchema)
    .query(({ ctx, input }) => {
      // console.log({
      //   start_datetime: moment(input.start_datetime)
      //     .locale("fa")
      //     .format("YYYY M DD"),
      //   end_datetime: moment(input.end_datetime)
      //     .locale("fa")
      //     .format("YYYY M DD"),
      // });
      // console.log({
      //   start_datetime: moment(input.start_datetime)
      //     .locale("en")
      //     .format("YYYY M DD"),
      //   end_datetime: moment(input.end_datetime)
      //     .locale("en")
      //     .format("YYYY M DD"),
      // });

      return ctx.prisma.plan.findMany({
        where: {
          start_datetime: { gte: input?.start_datetime },
          end_datetime: { lte: input?.end_datetime },
          ...(input?.onlyPlansIParticipateIn
            ? {
                participants: {
                  some: {
                    userId: ctx.session.user.id,
                  },
                },
              }
            : {}),
          room: {
            companyId: ctx.session.user.companyId ?? "",
          },
        },
        include: {
          room: true,
          participants: true,
        },

        orderBy: { start_datetime: "desc" },
      });
    }),
  // for admin
  getPlansByDate: protectedProcedure
    .input(z.object({ date: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const date = moment(input.date);

      // Convert to Jalali and calculate the start and end of the day

      // Convert to Gregorian and calculate gte and lt in UTC

      const lt = date
        .clone()
        .add(1, "day")
        .subtract(1, "millisecond")
        .utc()
        .toISOString(); // End of the next day in UTC

      // console.log({
      //   input,

      //   lt,
      // });
      const plans = await ctx.prisma.plan.findMany({
        where: {
          start_datetime: {
            gte: moment(new Date(input.date))
              .locale("en")
              .utc()
              .startOf("day")
              .toDate(),
            lt: moment(new Date(input.date))
              .locale("en")
              .utc()
              .endOf("day")
              .toDate(),
          },
          room: {
            companyId: ctx.session.user.companyId,
          },
        },
        include: {
          room: true,
          participants: true,
        },
        orderBy: { start_datetime: "asc" },
      });

      // console.log("Server's Time:", moment().format()); // UTC time
      // console.log(
      //   "Local Time (Tehran):",
      //   momentTz().tz("Asia/Tehran").format()
      // ); // Should show Tehran time
      return plans.map((plan, i) => {
        let status: RoomStatus = "Open"; // Default status
        // console.log({ input });
        // console.log({ start: plan.start_datetime });
        // console.log({ end: plan.end_datetime });

        momentTz.locale("fa"); // Set the locale to Persian (fa)

        // Get the current time in UTC and subtract 3 hours and 30 minutes (Tehran offset)
        // const now = momentTz().subtract(3, "hours").subtract(30, "minutes"); // Subtract Tehran offset
        const now = momentTz(); // Subtract Tehran offset

        // Parse the start and end times
        const start = momentTz(plan.start_datetime);
        const end = momentTz(plan.end_datetime);

        // Log the raw UTC timestamps for debugging
        // console.log({
        //   nowUTC: now.toISOString(), // Raw UTC string for now
        //   startUTC: start.toISOString(), // Raw UTC string for start
        //   endUTC: end.toISOString(), // Raw UTC string for end
        // });

        // console.log({
        //   i,
        //   title: plan.title,
        //   now: now.format("YYYY-MM-DD | HH:mm:ss"), // Now with manual subtraction
        //   start: start.format("YYYY-MM-DD | HH:mm:ss"), // Start time in local time
        //   end: end.format("YYYY-MM-DD | HH:mm:ss"), // End time in local time
        //   jalaliNow: now.format("YYYY/MM/DD | HH:mm:ss"), // Jalali date in local time
        //   IS: now.isBetween(start, end), // Check if now is between start and end
        // });

        // Compare times
        if (now.isBetween(start, end)) status = "AlreadyStarted"; // If now is between start and end
        if (now.isAfter(end)) status = "Done"; // If now is after the end time
        if (now.isBefore(start)) status = "Reserved"; // If now is before the start time

        return {
          ...plan,
          status, // Add the computed status
        };
      });
    }),
  createPlan: adminAndSuperAdminProcedure
    .input(createPlanSchema)
    .mutation(async ({ input, ctx }) => {
      if (
        moment(input.end_datetime).isSameOrBefore(moment(input.start_datetime))
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "زمان پایان نمی تواند مساوی یا کمتر از زمان شروع باشد",
        });
      }

      // Check for overlapping plans efficiently
      const conflictCount = await ctx.prisma.plan.count({
        where: {
          roomId: input.roomId,
          start_datetime: { lt: input.end_datetime },
          end_datetime: { gt: input.start_datetime },
        },
      });

      if (conflictCount > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "جلسه ای در این بازه زمانی از قبل وجود دارد.",
        });
      }

      let currentStart = moment(input.start_datetime);
      let currentEnd = moment(input.end_datetime);
      const endDate = moment(input.repeatUntilDate);
      const plansToCreate = [];

      while (moment(currentStart).isSameOrBefore(endDate)) {
        plansToCreate.push({
          title: input.title,
          userId: ctx.session.user.id,
          roomId: input.roomId,
          start_datetime: currentStart.toDate(),
          end_datetime: currentEnd.toDate(),
          description: input.description,
          is_confidential: input.is_confidential,
          link: input?.link,
          participants: {
            create: input.participantsIds.map((participantId) => ({
              user: { connect: { id: participantId } },
              hasAccepted: true,
              assignedBy: ctx.session.user.id,
            })),
          },
        });

        switch (input.repeatType) {
          case "daily":
            currentStart.add(1, "day");
            currentEnd.add(1, "day");
            break;
          case "weekly":
            currentStart.add(1, "week");
            currentEnd.add(1, "week");
            break;
          case "monthly":
            currentStart.add(1, "month");
            currentEnd.add(1, "month");
            break;
          case "none":
            break;
        }

        if (input.repeatType === "none") break;
      }

      // Create all plans in one transaction
      const createdPlans = await ctx.prisma.$transaction(
        plansToCreate.map((plan) => ctx.prisma.plan.create({ data: plan }))
      );

      if (input.send_email) {
        // Send Outlook calendar invitation once after all plans are created
        await sendOutlookCalendarInvite(ctx, input, createdPlans);
      }

      return createdPlans;
    }),
  // updatePlan: AdminProcedure.input(updatePlanSchema).mutation(
  //   async ({ input, ctx }) => {
  //     const plan = await ctx.prisma.plan.update({
  //       where: {
  //         id: input.id,
  //       },
  //       data: {
  //         title: input.title,
  //         userId: input.userId,
  //         roomId: input.roomId,
  //         start_datetime: input.start_datetime,
  //         description: input.description,
  //         end_datetime: input.end_datetime,
  //       },
  //       include: {
  //         room: true,
  //       },
  //     });

  //     if (input.send_email)
  //       await sendPlanNotificationEmail(
  //         ctx,
  //         plan,
  //         "جلسه ویرایش شد",
  //         "جزئیات جلسه",
  //         "UPDATE",
  //          ctx.session.user.company.id
  //       );
  //     return plan;
  //   }
  // ),
  deletePlan: adminAndSuperAdminProcedure
    .input(planDeleteSchema)
    .mutation(async ({ input, ctx }) => {
      const [participant, plan] = await ctx.prisma.$transaction(async (tx) => [
        await ctx.prisma.participant.deleteMany({
          where: {
            planId: input.id,
          },
        }),

        await ctx.prisma.plan.delete({
          where: {
            id: input.id,
          },
          include: {
            room: true,
            participants: {
              include: {
                user: true,
              },
            },
          },
        }),
      ]);

      if (input.send_email) {
        await sendPlanNotificationEmail(
          ctx,
          plan,
          "جلسه لغو شد",
          "جزئیات جلسه",
          "DELETE",
          ctx.session.user.company.id
        );
      }
      return plan;
    }),
  joinPlan: protectedProcedure
    .input(z.object({ userId: z.string(), planId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { userId, planId } = input;

      const participant = await ctx.prisma.participant.update({
        where: {
          planId_userId: {
            planId: planId,
            userId: userId,
          },
        },
        data: {
          hasAccepted: true,
        },
      });
    }),
  exitPlan: protectedProcedure
    .input(z.object({ userId: z.string(), planId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { userId, planId } = input;
      const participant = await ctx.prisma.participant.update({
        where: {
          planId_userId: {
            planId: planId,
            userId: userId,
          },
        },
        data: {
          hasAccepted: false,
        },
      });
    }),
});

async function sendOutlookCalendarInvite(ctx, input, createdPlans) {
  if (!createdPlans.length) return;

  const [participants, room, config] = await Promise.all([
    ctx.prisma.user.findMany({ where: { id: { in: input.participantsIds } } }),
    ctx.prisma.room.findFirst({ where: { id: input.roomId } }),
    ctx.prisma.mailConfig.findFirst({
      where: { companyId: ctx.session.user.company.id },
    }),
  ]);

  if (!room || !config) return;

  const senderName = config.sender_name;
  const calendar = ical({
    events: createdPlans.map((plan) => ({
      start: plan.start_datetime,
      end: plan.end_datetime,
      summary: input.title,
      description: input.description,
      location: room.title,
      organizer: {
        name: senderName,
        email: ctx.session.user.email,
      },
      attendees: participants.map((user) => ({
        email: user.email,
        name: user.name,
        rsvp: true,
      })),
      ...(input.repeatType !== "none" && {
        repeating: {
          freq: input.repeatType.toUpperCase(), // DAILY, WEEKLY, MONTHLY
          until: moment(input.repeatUntilDate).toDate(),
        },
      }),
    })),
    method: ICalCalendarMethod.REQUEST,
    name: input.title,
  });

  // Convert the calendar to string first
  let icsContent = calendar.toString();

  // Manually add VALARM for notifications (to the first event)
  const alarm = `
      BEGIN:VALARM
      ACTION:DISPLAY
      DESCRIPTION:Reminder
      TRIGGER:-PT15M
      END:VALARM
      `;

  // You need to add the VALARM block to the content of each event.
  // This will find and inject the alarm for the first event, but you can modify it to handle multiple events.

  icsContent = icsContent.replace("BEGIN:VEVENT", `BEGIN:VEVENT${alarm}`);

  const transporter = createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  });

  const message = {
    from: `${senderName} <${ctx.session.user.email}>`,
    to: participants.map((a) => a.email).join(","),
    subject: input.title,
    text: input.description,
    icalEvent: {
      content: calendar.toString(),
    },
  };

  await transporter.sendMail(message);
}

// async function deleteOutlookCalendarInvite(ctx, input, createdPlans) {
//   if (!createdPlans.length) return;

//   const [participants, config] = await Promise.all([
//     ctx.prisma.user.findMany({ where: { id: { in: input.participantsIds } } }),
//     ctx.prisma.mailConfig.findFirst({
//       where: { companyId: ctx.session.user.company.id },
//     }),
//   ]);

//   if (!config  !participants.length) return;

//   // Minimal iCal event with METHOD:CANCEL and STATUS:CANCELLED
//   const calendar = ical({
//     events: createdPlans.map((plan) => ({
//       uid: plan.uid  ${plan.start_datetime.toISOString()}@${ctx.session.user.company.id},
//       start: plan.start_datetime,
//       end: plan.end_datetime,
//       summary: input.title,
//       status: 'CANCELLED',
//     })),
//     method: 'CANCEL',
//   });

//   const transporter = createTransport({
//     host: config.smtpHost,
//     port: config.smtpPort,
//     secure: config.smtpSecure,
//     auth: {
//       user: config.smtpUser,
//       pass: config.smtpPass,
//     },
//   });

//   const message = {
//     from: ${ctx.session.user.company.name} <${ctx.session.user.email}>,
//     to: participants.map((a) => a.email).join(","),
//     subject: Cancellation: ${input.title},
//     text: The event "${input.title}" has been cancelled.,
//     icalEvent: {
//       method: "CANCEL",
//       content: calendar.toString(),
//     },
//   };

//   await transporter.sendMail(message);
// }
