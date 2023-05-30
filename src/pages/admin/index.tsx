import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { twMerge } from "tailwind-merge";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import { helpers } from "~/server/helpers/ssgHelper";
import { prisma } from "~/server/db";
import Button from "~/ui/buttons";
import Link from "next/link";
import AdminMainLayout from "~/pages/admin/layout";

export default function AdminPage() {
  const session = useSession();
  if (session.status === "unauthenticated") return "not authed";
  if (session.status === "loading") return "loading";
  return <AdminMainLayout></AdminMainLayout>;
}

// export async function getServerSideProps(
//   context: GetServerSidePropsContext<{ id: string }>
// ) {

//   helpers(context.).user.getUser.prefetch();
//   const id = context.params?.id as string;
//   /*
//    * Prefetching the `post.byId` query.
//    * `prefetch` does not return the result and never throws - if you need that behavior, use `fetch` instead.
//    */
//   await helpers..byId.prefetch({ id });
//   // Make sure to return { props: { trpcState: helpers.dehydrate() } }
//   return {
//     props: {
//       trpcState: helpers.dehydrate(),
//       id,
//     },
//   };
// }
