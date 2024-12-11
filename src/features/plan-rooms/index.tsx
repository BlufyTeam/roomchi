import moment, { Moment } from "jalali-moment";
import {
  ChevronLeft,
  ChevronRight,
  HourglassIcon,
  Loader2Icon,
  MonitorUpIcon,
  StickyNoteIcon,
} from "lucide-react";
import { ReplaceIcon } from "lucide-react";
import React, { ElementRef, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import PickTimeView from "~/features/pick-time-view";
import PlanListWithRoom from "~/features/plan-list-with-room";
import RoomsList from "~/features/rooms-list";
import { RoomsListSkeleton } from "~/features/rooms-list/loading";
import { api } from "~/utils/api";

import RoomForm from "~/pages/admin/rooms/form";
import { ArrowRightIcon } from "lucide-react";
import Button from "~/ui/buttons";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { createPlanSchema } from "~/server/validations/plan.validation";
import MultiStep from "~/features/multi-step";
import { ReserveRoom } from "~/features/plan-rooms/form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { redirect } from "next/navigation";
import { ROLES } from "~/server/constants";
import { useLanguage } from "~/context/language.context";
import { translations } from "~/utils/translations";
type Props = {
  date: Moment;
};
export default function PlanRooms({ date }: Props) {
  const { language } = useLanguage();
  const t = translations[language];
  const session = useSession();
  const getPlans = api.plan.getPlansByDate.useQuery({
    date: date.toDate(),
  });
  const router = useRouter();
  if (getPlans.isLoading || session.status === "loading")
    return (
      <div className="flex w-5/6 flex-col items-center justify-center gap-4 p-5">
        <RoomsListSkeleton />
      </div>
    );

  if (session.status === "unauthenticated") {
    redirect("/login");
  }

  const canReserveRoom =
    date.isSameOrAfter(moment(), "jDay") && session.data.user.role === "ADMIN";
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 p-5">
      {getPlans.data.length > 0 && (
        <div className="flex w-full flex-col items-center justify-start  gap-3">
          <h3 className="w-full px-2 text-center font-bold text-primary">
            {t.roomResevedAt}
            {date.locale(language).format("D MMMM yyyy")}
          </h3>

          <PlanListWithRoom plans={getPlans.data} />
        </div>
      )}
      {getPlans.data.length > 0 && canReserveRoom && (
        <div className="h-0.5 w-full rounded-full bg-accent/50" />
      )}
      {canReserveRoom && (
        <>
          <ReserveRoom date={date} />
        </>
      )}
    </div>
  );
}
