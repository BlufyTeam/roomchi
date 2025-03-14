import { Room } from "@prisma/client";
import moment from "jalali-moment";
import { ShieldCheck } from "lucide-react";

import {
  AppleIcon,
  BanIcon,
  PrinterIcon,
  BananaIcon,
  CalendarCheck,
  CalendarRangeIcon,
  CalendarSearchIcon,
  CherryIcon,
  CitrusIcon,
  CookieIcon,
  CroissantIcon,
  DoorOpenIcon,
  PersonStandingIcon,
  CastIcon,
  CalendarCheckIcon,
} from "lucide-react";
import { Session } from "next-auth/core/types";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { useLanguage } from "~/context/language.context";
import { DeleteSession } from "~/features/plan-list-with-room/delete-session-view";
import { RoomStatus, User } from "~/types";
import Button from "~/ui/buttons";
import ButtonCheckbox from "~/ui/forms/checkbox/checkbox";
import ProjectorIcon from "~/ui/icons/projector";
import withModal from "~/ui/modals/with-modal";
import withModalState from "~/ui/modals/with-modal-state";
import ToolTip from "~/ui/tooltip";
import { RouterOutputs, api } from "~/utils/api";
import { translations } from "~/utils/translations";

type PlanWithRoom = RouterOutputs["plan"]["getPlansByDate"][number];
export default function PlanListWithRoom({
  plans,
  onInvalidate,
}: {
  plans: PlanWithRoom[];
  onInvalidate?: () => void;
}) {
  const session = useSession();
  if (session.status !== "authenticated") return <></>;
  // const getRooms = rooms ?? api.room.getReservedRoomsByDate.useQuery();
  // if (getRooms?.isLoading) return <RoomsListSkeleton />;
  // if (getRooms?.data.length <= 0)
  //   return (
  //     <div className="flex flex-wrap items-center justify-center  ">
  //       اتاقی ساخته نشده است
  //     </div>
  //   );

  return (
    <div className="grid gap-5 md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 ">
      {plans.map((plan) => {
        return (
          <>
            <RoomItem
              sessionData={session.data}
              userId={session.data.user.id}
              onInvalidate={() => {
                if (onInvalidate) onInvalidate();
              }}
              plan={plan}
              status={plan.status}
              capicity={plan.room.capacity}
              filled={plan.participants.length}
            />

            {/* <RoomItem room={room} status="Open" capicity={15} filled={2} />
            <RoomItem room={room} status="Reserved" capicity={6} filled={2} />
            <RoomItem room={room} status="Reserved" capicity={15} filled={15} />
            <RoomItem room={room} status="Reserved" capicity={10} filled={9} />
            <RoomItem room={room} status="Reserved" capicity={7} filled={1} />
            <RoomItem room={room} status="Open" capicity={5} filled={0} />
            <RoomItem room={room} status="Open" capicity={10} filled={5} />
            <RoomItem room={room} status="Open" capicity={10} filled={5} />
            <RoomItem room={room} status="Ocupied" capicity={10} filled={5} />
            <RoomItem room={room} status="Ocupied" capicity={10} filled={5} />
            <RoomItem room={room} status="Reserved" capicity={10} filled={5} />
            <RoomItem room={room} status="Ocupied" capicity={10} filled={5} />
            <RoomItem room={room} status="Open" capicity={10} filled={5} /> */}
          </>
        );
      })}
    </div>
  );
}

function RoomItem({
  sessionData,
  userId,
  plan,
  status,
  capicity = 10,
  filled = 5,
  onInvalidate = () => {},
}: {
  sessionData: Session;
  userId: string;
  plan: PlanWithRoom;
  status?: RoomStatus;
  capicity?: number;
  filled?: number;
  onInvalidate: () => void;
}) {
  const utils = api.useContext();

  const joinPlan = api.plan.joinPlan.useMutation({
    onSuccess: () => {
      utils.plan.getPlansByDate.invalidate();
    },
  });
  const exitPlan = api.plan.exitPlan.useMutation({
    onSuccess: () => {
      utils.plan.getPlansByDate.invalidate();
    },
  });
  const { language } = useLanguage();
  const t = translations[language];
  const hasAlreadyJoined = plan.participants.find(
    (a) => a.userId === userId
  )?.hasAccepted;

  const countOfParticipants = plan.participants.length;
  return (
    <>
      <div className="items-centercursor-pointer  flex flex-col  justify-between gap-5 rounded-xl border border-primary/30 bg-secondary p-5 text-primary backdrop-blur-md transition-colors hover:border-primary">
        <div className="flex items-start justify-between gap-5">
          <div className="flex items-start justify-between gap-5">
            <div className="relative h-10 w-10">
              <Image
                className=" rounded-full p-[2px] ring-1 ring-primary"
                src={"/images/default-door.png"}
                alt=""
                fill
              />
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold">{plan.room.title}</h3>
              <span className="text-sm">{plan.room.description}</span>
            </div>
          </div>
          <div className="flex flex-col items-end justify-center gap-5 ">
            <div className="flex flex-col">
              {status === "Done" && (
                <div className="flex items-center justify-center gap-1 rounded-lg  bg-cyan-500/10 px-0.5 py-2 text-sm text-cyan-600  md:p-2 ">
                  <CalendarCheckIcon className="h-5 w-5 2xl:h-6 2xl:w-6 " />
                  <h3 className="text-[10px]  2xl:text-sm">{t.finished}</h3>
                  <div dir="rtl" className="text-[10px]  2xl:text-sm">
                    <span>
                      {" "}
                      {moment(plan.start_datetime).locale("fa").format("HH:mm")}
                    </span>
                    {t.until}
                    <span>
                      {" "}
                      {moment(plan.end_datetime).locale("fa").format("HH:mm")}
                    </span>
                  </div>
                </div>
              )}
              {status === "Reserved" && (
                <div className="flex items-center justify-center gap-1 rounded-lg bg-rose-500/10 p-2 text-sm text-rose-600">
                  <CalendarRangeIcon className="h-5 w-5 2xl:h-6 2xl:w-6  " />
                  <h3 className="text-[10px] 2xl:text-sm ">{t.reserved}</h3>
                  <div dir="rtl" className="text-[10px]  2xl:text-sm">
                    <span>
                      {" "}
                      {moment(plan.start_datetime).locale("fa").format("HH:mm")}
                    </span>
                    {t.until}
                    <span>
                      {" "}
                      {moment(plan.end_datetime).locale("fa").format("HH:mm")}
                    </span>
                  </div>
                </div>
              )}
              {status === "AlreadyStarted" && (
                <div className="flex items-center justify-center gap-1 rounded-lg  bg-amber-500/10 p-2 text-sm text-amber-600">
                  <BanIcon className="h-5 w-5 2xl:h-6 2xl:w-6  " />
                  <h3 className="text-[10px] 2xl:text-sm">{t.inProgress}</h3>
                  <div dir="rtl" className="text-[10px]  2xl:text-sm">
                    <span>
                      {" "}
                      {moment(plan.start_datetime).locale("fa").format("HH:mm")}
                    </span>
                    <span> {t.until}</span>
                    <span>
                      {" "}
                      {moment(plan.end_datetime).locale("fa").format("HH:mm")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className=" flex  flex-row  items-start justify-between  gap-2">
          <div className="group relative ">
            {/* make parent group relative to work :) */}
            <ToolTip className="flex items-center justify-center gap-2">
              <PersonStandingIcon className={`stroke-accent`} />
              <span>
                {" "}
                {t.capacity}:{capicity}{" "}
              </span>
            </ToolTip>

            {/* <div className=" flex w-40 flex-wrap  items-center justify-start  gap-2">
              {[...Array(capicity).keys()].map((i) => {
                return (
                  <>
                    <PersonStandingIcon
                      key={i}
                      className={twMerge(
                        "transition-all duration-300",
                        i < filled
                          ? "scale-125 rounded-full stroke-emerald-600 shadow-primbuttn"
                          : "scale-90 stroke-gray-400"
                      )}
                    />
                  </>
                );
              })}
            </div> */}
          </div>

          {language === "fa" ? (
            <span className="text-primary">
              {countOfParticipants === 0 ? (
                "0 شرکت کننده"
              ) : (
                <>
                  {countOfParticipants} نفر شرکت{" "}
                  {countOfParticipants === 1
                    ? "کرده است"
                    : countOfParticipants > 1
                    ? "کرده اند"
                    : ""}
                </>
              )}
            </span>
          ) : (
            <span className="text-primary">
              Participants {countOfParticipants}
            </span>
          )}
          <div className="flex flex-col items-end justify-end gap-2">
            {" "}
            {/* <div className="grid grid-cols-3 items-center justify-end gap-2">
              <PrinterIcon />
              <CastIcon />
              <ProjectorIcon />
            </div> */}
            {plan.is_confidential ? (
              <div className="flex items-center justify-center gap-2 text-emerald-800  ">
                <ShieldCheck className="size-4 shrink-0" />
                <span> {t.confidential}</span>
              </div>
            ) : (
              <span className="text-primary">{plan.title}</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          {plan.room.price != 0 && <span>{plan.room.price} تومان</span>}
          {/* userId === plan.userId && */}
          {plan.status !== "Done" && <DeleteSession id={plan.id} />}
          {userId !== plan.userId &&
            plan.status === "Reserved" &&
            sessionData.user.role === "USER" &&
            plan.participants.find((a) => a.userId === userId) && (
              <>
                <Button
                  disabled={joinPlan.isLoading || exitPlan.isLoading}
                  isLoading={joinPlan.isLoading || exitPlan.isLoading}
                  onClick={() => {
                    if (hasAlreadyJoined) {
                      exitPlan
                        .mutateAsync({ planId: plan.id, userId: userId })
                        .then(() => onInvalidate());
                    } else {
                      joinPlan
                        .mutateAsync({ planId: plan.id, userId: userId })
                        .then(() => onInvalidate());
                    }
                  }}
                  className={twMerge(
                    " px-5 text-black",
                    hasAlreadyJoined ? "bg-amber-500" : "bg-teal-600"
                  )}
                >
                  {hasAlreadyJoined ? t.exit : t.enter}
                </Button>
              </>
            )}
        </div>
      </div>
    </>
  );
}

function RoomsListSkeleton() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-10 ">
      {[...Array(32).keys()].map((i) => {
        return (
          <>
            <span
              key={i}
              className="inline-block h-28 w-28 animate-pulse   rounded-xl bg-accent opacity-30"
              style={{
                animationDelay: `${i * 5}`,
                animationDuration: "1s",
              }}
            />
          </>
        );
      })}
    </div>
  );
}
