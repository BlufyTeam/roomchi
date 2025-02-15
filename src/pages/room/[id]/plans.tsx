import moment from "jalali-moment";
import {
  BanIcon,
  CalendarCheckIcon,
  CalendarRangeIcon,
  LinkIcon,
  ShieldCheck,
} from "lucide-react";
import React, { useState } from "react";
import { QrCode } from "~/components/main/qr-code";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/shadcn/popover";
import { useLanguage } from "~/context/language.context";
import { cn } from "~/lib/utils";
import Button from "~/ui/buttons";
import ChevronDownIcon from "~/ui/icons/chervons/chevron-down";
import Modal from "~/ui/modals";
import { RouterOutputs } from "~/utils/api";

type PlanWithRoom = RouterOutputs["plan"]["getPlansByDateAndRoom"][number];

interface PlansProps {
  plans: PlanWithRoom[];
}

export default function Plans({ plans = [] }: PlansProps) {
  const { t } = useLanguage();
  const inProgressPlans = plans.filter(
    (plan) => plan.status === "AlreadyStarted"
  );
  const otherPlans = plans.filter((plan) => plan.status !== "AlreadyStarted");

  const getGridCols = (count: number) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "sm:grid-cols-2 ";
    return "lg:grid-cols-3";
  };
  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {inProgressPlans.length > 0 && (
        <div>
          <h2 className="mb-4 text-2xl font-bold text-primary">
            {t.inProgress}
          </h2>
          <div
            className={cn("grid  gap-6 ", getGridCols(inProgressPlans.length))}
          >
            {inProgressPlans.map((plan) => (
              <PlanItem key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-4 text-2xl font-bold text-primary">{t.UpComming}</h2>
        <div
          className={cn(
            "grid  grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {otherPlans.map((plan) => (
            <PlanItem key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanItem({ plan }: { plan: PlanWithRoom }) {
  const { t, language } = useLanguage();
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

  const dir = language === "fa" ? "trl" : "ltr";
  return (
    <div
      dir={dir}
      className="flex  flex-col justify-between gap-2 rounded-lg bg-secondary p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
    >
      <div
        dir={dir}
        className={cn(
          `mb-4 flex items-center justify-start gap-2 rounded-md p-3`,
          statusConfig.bgColor,
          statusConfig.textColor
        )}
      >
        {statusConfig.icon}
        <span dir={dir} className="text-xl font-semibold">
          {statusConfig.label}
        </span>
      </div>
      {plan.is_confidential ? (
        <div
          dir={dir}
          className="flex items-center  justify-center gap-2 text-2xl text-emerald-800  "
        >
          <ShieldCheck className="size-6 shrink-0" />
          <span> {t.confidential}</span>
        </div>
      ) : (
        <span dir={dir} className="text-center text-primary">
          {plan.title}
        </span>
      )}
      {!plan.is_confidential && (
        <ParticipantsModal participants={plan?.participants ?? []} />
      )}

      {plan?.link && <LinkModal url={plan.link} />}
      <div dir={dir} className="text-start">
        <p className="text-xl text-primary">
          {moment(plan.start_datetime).locale("fa").format("HH:mm")}
          {" - "}
          {moment(plan.end_datetime).locale("fa").format("HH:mm")}
        </p>
      </div>
    </div>
  );
}

function ParticipantsModal({ participants }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  return (
    <>
      <Button
        className="bg-emerald-200 text-emerald-800"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {t.participants}
      </Button>
      <Modal
        title={t.participants}
        className="bg-secondary"
        size="sm"
        isOpen={isOpen}
        center
        onClose={() => setIsOpen(false)}
      >
        <div className="flex flex-wrap items-center justify-start gap-2 p-5">
          {participants.map((participant) => (
            <div
              key={participant.userId}
              className="flex items-center space-x-2"
            >
              <span className=" rounded-full bg-emerald-200 px-2 text-xl text-emerald-800">
                {participant.user.name}
              </span>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}

function LinkModal({ url }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  return (
    <>
      <Button
        className="gap-2 bg-emerald-200 text-emerald-800"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <span> {t.linkForOnlineMeeting}</span>
        <LinkIcon />
      </Button>
      <Modal
        title={t.linkForOnlineMeeting}
        className="bg-secondary"
        size="sm"
        isOpen={isOpen}
        center
        onClose={() => setIsOpen(false)}
      >
        <div className="flex flex-col items-center justify-center gap-2  p-5">
          <QrCode value={url} />
          <a href={url} className="text-primary underline underline-offset-8">
            {url}
          </a>
        </div>
      </Modal>
    </>
  );
}
