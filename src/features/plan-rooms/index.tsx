import moment, { Moment } from "jalali-moment";
import { ArrowLeftIcon, HourglassIcon, MoveLeftIcon } from "lucide-react";
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
          <h3 className="w-full px-2  text-right font-bold">
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
            <ReplaceIcon className="stroke-inherit" />,
            <ReplaceIcon className="stroke-inherit" />,
            <HourglassIcon className="stroke-inherit" />,
            <HourglassIcon className="stroke-inherit" />,
            <HourglassIcon className="stroke-inherit" />,
            <HourglassIcon className="stroke-inherit" />,
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
const stepPercentages = [0, 22, 36, 50, 64, 78, 100];
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
      <div className="relative flex min-h-[50px] w-2/3 items-center justify-center gap-2 overflow-hidden ">
        <div className="absolute z-0 h-[1px] w-10/12  bg-gradient-to-r from-transparent from-0% via-accent via-50% to-transparent to-100%"></div>
        <Button
          className={twMerge(
            "group absolute left-5 rounded-full p-1 ring-1 ring-accent transition duration-500 hover:bg-accent/20 hover:ring-secondary",
            currentStep === 0 ? "opacity-0" : "opacity-100"
          )}
          onClick={() => {
            if (currentStep - 1 >= 0) onPrevious();
          }}
        >
          <ArrowLeftIcon className="h-4 w-4 group-hover:stroke-accent " />
        </Button>
        <Button
          className={twMerge(
            "group absolute right-5  rounded-full p-1 ring-1 ring-accent transition duration-500 hover:bg-accent/20 hover:ring-secondary",
            currentStep === icons.length - 1 ? "opacity-0" : "opacity-100"
          )}
        >
          <ArrowRightIcon
            className="h-4 w-4 group-hover:stroke-accent "
            onClick={() => {
              if (currentStep + 1 <= icons.length - 1) onNext();
            }}
          />
        </Button>
        <div className="relative flex w-full items-center justify-center gap-10  ">
          {icons.map((_, i) => {
            const currentLeft = 50 + i * 20;
            return (
              <button
                className={twMerge(
                  "z-1 pointer-events-none absolute  flex -translate-x-1/2 scale-75 rounded-full  transition-all duration-300 sm:pointer-events-auto ",
                  currentStep === i ? "opacity-100" : "opacity-60"
                )}
                style={{
                  left:
                    currentStep === i
                      ? `${50}%`
                      : true
                      ? `${currentLeft - currentStep * 20}%`
                      : "100%",
                  scale: currentStep === i ? "130%" : `${100 - i * 5}%`,
                }}
              >
                <span
                  onClick={() => {
                    onStepClick(i);
                  }}
                  className={twMerge(
                    `cursor-pointer  rounded-full border border-accent bg-secondary stroke-primary p-3  transition-all duration-500`,
                    i === currentStep ? "stroke-accent " : ""
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
