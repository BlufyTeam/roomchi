import moment, { Moment } from "jalali-moment";
import { MegaphoneIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { InPageMenu } from "~/features/menu";
import { LayoutGroup } from "framer-motion";
function getMonthDays(moment: Moment): Moment[] {
  let calendarTemp = [];

  const startDay = moment.clone().startOf("month").startOf("week");
  const endDay = moment.clone().endOf("month").endOf("week");

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
  return calendar;
}

const MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

type Props = {
  onDate?: (
    date: Moment,
    monthNumber: number
  ) => React.ReactNode | string | undefined;
  onMonthChange?: (startDate: Moment, endDate: Moment) => unknown;
  onClick?: (date: Moment) => unknown;
};

export default function Calender({
  onDate,
  onMonthChange,
  onClick = () => {},
}: Props) {
  const [calendar, setCalender] = useState(getMonthDays(moment().locale("fa")));
  return (
    <div className="grid  max-w-7xl  gap-10 px-2 py-10">
      <LayoutGroup id="months-InPageMenu">
        <InPageMenu
          className="mx-auto rounded-xl bg-secbuttn px-5 pb-1 pt-2"
          value={moment().locale("fa").month()}
          list={MONTHS}
          onChange={(monthNumber) => {
            const newCalendar = getMonthDays(
              moment().jMonth(monthNumber).locale("fa")
            );
            setCalender(newCalendar);
            onMonthChange(
              newCalendar.at(0),
              newCalendar.at(newCalendar.length - 1)
            );
          }}
        />
      </LayoutGroup>

      <div className="grid grid-cols-7 text-center text-xs text-primary md:text-base">
        <span>شنبه</span>
        <span>یک شنبه</span>
        <span>دو شنبه</span>
        <span>سه شنبه</span>
        <span>چهار شنبه</span>
        <span>پنج شنبه</span>
        <span>جمعه</span>
      </div>
      <div className="grid  grid-cols-7 gap-2">
        {calendar.map((item: Moment, i) => {
          return (
            <>
              <button
                onClick={() => onClick(item)}
                key={i}
                disabled={item.isBefore(
                  moment().locale("fa").subtract(1, "day")
                )}
                className={twMerge(
                  "group flex cursor-pointer items-center justify-center text-center disabled:cursor-not-allowed"
                )}
              >
                {onDate(item, calendar[16].jMonth())}
              </button>
            </>
          );
        })}
      </div>
    </div>
  );
}
