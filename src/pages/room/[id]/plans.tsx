import moment from "jalali-moment";
import { BanIcon, CalendarCheckIcon, CalendarRangeIcon } from "lucide-react";
import React from "react";
import { useLanguage } from "~/context/language.context";
import { RouterOutputs } from "~/utils/api";

type PlanWithRoom = RouterOutputs["plan"]["getPlansByDate"][number];

interface PlansProps {
  plans: PlanWithRoom[];
}

export default function Plans({ plans = [] }: PlansProps) {
  const { t } = useLanguage();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1  gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {plans.map((plan) => (
          <PlanItem key={plan.id} plan={plan} t={t} />
        ))}
      </div>
    </div>
  );
}

function PlanItem({ plan, t }: { plan: PlanWithRoom; t: any }) {
  const status = plan.status;
  let statusConfig;

  switch (status) {
    case "Done":
      statusConfig = {
        bgColor: "bg-cyan-100",
        textColor: "text-cyan-800",
        icon: <CalendarCheckIcon className="h-5 w-5" />,
        label: t.finished,
      };
      break;
    case "Reserved":
      statusConfig = {
        bgColor: "bg-rose-100",
        textColor: "text-rose-800",
        icon: <CalendarRangeIcon className="h-5 w-5" />,
        label: t.reserved,
      };
      break;
    case "AlreadyStarted":
      statusConfig = {
        bgColor: "bg-amber-100",
        textColor: "text-amber-800",
        icon: <BanIcon className="h-5 w-5" />,
        label: t.inProgress,
      };
      break;
    default:
      statusConfig = {
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        icon: null,
        label: "Unknown",
      };
  }

  return (
    <div
      dir="rtl"
      className="flex flex-col justify-between rounded-lg border border-primary/10 bg-secbuttn p-4 shadow-md"
    >
      <div
        className={`flex items-center justify-start gap-2 rounded-md ${statusConfig.bgColor} ${statusConfig.textColor} mb-2 p-2`}
      >
        {statusConfig.icon}
        <span className="text-2xl">{statusConfig.label}</span>
      </div>
      <div className="text-right">
        <p className="text-2xl text-accent">
          {moment(plan.start_datetime).locale("fa").format("HH:mm")}
          {t.until}
          {moment(plan.end_datetime).locale("fa").format("HH:mm")}
        </p>
      </div>
    </div>
  );
}
