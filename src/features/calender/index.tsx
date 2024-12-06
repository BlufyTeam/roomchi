import moment, { Moment } from "jalali-moment";
import { MegaphoneIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { InPageMenu } from "~/features/menu";
import { LayoutGroup } from "framer-motion";
import { useLanguage } from "~/context/language.context";
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

const MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
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
  const { language } = useLanguage();
  const [calendar, setCalender] = useState(
    getMonthDays(moment().locale(language))
  );
  return (
    <div className="grid  max-w-7xl  gap-10 px-2 py-10">
      <LayoutGroup id="months-InPageMenu">
        <InPageMenu
          className="mx-auto rounded-xl bg-secbuttn px-5 pb-1 pt-2"
          value={moment().locale(language).month()}
          list={language === "fa" ? MONTHS : MONTHS_EN}
          onChange={(monthNumber) => {
            const newCalendar = getMonthDays(
              moment().jMonth(monthNumber).locale(language)
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
        <MonthDays />
      </div>
      <div className="grid  grid-cols-7 gap-2">
        {calendar.map((item: Moment, i) => {
          const isItemToday =
            moment().locale(language).format("D MMMM yyyy") ===
            item.locale(language).format("D MMMM yyyy");
          return (
            <>
              <button
                onClick={() => onClick(item)}
                key={i}
                disabled={item
                  .clone()
                  .isBefore(moment().locale(language).subtract(1, "day"))}
                className={twMerge(
                  "text-centerd group relative flex cursor-pointer items-center justify-center"
                )}
              >
                {isItemToday && (
                  <span className="absolute flex  h-3 w-3 md:right-2 ">
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-accent/30"></span>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/75  "></span>
                  </span>
                )}
                {onDate && onDate(item, calendar[16].jMonth())}
              </button>
            </>
          );
        })}
      </div>
    </div>
  );
}

function MonthDays() {
  const { language } = useLanguage();
  if (language === "fa")
    return (
      <>
        <span>شنبه</span>
        <span>یک شنبه</span>
        <span>دو شنبه</span>
        <span>سه شنبه</span>
        <span>چهار شنبه</span>
        <span>پنج شنبه</span>
        <span>جمعه</span>
      </>
    );
  else
    return (
      <>
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </>
    );
}
