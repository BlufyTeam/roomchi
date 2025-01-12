import { TRPCError } from "@trpc/server";
import moment from "jalali-moment";
import momentTz from "moment-timezone";
import { tree } from "next/dist/build/templates/app-page";
import { z } from "zod";
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
      console.log(
        "hee",
        input.date,
        moment(new Date(input.date)).locale("en").utc().startOf("day").toDate()
      );
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
        const now = momentTz().subtract(3, "hours").subtract(30, "minutes"); // Subtract Tehran offset

        // Parse the start and end times
        const start = momentTz(plan.start_datetime);
        const end = momentTz(plan.end_datetime);

        // Log the raw UTC timestamps for debugging
        console.log({
          nowUTC: now.toISOString(), // Raw UTC string for now
          startUTC: start.toISOString(), // Raw UTC string for start
          endUTC: end.toISOString(), // Raw UTC string for end
        });

        console.log({
          i,
          title: plan.title,
          now: now.format("YYYY-MM-DD | HH:mm:ss"), // Now with manual subtraction
          start: start.format("YYYY-MM-DD | HH:mm:ss"), // Start time in local time
          end: end.format("YYYY-MM-DD | HH:mm:ss"), // End time in local time
          jalaliNow: now.format("YYYY/MM/DD | HH:mm:ss"), // Jalali date in local time
          IS: now.isBetween(start, end), // Check if now is between start and end
        });

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
      return ctx.prisma.plan.findMany({
        where: {
          start_datetime: { gte: input?.start_datetime },
          end_datetime: { lte: input?.end_datetime },

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

      console.log({
        input,

        lt,
      });
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

      console.log("Server's Time:", moment().format()); // UTC time
      console.log(
        "Local Time (Tehran):",
        momentTz().tz("Asia/Tehran").format()
      ); // Should show Tehran time
      return plans.map((plan, i) => {
        let status: RoomStatus = "Open"; // Default status
        console.log({ input });
        console.log({ start: plan.start_datetime });
        console.log({ end: plan.end_datetime });

        momentTz.locale("fa"); // Set the locale to Persian (fa)

        // Get the current time in UTC and subtract 3 hours and 30 minutes (Tehran offset)
        const now = momentTz().subtract(3, "hours").subtract(30, "minutes"); // Subtract Tehran offset

        // Parse the start and end times
        const start = momentTz(plan.start_datetime);
        const end = momentTz(plan.end_datetime);

        // Log the raw UTC timestamps for debugging
        console.log({
          nowUTC: now.toISOString(), // Raw UTC string for now
          startUTC: start.toISOString(), // Raw UTC string for start
          endUTC: end.toISOString(), // Raw UTC string for end
        });

        console.log({
          i,
          title: plan.title,
          now: now.format("YYYY-MM-DD | HH:mm:ss"), // Now with manual subtraction
          start: start.format("YYYY-MM-DD | HH:mm:ss"), // Start time in local time
          end: end.format("YYYY-MM-DD | HH:mm:ss"), // End time in local time
          jalaliNow: now.format("YYYY/MM/DD | HH:mm:ss"), // Jalali date in local time
          IS: now.isBetween(start, end), // Check if now is between start and end
        });

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

      // Check for overlapping plans
      const conflictingPlans = await ctx.prisma.plan.findMany({
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

      const plan = await ctx.prisma.plan.create({
        data: {
          title: input.title,
          userId: ctx.session.user.id,
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
              assignedBy: ctx.session.user.id,
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
          ctx,
          plan,
          "یک جلسه تشکل شد",
          "جزئیات جلسه",
          "CREATE"
        );
      return plan;
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
  //         "UPDATE"
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
          "DELETE"
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
