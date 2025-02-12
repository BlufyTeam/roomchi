import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminAndSuperAdminProcedure,
} from "~/server/api/trpc";
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
} from "~/server/validations/user.validation";
import { Role } from "~/types";

export const userRouter = createTRPCRouter({
  getUser: adminAndSuperAdminProcedure.query(({ ctx }) => {
    return ctx.session.user;
  }),

  createUser: adminAndSuperAdminProcedure
    .input(createUserSchema)
    .mutation(async ({ input, ctx }) => {
      let email = input.email;
      if (!email) email = null;

      if ((ctx.session.user.role as Role) === "SUPER_ADMIN") {
        if ((input.role as Role) === "ADMIN") {
          return await ctx.prisma.user.create({
            data: {
              name: input.name,
              email: email,
              username: input.username.toLowerCase(),
              password: input.password,
              description: input.description,
              role: input.role,
              // Handle company connection or creation logic
              company: input.companyId
                ? {
                    connect: {
                      id: input.companyId, // Connect the existing company
                    },
                  }
                : {
                    create: {
                      name: "شرکت من", // Create a new company with a custom temporary name
                    },
                  },
            },
          });
        }
      }
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
    }),
  updateUser: adminAndSuperAdminProcedure
    .input(updateUserSchema)
    .mutation(async ({ input, ctx }) => {
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
    }),
  getUsers: adminAndSuperAdminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish().default(10),
        cursor: z.string().nullish(),
        searchTerm: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor, searchTerm } = input;

      // Build the 'where' filter
      const where: any = {
        // Exclude SUPER_ADMIN users
        role: { not: "SUPER_ADMIN" },
        ...(searchTerm
          ? {
              OR: [
                { name: { contains: searchTerm, mode: "insensitive" } },
                { username: { contains: searchTerm, mode: "insensitive" } },
                {
                  company: {
                    name: { contains: searchTerm, mode: "insensitive" },
                  },
                },
              ],
            }
          : undefined),
      };

      // Admins can only see users in their company
      if (ctx.session.user.role === "ADMIN") {
        where.companyId = ctx.session.user.companyId;
      }

      // Fetch the users based on the built filter
      const items =
        (await ctx.prisma.user.findMany({
          take: limit + 1, // get an extra item at the end to check for next cursor
          cursor: cursor ? { id: cursor } : undefined,
          where: {
            OR: [
              { name: { contains: searchTerm } },
              { username: { contains: searchTerm } },
              {
                company: {
                  name: { contains: searchTerm },
                },
              },
            ],
          },
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
  getMyCompanyUsers: adminAndSuperAdminProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      where: {
        company: {
          id: ctx.session.user.companyId,
        },
      },
    });
    return users;
  }),

  getUserById: adminAndSuperAdminProcedure
    .input(userIdSchema)
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  deleteUser: adminAndSuperAdminProcedure
    .input(userIdSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.user.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
