import { TRPCError } from "@trpc/server";
import moment from "jalali-moment";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  AdminProcedure,
} from "~/server/api/trpc";
import { $exists } from "~/server/helpers/exists";
import {
  planIdSchema,
  createPlanSchema,
  updatePlanSchema,
  planDateSchema,
  planDateAndRoomSchema,
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
      const plans = await ctx.prisma.plan.findMany({
        where: {
          roomId: input.roomId,
          start_datetime: {
            gte: input.date,
            lt: moment(input.date).locale("fa").endOf("day").toDate(),
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
  createPlan: AdminProcedure.input(createPlanSchema).mutation(
    async ({ input, ctx }) => {
      if (input.end_datetime <= input.start_datetime)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "زمان پایان نمی تواند مساوی یا کمتر از زمان شروع باشد",
        });
      const isExists = await ctx.prisma.plan
        .findMany({
          where: {
            start_datetime: {
              gte: moment(input.start_datetime).toISOString(),
            },
            end_datetime: {
              lte: moment(input.end_datetime).toISOString(),
            },
            roomId: input.roomId,
          },
        })
        .then($exists);

      if (isExists)
        throw new TRPCError({
          code: "CONFLICT",
          message: "جلسه ای در این زمان از قبل وجود دارد.",
        });

      return await ctx.prisma.plan.create({
        data: {
          title: input.title,
          userId: ctx.session.user.id,
          roomId: input.roomId,
          start_datetime: input.start_datetime,
          description: input.description,
          end_datetime: input.end_datetime,
          participants: {
            create: [
              {
                user: {
                  connect: {
                    id: ctx.session.user.id,
                  },
                },
                assignedBy: ctx.session.user.id,
              },
            ],
          },
        },
      });
    }
  ),
  updatePlan: AdminProcedure.input(updatePlanSchema).mutation(
    async ({ input, ctx }) => {
      return await ctx.prisma.plan.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          userId: input.userId,
          roomId: input.roomId,
          start_datetime: input.start_datetime,
          description: input.description,
          end_datetime: input.end_datetime,
        },
      });
    }
  ),
  deletePlan: AdminProcedure.input(planIdSchema).mutation(
    async ({ input, ctx }) => {
      await ctx.prisma.participants.deleteMany({
        where: {
          planId: input.id,
        },
      });

      return await ctx.prisma.plan.delete({
        where: {
          id: input.id,
        },
      });
    }
  ),
  joinPlan: protectedProcedure
    .input(z.object({ userId: z.string(), planId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { userId, planId } = input;
      const participant = await ctx.prisma.participants.create({
        data: {
          userId,
          planId,
          assignedAt: new Date(),
          assignedBy: userId, // You may replace this with the actual user who is performing the action
        },
      });
      return participant;
    }),
  exitPlan: protectedProcedure
    .input(z.object({ userId: z.string(), planId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { userId, planId } = input;
      const deletedParticipant = await ctx.prisma.participants.deleteMany({
        where: {
          userId,
          planId,
        },
      });
      return deletedParticipant;
    }),
});
