import { TRPCError } from "@trpc/server";
import moment from "jalali-moment";
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
      const nowTime = moment(input.date).locale("fa").toDate();
      const endOfDay = moment(input.date).locale("fa").endOf("day").toDate(); // End of day in server's local time
      console.log({
        date: input.date,
        nowTime: moment(input.date).locale("fa"),
      });
      console.log({
        dateEnd: endOfDay,
        end: moment(input.date).locale("fa").endOf("day"),
      });

      const plans = await ctx.prisma.plan.findMany({
        where: {
          roomId: input.roomId,
          start_datetime: {
            gte: nowTime,
            lt: endOfDay,
          },
        },
        include: {
          room: true,
          participants: true,
        },
        orderBy: { start_datetime: "asc" },
      });

      return plans.map((plan) => {
        let status: RoomStatus = "Open";

        if (moment().isBetween(plan.start_datetime, plan.end_datetime))
          status = "AlreadyStarted";
        if (moment().isAfter(plan.end_datetime)) status = "Done";
        if (moment().isBefore(plan.start_datetime)) status = "Reserved";

        return {
          ...plan,
          status,
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
  getPlansByDate: protectedProcedure
    .input(z.object({ date: z.date().optional() }).optional())
    .query(async ({ ctx, input }) => {
      console.log({
        input,
        start: moment(input.date).locale("fa").startOf("day").toDate(),
      });

      const plans = await ctx.prisma.plan.findMany({
        where: {
          start_datetime: {
            gte: moment(input.date).locale("fa").startOf("day").toDate(),
            lt: moment(input.date).locale("fa").endOf("day").toDate(),
          },
          room: {
            companyId: ctx.session.user.companyId,
          },
        },
        include: {
          room: true,
          participants: true,
        },
        orderBy: { start_datetime: "desc" },
      });

      return plans.map((plan) => {
        let status: RoomStatus = "Open";

        if (moment().isBetween(plan.start_datetime, plan.end_datetime))
          status = "AlreadyStarted";
        if (moment().isAfter(plan.end_datetime)) status = "Done";
        if (moment().isBefore(plan.start_datetime)) status = "Reserved";

        return {
          ...plan,
          status,
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
          participants: {
            create: input.participantsIds.map((participantId) => ({
              user: {
                connect: {
                  id: participantId, // Replace with the participant's user ID
                },
              },
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
