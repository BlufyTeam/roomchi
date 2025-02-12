import { z } from "zod";
import { ldapSearch } from "~/lib/ldap";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "~/server/api/trpc";
import { activeDirectoryConfigSchema } from "~/server/validations/active-directory";

export const activeDirectoryRouter = createTRPCRouter({
  getUsers: publicProcedure
    .input(activeDirectoryConfigSchema)
    .mutation(async ({ input, ctx }) => {
      const config = await ctx.prisma.activeDirectoryConfig.findFirst({
        where: {
          company: {
            id: ctx.session.user.company.id,
          },
        },
      });
      ldapSearch(
        config.domainName,
        config.domainController,
        config.loginName,
        config.password
      )
        .then((users) => {
          console.log("Found users: ", users);
        })
        .catch((error) => {
          console.error("Error occurred: ", error);
        });
    }),
  getAdminConfig: adminProcedure.query(async ({ input, ctx }) => {
    const config = await ctx.prisma.activeDirectoryConfig.findFirst({
      where: {
        company: {
          id: ctx.session.user.company.id,
        },
      },
    });
    return config;
  }),
  setAdminConfig: adminProcedure
    .input(activeDirectoryConfigSchema)
    .mutation(async ({ input, ctx }) => {
      const config = await ctx.prisma.activeDirectoryConfig.findFirst({
        where: {
          company: {
            id: ctx.session.user.company.id,
          },
        },
      });
      if (config) {
        return await ctx.prisma.activeDirectoryConfig.update({
          where: {
            id: config.id,
          },
          data: {
            domainController: input.domainController,
            loginName: input.loginName,
            password: input.password,
            domainName: input.domainName,
            company: {
              connect: {
                id: ctx.session.user.company.id,
              },
            },
          },
        });
      }
      return await ctx.prisma.activeDirectoryConfig.create({
        data: {
          domainController: input.domainController,
          loginName: input.loginName,
          password: input.password,
          domainName: input.domainName,
          company: {
            connect: {
              id: ctx.session.user.company.id,
            },
          },
        },
      });
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
