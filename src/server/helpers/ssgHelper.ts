import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";
import { createServerSideHelpers } from "@trpc/react-query/dist/server";

export function helpers({ session }) {
  return createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, session },
    transformer: superjson, // optional - adds superjson serialization
  });
}
