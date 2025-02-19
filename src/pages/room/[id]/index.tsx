import moment from "jalali-moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

import { useLanguage } from "~/context/language.context";
import { RoomsListSkeleton } from "~/features/rooms-list/loading";
import Plans from "~/pages/room/[id]/plans";
import RoomMainLayout from "~/pages/room/layout";
import { api } from "~/utils/api";

export default function SingleRoomPage() {
  const router = useRouter();
  const session = useSession();
  const { t, language } = useLanguage();

  const room = api.room.getRoomById.useQuery({
    id: router.query.id?.toString() ?? "",
  });
  const todayDate = useMemo(() => new Date().toISOString(), []);
  // console.log({ date: moment(new Date().toLocaleDateString()).toDate() });
  const getPlans = api.plan.getPlansByDateAndRoom.useQuery(
    {
      roomId: router.query.id as string,
      date: todayDate,
    },
    {
      enabled: session.status === "authenticated",
      refetchInterval: 60000, // 1 Minute
      onSuccess: () => {
        console.log("hi");
      },
    }
  );

  if (getPlans.isLoading || room.isLoading)
    return (
      <RoomMainLayout>
        <div className="min-h-screen  px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <RoomsListSkeleton />
          </div>
        </div>
      </RoomMainLayout>
    );

  return (
    <RoomMainLayout>
      <div className=" min-h-screen min-w-full gap-2 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-full flex-col items-center justify-center gap-5">
          <div
            dir="rtl"
            className="w-full items-center justify-center text-center text-2xl text-primary"
          >
            <span className="text-primary"> {t.todaysMeetings}</span>{" "}
            <span className="text-3xl text-emerald-800">
              {" "}
              {moment()
                .locale(language)
                .format(language === "fa" ? "DD MMMM YYYY" : "YYYY MMMM DD")}
            </span>
          </div>

          <h1 className="mb-8 text-center text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
            {room.data?.title}
          </h1>

          {getPlans.data && getPlans.data.length === 0 ? (
            <div className="text-center text-lg text-gray-600">
              {t.noMeetingsToday}
            </div>
          ) : (
            <Plans plans={getPlans.data ?? []} />
          )}
        </div>
      </div>
    </RoomMainLayout>
  );
}
