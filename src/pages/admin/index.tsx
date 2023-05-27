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
function ModelSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="652"
      height="644"
      viewBox="0 0 652 644"
      fill="none"
      className="mondrian"
    >
      <rect
        opacity="0.05"
        x="1"
        width="163"
        height="60"
        rx="10"
        fill="var(--primary)"
      ></rect>
      <rect
        x="424"
        width="193"
        height="60"
        rx="10"
        fill="var(--secbuttn)"
      ></rect>
      <rect
        x="424"
        y="68"
        width="193"
        height="175"
        rx="10"
        fill="var(--secbuttn)"
      ></rect>
      <rect
        opacity="0.2"
        x="424"
        y="401"
        width="193"
        height="79"
        rx="10"
        fill="var(--primbuttn)"
      ></rect>
      <rect
        x="255"
        y="626"
        width="362"
        height="18"
        rx="9"
        fill="var(--secondary)"
      ></rect>
      <rect
        x="80"
        y="579"
        width="166"
        height="65"
        rx="10"
        fill="var(--secondary)"
      ></rect>
      <rect
        x="255"
        y="579"
        width="160"
        height="40"
        rx="10"
        fill="var(--primary)"
      ></rect>
      <rect
        opacity="0.05"
        x="255"
        y="490"
        width="160"
        height="80"
        rx="10"
        fill="var(--primary)"
      ></rect>
      <rect
        opacity="0.05"
        x="255"
        y="400"
        width="160"
        height="80"
        rx="10"
        fill="var(--primary)"
      ></rect>
      <rect
        x="80"
        y="68"
        width="335"
        height="324"
        rx="10"
        fill="var(--primbuttn)"
      ></rect>
      <rect
        x="80"
        y="401"
        width="166"
        height="169"
        rx="10"
        fill="var(--primary)"
      ></rect>
      <rect
        x="424"
        y="490"
        width="193"
        height="129"
        rx="10"
        fill="var(--accent)"
      ></rect>
      <rect
        x="626"
        y="490"
        width="26"
        height="154"
        rx="10"
        fill="var(--primbuttn)"
      ></rect>
      <rect
        x="424"
        y="252"
        width="91"
        height="140"
        rx="10"
        fill="var(--secondary)"
      ></rect>
      <rect
        x="524"
        y="252"
        width="93"
        height="140"
        rx="10"
        fill="var(--secondary)"
      ></rect>
      <rect
        opacity="0.05"
        x="626"
        width="26"
        height="480"
        rx="10"
        fill="var(--primary)"
      ></rect>
      <rect
        x="173"
        width="242"
        height="60"
        rx="10"
        fill="var(--secondary)"
      ></rect>
      <rect
        x="1"
        y="68"
        width="70"
        height="157"
        rx="10"
        fill="var(--secondary)"
      ></rect>
      <rect
        opacity="0.05"
        x="1"
        y="234"
        width="70"
        height="259"
        rx="10"
        fill="var(--primary)"
      ></rect>
      <rect
        x="1"
        y="502"
        width="70"
        height="142"
        rx="10"
        fill="var(--secbuttn)"
      ></rect>
    </svg>
  );
}
