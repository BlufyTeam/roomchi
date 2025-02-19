import { Moment } from "jalali-moment";

export function getMonthDays(moment: Moment): Moment[] {
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
