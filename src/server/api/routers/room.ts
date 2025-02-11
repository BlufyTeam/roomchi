import moment from "jalali-moment";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  roomIdSchema,
  createRoomSchema,
  updateRoomSchema,
} from "~/server/validations/room.validation";
import { RoomStatus } from "~/types";

export const roomRouter = createTRPCRouter({
  getRoomsByCompanyId: protectedProcedure
    .input(z.object({ companyId: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.room.findMany({
        where: { companyId: input?.companyId ?? ctx.session.user.companyId },
        include: {
          plans: true,
        },
      });

      // rooms.map((room) => {

      //   const isRoomAvalibleNow = !moment(Date.now()).isBetween(
      //     room.plans[0].start_datetime,
      //     room.plans[0].end_datetime
      //   );

      //   const isRoomOcupied = moment(Date.now()).isBetween(
      //     room.plans[0].start_datetime,
      //     room.plans[0].end_datetime
      //   );
      // });
    }),
  getRooms: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.room.findMany();
  }),
  getUserCompanyRooms: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.room.findMany({
      where: {
        company: {
          id: ctx.session.user.company.id,
        },
      },
    });
  }),
  getRoomById: publicProcedure.input(roomIdSchema).query(({ ctx, input }) => {
    return ctx.prisma.room.findUnique({
      where: {
        id: input.id,
      },
    });
  }),

  createRoom: protectedProcedure
    .input(createRoomSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.room.create({
        data: {
          title: input.title,
          image: input.image,
          price: input.price,
          capacity: input.capacity,
          description: input.description,
          companyId: input.companyId,
        },
      });
    }),
  updateRoom: protectedProcedure
    .input(updateRoomSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.room.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          image: input.image,
          price: input.price,
          capacity: input.capacity,
          description: input.description,
          companyId: input.companyId,
        },
      });
    }),
  upsertRoom: protectedProcedure
    .input(updateRoomSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.room.upsert({
        where: {
          id: input.id,
        },
        create: {
          title: input.title,
          image: input.image,
          price: input.price,
          capacity: input.capacity,
          description: input.description,
          companyId: input.companyId,
        },
        update: {
          title: input.title,
          image: input.image,
          price: input.price,
          capacity: input.capacity,
          description: input.description,
          companyId: input.companyId,
        },
      });
    }),
  deleteRoom: protectedProcedure
    .input(roomIdSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.room.delete({
        where: {
          id: input.id,
        },
      });
    }),
  getReservedRoomsByDate: protectedProcedure
    .input(z.object({ date: z.date().optional() }).optional())
    .query(async ({ input, ctx }) => {
      const rooms = await ctx.prisma.room.findMany({
        where: {
          plans: {
            every: {
              start_datetime: {
                gte: input.date,
                lte: input.date,
              },
            },
          },
        },
        include: {
          plans: true,
        },
      });

      return rooms.map((room) => {
        const plans = room.plans.map((plan) => {
          let status: RoomStatus = "Open";

          if (moment().isBetween(plan.start_datetime, plan.end_datetime))
            status = "AlreadyStarted";
          if (moment().isAfter(plan.end_datetime)) status = "Open";
          if (moment().isBefore(plan.start_datetime)) status = "Reserved";

          return {
            status,
            start_datetime: plan.start_datetime,
            end_datetime: plan.end_datetime,
          };
        });
        return {
          ...room,
          plans,
        };
      });
    }),
});
