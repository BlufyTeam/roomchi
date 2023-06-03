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
  getRoomById: protectedProcedure
    .input(roomIdSchema)
    .query(({ ctx, input }) => {
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
  updateUser: protectedProcedure
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

  deleteRoom: protectedProcedure
    .input(roomIdSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.room.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
