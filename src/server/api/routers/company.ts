import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminAndSuperAdminProcedure,
  superAdminProcedure,
} from "~/server/api/trpc";
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
} from "~/server/validations/user.validation";
import {
  companyIdSchema,
  createCompanySchema,
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
  createcompany: superAdminProcedure
    .input(createCompanySchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.company.create({
        data: {
          name: input.name,
          description: input.description,
          logo_base64: input.logo_base64,
        },
      });
    }),
  updateCompany: adminAndSuperAdminProcedure
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
