import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { twMerge } from "tailwind-merge";
import { Time } from "@internationalized/date";

import Link from "next/link";
import moment, { Moment } from "jalali-moment";
import { api } from "~/utils/api";
import { MegaphoneIcon } from "lucide-react";
import Calendar from "~/features/calendar";
import Modal from "~/ui/modals";
import { useRouter } from "next/router";
import PlanRooms from "~/features/plan-rooms";
import { useLanguage } from "~/context/language.context";
import { cn } from "~/lib/utils";
import SelectAndSearch from "~/components/origin/select-and-search";
import { getMonthDays } from "~/utils/date";

const dates = getMonthDays(moment());
const start_date = dates.at(0);
const end_date = dates.at(-1);
export default function CalendarView() {
  const session = useSession();
  const { language, t } = useLanguage();
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(
    undefined
  );
  const [date, setDate] = useState({
    start_date: start_date.toDate(),
    end_date: end_date.toDate(),
  });
  const utils = api.useContext();
  const router = useRouter();

  const { data: rooms, isLoading: isRoomsLoading } =
    api.room.getUserCompanyRooms.useQuery();

  const getPlansBetWeenDates = api.plan.getPlansBetWeenDates.useQuery(
    {
      start_datetime: date.start_date,
      end_datetime: date.end_date,
    },
    {
      enabled: session.status === "authenticated",
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    router.events.on("routeChangeComplete", (route) => {
      if (router.asPath === "/admin")
        utils.plan.getPlansBetWeenDates.invalidate({
          start_datetime: new Date(router.query.start_date as string),
          end_datetime: new Date(router.query.end_date as string),
        });
    });

    return () => {
      return router.events.on("routeChangeComplete", (route) => {
        if (router.asPath === "/admin")
          utils.plan.getPlansBetWeenDates.invalidate();
      });
    };
  }, []);
  //   if (session.status === "unauthenticated") router.replace("/login");
  //   if (session.status === "loading" || !getPlansBetWeenDates.data)
  //     return <ThreeDotsWave />;

  return (
    <>
      <div className="flex w-full flex-col items-start justify-center md:flex-row">
        {isRoomsLoading ? (
          "..."
        ) : (
          <>
            <div className="flex gap-2 py-10">
              <SelectAndSearch
                btnClassName="bg-secondary "
                name="business_category"
                className="md:max-w-[220px]"
                list={rooms?.map((room) => ({
                  value: room.id,
                  label: room.title,
                }))}
                withOtherOption={false}
                title={t.FilterRoom}
                value={selectedRoomId}
                onChange={(value) => {
                  setSelectedRoomId(value);
                }}
              />
            </div>
          </>
        )}

        <Calendar
          onFirstCalender={(startDate, endDate) => {
            setDate({
              start_date: startDate.utc().toDate(),
              end_date: endDate.utc().toDate(),
            });
          }}
          onMonthChange={(startDate, endDate) => {
            setDate({
              start_date: startDate.utc().toDate(),
              end_date: endDate.utc().toDate(),
            });

            // setTwoDates({
            //   start_date: startDate.utc().toDate(),
            //   end_date: endDate.utc().toDate(),
            // });
          }}
          onDate={(date, monthNumber) => {
            const list = getPlansBetWeenDates?.data ?? [];
            const plans = list
              .filter((plan) =>
                moment(plan.start_datetime)
                  .utc()
                  .startOf("day")
                  .isSame(date.startOf("day"))
              )
              .reverse();

            const formattedDate =
              date.clone().utc().add(1, "day").isBefore(moment()) &&
              plans.length <= 0
                ? undefined
                : date.utc().toISOString();
            return (
              <Link
                key={date.toString()}
                href={formattedDate ? `/admin/?plan=${formattedDate}` : ""}
                as={formattedDate ? `/admin/${formattedDate}` : ""}
                shallow={true}
                className={cn(
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
                    : " rounded-md group-disabled:cursor-not-allowed",
                  plans.find((a) => a.roomId === selectedRoomId) &&
                    "bg-primary text-secondary"
                )}
              >
                {parseInt(date.format("M")) !== monthNumber + 1 ? (
                  <span className="text-sm">{date.format("D MMM")}</span>
                ) : (
                  <span>{date.format("D")}</span>
                )}

                {plans.length > 0 && (
                  <>
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 px-2  text-sm  group-enabled:text-accent  group-enabled:group-hover:text-secbuttn "
                      )}
                    >
                      <MegaphoneIcon className="" />
                      {plans.slice(0, 2).map((plan, i) => {
                        return (
                          <div
                            key={i}
                            className="hidden items-center justify-center gap-2 text-accent md:flex"
                          >
                            <span className=" group-hover:text-secondary">
                              {plan.is_confidential
                                ? t.confidential
                                : plan.title}
                            </span>
                            <span className=" group-hover:text-secondary">
                              {moment(plan.start_datetime).format("HH:mm")}
                            </span>
                          </div>
                        );
                      })}
                      {plans.length > 2 && (
                        <span className="text-sm text-primary">
                          +{plans.length - 2}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </Link>
            );
          }}
        />
      </div>

      <Modal
        isOpen={!!router.query.plan}
        center
        title={moment(router.query.plan).locale(language).format("D MMMM yyyy")}
        onClose={() => {
          //router.push("/admin", undefined, { shallow: true });
          router.replace("/admin", undefined, { shallow: true });
        }}
      >
        <PlanRooms
          date={moment(router.query.plan)}
          dateString={router?.query?.plan?.toString()}
        />
      </Modal>
    </>
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
