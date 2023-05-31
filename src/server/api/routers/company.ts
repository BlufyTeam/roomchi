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
      return await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),
});
