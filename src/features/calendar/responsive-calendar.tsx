"use client";

import type React from "react";
import { useState, useEffect } from "react";
import moment from "jalali-moment";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useLanguage } from "~/context/language.context";
import SelectAndSearch from "~/components/origin/select-and-search";
import Button from "~/ui/buttons";
import ChevronRightIcon from "~/ui/icons/chervons/chervon-right";
import ChevronLeftIcon from "~/ui/icons/chervons/chevron-left";

interface CalendarProps {
  onDayClick?: (date: moment.Moment) => void;
  selectedDate?: moment.Moment;
}

export const ResponsiveCalendar: React.FC<CalendarProps> = ({
  onDayClick,
  selectedDate,
}) => {
  const { language, t } = useLanguage();
  const [currentDate, setCurrentDate] = useState(moment());
  const [isJalali, setIsJalali] = useState(language === "fa");

  useEffect(() => {
    setIsJalali(language === "fa");
  }, [language]);

  const months =
    language === "fa"
      ? [
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
        ]
      : [
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

  const weekDays = isJalali
    ? ["ش", "ی", "د", "س", "چ", "پ", "ج"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const years = Array.from(
    { length: 20 },
    (_, i) => currentDate.year() - 10 + i
  );

  const getDaysInMonth = () => {
    return currentDate.daysInMonth();
  };

  const getFirstDayOfMonth = () => {
    return currentDate.clone().startOf("month").day();
  };

  const handlePrevMonth = () => {
    setCurrentDate((prev) => prev.clone().subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => prev.clone().add(1, "month"));
  };

  const handleYearChange = (year: string) => {
    setCurrentDate((prev) => prev.clone().year(Number.parseInt(year)));
  };

  const handleMonthChange = (month: string) => {
    const monthIndex = months.indexOf(month);
    setCurrentDate((prev) => prev.clone().month(monthIndex));
  };

  const handleDayClick = (day: number) => {
    if (onDayClick) {
      const clickedDate = currentDate.clone().date(day);
      onDayClick(clickedDate);
    }
  };

  useEffect(() => {
    setCurrentDate((prev) => prev.clone().locale(isJalali ? "fa" : "en"));
  }, [isJalali]);

  const isSelectedDay = (day: number) => {
    return (
      selectedDate && selectedDate.isSame(currentDate.clone().date(day), "day")
    );
  };

  const isBeforeToday = (day: number) => {
    const date = currentDate.clone().date(day);
    return date.isBefore(moment(), "day");
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5">
      <div className=" flex flex-col items-center justify-between gap-4">
        <div className="flex w-full items-center justify-between gap-2 ">
          <SelectAndSearch
            title={t.Month}
            list={months.map((m) => ({
              label: m.toString(),
              value: m.toString(),
            }))}
            value={currentDate.format("MMMM")}
            onChange={handleMonthChange}
          />
          <SelectAndSearch
            title={t.Year}
            list={years.map((y) => ({
              label: y.toString(),
              value: y.toString(),
            }))}
            value={currentDate.format("YYYY")}
            onChange={handleYearChange}
          />
        </div>
        <div className=" flex w-full justify-between">
          <Button
            className="rounded-full bg-accent text-primary"
            onClick={handlePrevMonth}
          >
            <ChevronRightIcon />
          </Button>
          <Button
            className="rounded-full bg-accent text-primary"
            onClick={handleNextMonth}
          >
            <ChevronLeftIcon />
          </Button>
        </div>
      </div>

      <div className={`grid grid-cols-7 gap-1 `}>
        {weekDays.map((day) => (
          <div key={day} className="text-center font-medium">
            {day}
          </div>
        ))}
        {Array.from({ length: getFirstDayOfMonth() }, (_, i) => (
          <div key={`empty-${i}`} className="p-2 text-center"></div>
        ))}
        {Array.from({ length: getDaysInMonth() }, (_, i) => i + 1).map(
          (day) => (
            <Button
              key={day}
              className={`cursor-pointer rounded-2xl p-2 text-center ${
                isSelectedDay(day)
                  ? "bg-primary text-secondary"
                  : isBeforeToday(day)
                  ? "bg-gray-300 text-gray-500"
                  : "bg-secondary text-primary"
              }`}
              onClick={() => handleDayClick(day)}
              disabled={isBeforeToday(day)}
            >
              {day}
            </Button>
          )
        )}
      </div>
    </div>
  );
};
