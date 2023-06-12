import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { twMerge } from "tailwind-merge";

import Link from "next/link";
import AdminMainLayout from "~/pages/admin/layout";
import moment, { Moment } from "jalali-moment";
import { api } from "~/utils/api";
import { MegaphoneIcon } from "lucide-react";
import Calender from "~/features/calender";
import Modal from "~/ui/modals";
import { useRouter } from "next/router";
import PlanRooms from "~/features/plan-rooms";
import AdminSkeleton from "~/pages/admin/loading";
import PickTimeView from "~/features/pick-time-view";

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

  const getPlansBetWeenDates = api.plan.getPlansBetWeenDates.useQuery(
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
  useEffect(() => {
    router.events.on("routeChangeComplete", (route) => {
      if (router.asPath === "/admin")
        utils.plan.getPlansBetWeenDates.invalidate();
    });

    return () => {
      return router.events.on("routeChangeComplete", (route) => {
        if (router.asPath === "/admin")
          utils.plan.getPlansBetWeenDates.invalidate();
      });
    };
  }, []);
  if (session.status === "unauthenticated") return router.replace("/login");
  if (session.status === "loading" || !getPlansBetWeenDates.data)
    return <AdminSkeleton />;

  return (
    <AdminMainLayout>
      <Calender
        onMonthChange={(startDate, endDate) => {
          utils.plan.getPlansBetWeenDates.invalidate({
            start_datetime: startDate.toDate(),
            end_datetime: endDate.toDate(),
          });
        }}
        onDate={(date, monthNumber) => {
          const plans = getPlansBetWeenDates.data
            .filter((plan) =>
              moment(plan.start_datetime)
                .startOf("day")
                .isSame(date.startOf("day"))
            )
            .reverse();

          const formattedDate =
            date.clone().add(1, "day").isBefore(moment()) && plans.length <= 0
              ? undefined
              : date.toISOString();
          return (
            <Link
              key={date.toString()}
              href={formattedDate ? `/admin/?plan=${formattedDate}` : ""}
              as={formattedDate ? `/admin/${formattedDate}` : ""}
              shallow={true}
              className={twMerge(
                `disabled:cursor-not-allowe relative flex  w-full flex-col items-center justify-center gap-2
                    bg-accent/10
                    py-2
                    text-center
                   text-primary
                   transition-colors
                   duration-500
                   group-enabled:group-hover:bg-primbuttn
                   group-enabled:group-hover:text-secondary

                   group-disabled:bg-transparent

                  group-disabled:text-gray-500`,
                plans.length > 0
                  ? "rounded-2xl border   group-enabled:border-accent"
                  : " rounded-md group-disabled:cursor-not-allowed"
              )}
            >
              {parseInt(date.format("M")) !== monthNumber + 1 ? (
                <span className="text-sm">{date.format("D MMMM")}</span>
              ) : (
                <span>{date.format("D")}</span>
              )}

              {plans.length > 0 && (
                <>
                  <div className="flex flex-col items-center justify-center gap-2 px-2  text-sm  group-enabled:text-accent  group-enabled:group-hover:text-secbuttn ">
                    <MegaphoneIcon className="" />
                    {plans.map((plan, i) => {
                      return (
                        <div
                          key={i}
                          className="hidden items-center justify-center gap-2 md:flex "
                        >
                          <span>{plan.title}</span>
                          <span>
                            {moment(plan.start_datetime).format("HH:MM")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </Link>
          );
        }}
      />

      <Modal
        isOpen={!!router.query.plan}
        center
        title={moment(router.query.plan).locale("fa").format("D MMMM yyyy")}
        onClose={() => {
          //router.push("/admin", undefined, { shallow: true });
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
