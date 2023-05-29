import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { createUserSchema } from "~/server/validations/user.validation";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user;
  }),
  createUser: protectedProcedure
    .input(createUserSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          username: input.username,
          password: input.password,
          description: input.description,
          role: input.role,
        },
      });
    }),
});
