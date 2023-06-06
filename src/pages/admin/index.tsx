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
  if (session.status === "unauthenticated") return "not authed";
  if (session.status === "loading") return "loading";
  if (getPlansByDate.isLoading) return "loading";
  return (
    <AdminMainLayout>
      <div className="felx flex-col  py-10">
        {moment(getPlansByDate.data[0].start_datetime)
          .locale("fa")
          .format("DD  MMMM")}
        <div className="grid grid-cols-7 text-center text-primary">
          <span>شنبه</span>
          <span>یک شنبه</span>
          <span>دو شنبه</span>
          <span>سه شنبه</span>
          <span>چهار شنبه</span>
          <span>پنج شنبه</span>
          <span>جمعه</span>
        </div>
        <div className="grid  grid-cols-7  ">
          {calendar.map((item: Moment) => {
            const plan = getPlansByDate.data.find(
              (plan) =>
                moment(plan.start_datetime)
                  .locale("fa")
                  .format("DD  MMMM yyyy") ==
                item.locale("fa").format("DD  MMMM yyyy")
            );

            return (
              <>
                <button
                  disabled={item.isBefore(today.clone().subtract(1, "day"))}
                  className={twMerge(
                    "group flex h-40 w-40 cursor-pointer items-center justify-center text-center "
                  )}
                >
                  <div
                    className={twMerge(
                      `flex h-5/6 w-11/12 flex-col items-center  justify-between
                     rounded-xl bg-accent/10
                     py-2 text-center                   
                     text-primary
                     transition-colors
                     duration-500
                     group-enabled:group-hover:bg-accent 
                     group-enabled:group-hover:text-secondary 
                    group-disabled:bg-transparent
                      
                    group-disabled:text-gray-500`
                    )}
                  >
                    <span> {item.format("DD  MMMM")}</span>
                    <span> {plan?.title}</span>
                    <span> {plan?.room.title}</span>
                  </div>
                </button>
              </>
            );
          })}
        </div>
      </div>
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
