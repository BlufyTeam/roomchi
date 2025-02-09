import { companyRouter } from "~/server/api/routers/company";
import { exampleRouter } from "~/server/api/routers/example";
import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";
import { roomRouter } from "~/server/api/routers/room";
import { planRouter } from "~/server/api/routers/plan";
import { mailRouter } from "~/server/api/routers/mail";
import { activeDirectoryRouter } from "~/server/api/routers/active-directory";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  company: companyRouter,
  room: roomRouter,
  plan: planRouter,
  mail: mailRouter,
  activeDirectory: activeDirectoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
