import { z } from "zod";
import { ldapSearch } from "~/lib/ldap";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { activeDirectoryConfigSchema } from "~/server/validations/active-directory";

export const activeDirectoryRouter = createTRPCRouter({
  getUsers: publicProcedure
    .input(activeDirectoryConfigSchema)
    .mutation(({ input }) => {
      ldapSearch("RougineDarou", "192.168.100.11", "helpdesk", "ani4N6-u}jxY")
        .then((users) => {
          console.log("Found users: ", users);
        })
        .catch((error) => {
          console.error("Error occurred: ", error);
        });
    }),

  getAll: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
