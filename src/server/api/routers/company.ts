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
import {
  companyIdSchema,
  updateCompanySchema,
} from "~/server/validations/company.validation";

export const companyRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx, input }) => {
    return ctx.prisma.company.findMany({});
  }),

  getCompanyById: protectedProcedure
    .input(companyIdSchema)
    .query(({ ctx, input }) => {
      return ctx.prisma.company.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  updateCompany: protectedProcedure
    .input(updateCompanySchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.company.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          logo_base64: input.logo_base64,
        },
      });
    }),
});
