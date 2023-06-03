import { companyRouter } from "~/server/api/routers/company";
import { exampleRouter } from "~/server/api/routers/example";
import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";
import {roomRouter} from '~/server/api/routers/room'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  company: companyRouter,
  room:roomRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
