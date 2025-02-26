import moment, { Moment } from "jalali-moment";
import { MegaphoneIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useLayoutEffect, useState } from "react";
import { InPageMenu } from "~/features/menu";
import { LayoutGroup } from "framer-motion";
import { useLanguage } from "~/context/language.context";
import { cn } from "~/lib/utils";
import { getMonthDays } from "~/utils/date";

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
  onFirstCalender?: (startDate: Moment, endDate: Moment) => unknown;
  onClick?: (date: Moment) => unknown;
  className?: string;
};

export default function Calendar({
  onDate,
  onMonthChange,
  onFirstCalender = (a, b) => {},
  onClick = () => {},
  className = "",
}: Props) {
  const { language } = useLanguage();
  const [calendar, setCalendar] = useState(
    getMonthDays(moment().utc().locale(language))
  );
  useLayoutEffect(() => {
    let newCalendar = undefined;
    if (language === "en")
      newCalendar = getMonthDays(moment().utc().locale(language));
    if (language === "fa")
      newCalendar = getMonthDays(moment().utc().locale(language));
    onFirstCalender(newCalendar.at(0), newCalendar.at(newCalendar.length - 1));
  }, []);
  return (
    <div className={cn("grid  max-w-7xl  gap-10 px-2 py-10", className)}>
      <LayoutGroup id="months-InPageMenu">
        <InPageMenu
          className="mx-auto rounded-xl bg-secbuttn px-5 pb-1 pt-2"
          value={moment().utc().locale(language).month()}
          list={language === "fa" ? MONTHS : MONTHS_EN}
          onChange={(monthNumber) => {
            let newCalendar = undefined;
            if (language === "en")
              newCalendar = getMonthDays(
                moment().utc().month(monthNumber).locale(language)
              );
            if (language === "fa")
              newCalendar = getMonthDays(
                moment().utc().jMonth(monthNumber).locale(language)
              );
            setCalendar(newCalendar);
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
            moment().utc().locale(language).format("D MMMM yyyy") ===
            item.locale(language).format("D MMMM yyyy");
          return (
            <>
              <button
                onClick={() => onClick(item)}
                key={i}
                disabled={item
                  .clone()
                  .isBefore(moment().utc().locale(language).subtract(1, "day"))}
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
