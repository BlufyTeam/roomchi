import moment, { Moment } from "jalali-moment";
import {
  ChevronLeft,
  ChevronRight,
  HourglassIcon,
  Loader2Icon,
  MonitorUpIcon,
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
type Props = {
  date: Moment;
};
export default function PlanRooms({ date }: Props) {
  const getPlans = api.plan.getPlansByDate.useQuery({
    date: date.toDate(),
  });
  if (getPlans.isLoading)
    return (
      <div className="flex w-5/6 flex-col items-center justify-center gap-4 p-5">
        <RoomsListSkeleton />
      </div>
    );

  const canPickTime = date.isSameOrAfter(moment(), "jDay");
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-5">
      {getPlans.data.length > 0 && (
        <>
          <h3 className="w-full px-2 text-right font-bold text-primary">
            اتاق های رزرو شده در تاریخ {date.locale("fa").format("D MMMM yyyy")}
          </h3>

          <PlanListWithRoom plans={getPlans.data} />
        </>
      )}
      {getPlans.data.length > 0 && canPickTime && (
        <div className="h-0.5 w-full rounded-full bg-accent/50" />
      )}
      {canPickTime && (
        <>
          <h3 className="w-full px-2  text-right text-accent">
            برای رزرو اتاق انتخاب کنید
          </h3>

          <ReserveRoom />
          {/* <PickTimeView date={date} /> */}
        </>
      )}
    </div>
  );
}

export function ReserveRoom() {
  const [step, setStep] = useState(0);
  return (
    <>
      <div className="flex  w-full overflow-hidden ">
        <MultiStep
          onStepClick={(stepNumber) => {
            setStep(stepNumber);
          }}
          onPrevious={() => {
            setStep((prev) => prev - 1);
          }}
          onNext={() => {
            setStep((prev) => prev + 1);
          }}
          icons={[
            <ReplaceIcon className="stroke-inherit" />,
            <HourglassIcon className="stroke-inherit" />,
            <Loader2Icon className="stroke-inherit" />,
          ]}
          currentStep={step}
          steps={[
            <RoomsList
              onClick={() => {
                setStep((prev) => prev + 1);
              }}
            />,
            <RoomForm />,
          ]}
        />
      </div>
    </>
  );
}

export function MultiStep({
  currentStep = 0,
  onStepClick = (step: number) => {},
  icons = [],
  steps = [],
  onNext = () => {},
  onPrevious = () => {},
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-5">
      <div className="relative flex min-h-[150px] w-full items-center justify-center gap-2 overflow-hidden md:w-2/3 ">
        <div className="absolute z-0 h-[1px] w-11/12  bg-gradient-to-r from-transparent from-0% via-accent via-50% to-transparent to-100%">
          {currentStep >= 2 && (
            <div
              style={{
                left: `${Math.min(currentStep * 10, 100)}%`,
              }}
              className="absolute left-[50.5%] top-0 -z-10 hidden h-[28px] w-[40%] transition-all duration-300 sm:block"
            >
              <svg
                className="translate-x-0 translate-y-0"
                preserveAspectRatio="none"
                height="28px"
                width="100%"
                viewBox="0 0 482 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 0.5H482" className="stroke-primary"></path>
                <path
                  d="M16 0.5H466"
                  stroke="url(#kjhsdfg87346kjhs)"
                  strokeDasharray="4 4"
                ></path>
                <path
                  d="M0.5 0.5C29 0.5 20 27.5 49.5 27.5C49.5 27.5 400.5 27.5 433 27.5C465.5 27.5 448.5 0.5 482 0.5"
                  pathLength="1"
                  stroke="url(#klujyhsertd9087645uigh)"
                  className="Onboarding_TrackBranchLine__UTQSQ "
                ></path>
                <defs>
                  <linearGradient
                    id="kjhsdfg87346kjhs"
                    x1="0"
                    y1="0"
                    x2="482"
                    y2="28"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="var(--accent)"></stop>
                    <stop offset="1" stop-color="var(--accent)"></stop>
                  </linearGradient>
                  <linearGradient
                    id="klujyhsertd9087645uigh"
                    x1="0"
                    y1="0"
                    x2="482"
                    y2="28"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stop-color="var(--accent)"></stop>
                    <stop offset="0.1" stop-color="var(--bg-purple)"></stop>
                    <stop offset="1" stop-color="var(--bg-primary)"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          )}
        </div>
        <div className="absolute inset-0 flex w-full items-center justify-between  ">
          <Button
            className={twMerge(
              "group absolute left-1 z-20 rounded-full p-1.5 ring-1 ring-accent transition duration-500 hover:bg-accent/20 hover:ring-secondary",
              currentStep === 0 ? "opacity-0" : "opacity-100"
            )}
            onClick={() => {
              if (currentStep - 1 >= 0) onPrevious();
            }}
          >
            <ChevronLeft className="h-5 w-5 stroke-primbuttn group-hover:stroke-accent " />
          </Button>
          <Button
            className={twMerge(
              "group absolute right-1 z-20  rounded-full p-1.5 ring-1 ring-accent transition duration-500 hover:bg-accent/20 hover:ring-secondary",
              currentStep === icons.length - 1 ? "opacity-0" : "opacity-100"
            )}
            onClick={() => {
              if (currentStep + 1 <= icons.length - 1) onNext();
            }}
          >
            <ChevronRight className="h-5 w-5 stroke-primbuttn group-hover:stroke-accent " />
          </Button>
        </div>
        <div className="relative flex h-full w-full items-center justify-center gap-10  ">
          {icons.map((_, i) => {
            const currentLeft = 50 + i * 20;
            const distance = Math.abs(currentStep - i);
            const scale =
              distance === 1 ? "100%" : distance === 2 ? "70%" : "0%";
            return (
              <button
                onClick={() => {
                  onStepClick(i);
                }}
                className={twMerge(
                  "z-1 duration-2200  absolute flex -translate-x-1/2 scale-75  cursor-pointer rounded-full transition-all ",
                  currentStep === i
                    ? "bg-primary stroke-secbuttn  "
                    : "bg-secondary stroke-accent opacity-0 sm:opacity-100",
                  i == 2 || i == 3 || i == 4 ? "bottom-5" : ""
                )}
                style={{
                  left:
                    currentStep === i
                      ? `${50}%`
                      : `${Math.min(currentLeft - currentStep * 20, 100)}%`,

                  scale: currentStep === i ? "130%" : scale,
                }}
              >
                <span
                  className={twMerge(
                    `cursor-pointer  rounded-full border   stroke-inherit  p-3  transition-all duration-500`,
                    currentStep === i
                      ? "border-primary opacity-100"
                      : "border-accent/50 bg-accent/20 opacity-50"
                  )}
                >
                  <span>{icons[i]}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {steps.map((_, i) => {
        if (i === currentStep) return <>{steps[currentStep]}</>;
      })}
    </div>
  );
}
