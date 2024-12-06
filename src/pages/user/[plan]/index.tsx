import moment from "jalali-moment";
import { useRouter } from "next/router";
import React from "react";
import { useLanguage } from "~/context/language.context";
import PickTimeView from "~/features/pick-time-view";
import PlanRooms from "~/features/plan-rooms";
import UserMainLayout from "~/pages/user/layout";

export default function PlanPage() {
  const { language } = useLanguage();
  const router = useRouter();
  return (
    <UserMainLayout>
      <div className="flex w-full flex-col items-center justify-center py-10">
        <h1 className="flex w-full items-center justify-center font-bold text-primary">
          {moment(router.query.plan).locale(language).format("D MMMM yyyy")}
        </h1>
        <PlanRooms date={moment(router.query.plan)} />
      </div>
    </UserMainLayout>
  );
}
