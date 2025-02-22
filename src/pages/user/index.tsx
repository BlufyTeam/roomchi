import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { twMerge } from "tailwind-merge";

import Link from "next/link";
import UserMainLayout from "~/pages/user/layout";
import moment, { Moment } from "jalali-moment";
import { api } from "~/utils/api";
import { MegaphoneIcon } from "lucide-react";

import Modal from "~/ui/modals";
import { useRouter } from "next/router";
import PlanRooms from "~/features/plan-rooms";
import UserSkeleton from "~/pages/user/loading";
import PickTimeView from "~/features/pick-time-view";
import { useLanguage } from "~/context/language.context";
import Calendar from "~/features/calendar";
import Button from "~/ui/buttons";
import { cn } from "~/lib/utils";
import SelectAndSearch from "~/components/origin/select-and-search";
import { getMonthDays } from "~/utils/date";
import CalendarView from "~/pages/user/calendar-view";

export default function AdminPage() {
  const session = useSession();
  const router = useRouter();
  if (session.status === "unauthenticated") return router.replace("/login");
  if (session.status === "loading") return <UserSkeleton />;

  return (
    <UserMainLayout>
      <CalendarView />
    </UserMainLayout>
  );
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
