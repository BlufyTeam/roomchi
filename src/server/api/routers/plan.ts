import moment from "jalali-moment";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  planIdSchema,
  createPlanSchema,
  updatePlanSchema,
  planDateSchema,
  planDateAndRoomSchema,
} from "~/server/validations/plan.validation";
import { RoomStatus } from "~/types";

export function $exists<T>(ts: T[]): boolean {
  return ts.length > 0;
}
export const planRouter = createTRPCRouter({
  getPlansByRoomId: protectedProcedure
    .input(z.object({ roomId: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.plan.findMany({
        where: { roomId: input?.roomId },
      });
    }),
  getPlans: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.plan.findMany();
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
  getPlansByDateAndRoom: protectedProcedure
    .input(planDateAndRoomSchema)
    .query(({ ctx, input }) => {
      return ctx.prisma.plan.findMany({
        where: {
          roomId: input.roomId,
          OR: [
            {
              start_datetime: { lte: input?.end_datetime },
              end_datetime: { gte: input?.start_datetime },
            },
            {
              start_datetime: { gte: input?.start_datetime },
              end_datetime: { lte: input?.end_datetime },
            },
          ],
        },
        orderBy: { start_datetime: "desc" },
      });
    }),
  getPlansBetWeenDates: protectedProcedure
    .input(planDateSchema)
    .query(({ ctx, input }) => {
      return ctx.prisma.plan.findMany({
        where: {
          OR: [
            {
              start_datetime: { lte: input?.end_datetime },
              end_datetime: { gte: input?.start_datetime },
            },
            {
              start_datetime: { gte: input?.start_datetime },
              end_datetime: { lte: input?.end_datetime },
            },
          ],
        },
        include: {
          room: true,
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
            gte: input.date,
            lt: moment(input.date).endOf("day").toDate(),
          },
        },
        include: {
          room: true,
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
  createPlan: protectedProcedure
    .input(createPlanSchema)
    .mutation(async ({ input, ctx }) => {
      const isExists = await ctx.prisma.plan
        .findMany({
          where: {
            OR: [
              {
                start_datetime: { gte: input?.start_datetime },
                end_datetime: { lte: input?.end_datetime },
              },
            ],
          },
        })
        .then($exists);

      if (isExists) 
        return {
          code: 409,
          error: "جلسه ای در این زمان از قبل وجود دارد.",
        };
    
        return await ctx.prisma.plan.create({
          data: {
            title: input.title,
            userId: ctx.session.user.id,
            roomId: input.roomId,
            start_datetime: input.start_datetime,
            description: input.description,
            end_datetime: input.end_datetime,
          },
        });
      }
    }),
  updateUser: protectedProcedure
    .input(updatePlanSchema)
    .mutation(async ({ input, ctx }) => {
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
    }),

  deletePlan: protectedProcedure
    .input(planIdSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.plan.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
