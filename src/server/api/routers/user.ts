import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
} from "~/server/validations/user.validation";

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
  updateUser: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          email: input.email,
          username: input.username,
          password: input.password,
          description: input.description,
          role: input.role,
          companyId: input.companyId,
        },
      });
    }),
  getUsers: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish().default(10),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const items =
        (await ctx.prisma.user.findMany({
          take: limit + 1, // get an extra item at the end which we'll use as next cursor
          cursor: cursor ? { id: cursor } : undefined,

          orderBy: {
            created_at: "desc",
          },
        })) || [];
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }
      return {
        items,
        nextCursor,
      };
    }),
  getUserById: protectedProcedure
    .input(userIdSchema)
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  deleteUser: protectedProcedure
    .input(userIdSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.user.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
