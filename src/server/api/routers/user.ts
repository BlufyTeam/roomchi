import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  AdminProcedure,
} from "~/server/api/trpc";
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
} from "~/server/validations/user.validation";

export const userRouter = createTRPCRouter({
  getUser: AdminProcedure.query(({ ctx }) => {
    return ctx.session.user;
  }),

  createUser: AdminProcedure.input(createUserSchema).mutation(
    async ({ input, ctx }) => {
      let email = input.email;
      if (!email) email = null;

      return await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: email,
          username: input.username.toLowerCase(),
          password: input.password,
          description: input.description,
          role: input.role,
          companyId: input.companyId,
        },
      });
    }
  ),
  updateUser: AdminProcedure.input(updateUserSchema).mutation(
    async ({ input, ctx }) => {
      let email = input.email;
      if (!email) email = null;
      return await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          email: email,
          username: input.username.toLowerCase(),
          password: input.password,
          description: input.description,
          role: input.role,
          companyId: input.companyId,
        },
      });
    }
  ),
  getUsers: AdminProcedure.input(
    z.object({
      limit: z.number().min(1).max(100).nullish().default(10),
      cursor: z.string().nullish(),
    })
  ).query(async ({ ctx, input }) => {
    const limit = input.limit ?? 50;
    const { cursor } = input;

    const where =
      ctx.session.user.role != "SUPER_ADMIN"
        ? {
            companyId: ctx.session.user.companyId,
          }
        : {};
    const items =
      (await ctx.prisma.user.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        cursor: cursor ? { id: cursor } : undefined,
        where: where,
        include: {
          company: true,
        },
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
  getMyCompanyUsers: AdminProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      where: {
        company: {
          id: ctx.session.user.companyId,
        },
      },
    });
    return users;
  }),
  getUserById: AdminProcedure.input(userIdSchema).query(
    async ({ input, ctx }) => {
      return await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
      });
    }
  ),
  deleteUser: AdminProcedure.input(userIdSchema).mutation(
    async ({ input, ctx }) => {
      return await ctx.prisma.user.delete({
        where: {
          id: input.id,
        },
      });
    }
  ),
});
