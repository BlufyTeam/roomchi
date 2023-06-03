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
  getRooms: protectedProcedure.input(z.object({companyId:z.string().optional()})).query(({ ctx,input }) => {
    if(input.companyId != null){
      return ctx.prisma.room.findMany()
      
    }else{
      return ctx.prisma.room.findMany({
        where:{companyId:input.companyId}
      });
    }
    
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
          logo_rule: input.logo_rule,
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
          logo_rule: input.logo_rule,
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
