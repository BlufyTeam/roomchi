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
import moment, { Moment } from "jalali-moment";
import { api } from "~/utils/api";
import { MegaphoneIcon } from "lucide-react";
import Calender from "~/features/calender";
import Modal from "~/ui/modals";
import { useRouter } from "next/router";
import PlanRooms from "~/features/plan-rooms";

let calendarTemp = [];
const today = moment(Date.now()).locale("fa");
const startDay = today.clone().startOf("month").startOf("week");
const endDay = today.clone().endOf("month").endOf("week");

let date = startDay.clone().subtract(1, "day");

while (date.isBefore(endDay, "day"))
  calendarTemp.push({
    days: Array(7)
      .fill(0)
      .fill(0)
      .fill(0)
      .fill(0)
      .fill(0)
      .fill(0)
      .fill(0)
      .map(() => date.add(1, "day").clone()),
  });
const calendar: Moment[] = calendarTemp.map((a) => a.days).flat(1);

export default function AdminPage() {
  const session = useSession();
  const getPlansByDate = api.plan.getPlansByDate.useQuery(
    {
      start_datetime: calendar.at(0).toDate(),
      end_datetime: calendar.at(calendar.length - 1).toDate(),
    },
    {
      enabled: session.status === "authenticated",
    }
  );
  const utils = api.useContext();
  const router = useRouter();
  if (session.status === "unauthenticated") return "not authed";
  if (session.status === "loading") return "loading";
  if (getPlansByDate.isLoading) return "loading";

  return (
    <AdminMainLayout>
      <Calender
        onMonthChange={(startDate, endDate) => {
          utils.plan.getPlansByDate.invalidate({
            start_datetime: startDate.toDate(),
            end_datetime: endDate.toDate(),
          });
        }}
        onDate={(date, monthNumber) => {
          const plan = getPlansByDate.data.find(
            (plan) =>
              moment(plan.start_datetime).locale("fa").format("DD MMMM yyyy") ==
              date.locale("fa").format("DD MMMM yyyy")
          );
          const formattedDate = date.toISOString();
          return (
            <Link
              href={`/admin/?plan=${formattedDate}`}
              as={`/admin/${formattedDate}`}
              shallow={true}
              className={twMerge(
                `relative flex w-full  flex-col items-center justify-center gap-2 bg-accent/10  
                    py-2
                    text-center
                    text-primary                   
                   transition-colors
                   duration-500
                   group-enabled:group-hover:bg-primbuttn
                   group-enabled:group-hover:text-secondary 
                   group-disabled:cursor-not-allowed 
                   group-disabled:bg-transparent
                    
                  group-disabled:text-gray-500`,
                plan
                  ? "rounded-2xl border   group-enabled:border-accent"
                  : " rounded-md"
              )}
            >
              {parseInt(date.format("M")) !== monthNumber + 1 ? (
                <span>{date.format("D MMMM")}</span>
              ) : (
                <span>{date.format("D")}</span>
              )}

              {plan && (
                <>
                  <span className="flex flex-col items-center justify-center gap-2 px-2  text-sm  group-enabled:text-accent  group-enabled:group-hover:text-secbuttn ">
                    <MegaphoneIcon className="" />
                    <p>{plan?.title}</p>
                  </span>
                </>
              )}
            </Link>
          );
        }}
      />

      <Modal
        isOpen={!!router.query.plan}
        center
        onClose={() => {
          router.replace("/admin", undefined, { shallow: true });
        }}
      >
        <PlanRooms date={moment(router.query.plan)} />
      </Modal>
    </AdminMainLayout>
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
