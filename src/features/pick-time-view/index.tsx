import moment, { Moment } from "jalali-moment";
import React, { useState, useLayoutEffect, useEffect } from "react";
import { useToast } from "~/components/ui/toast/use-toast";
import { TimePicker } from "~/ui/time-picker";
export default function PickTimeView({ date }: { date: Moment }) {
  const canUseDOM: boolean = !!(
    typeof window !== "undefined" &&
    typeof window.document !== "undefined" &&
    typeof window.document.createElement !== "undefined"
  );
  const { toast } = useToast();
  const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;
  const [isMounted, setIsMounted] = useState(false);
  useIsomorphicLayoutEffect(() => {
    setIsMounted(true);
  }, []);
  const [value, setValue] = useState("10:00");

  return (
    <div>
      <TimePicker
        onChange={(timeValue: string) => {
          const hour = parseInt(timeValue.split(":")[0]);
          const minute = parseInt(timeValue.split(":")[1]);
          const now = moment()
            .set({
              h: moment().locale("fa").hour(),
              m: moment().locale("fa").minute(),
            })
            .locale("fa");

          const pickedTime = date
            .clone()
            .set({
              h: hour,
              m: minute,
            })
            .locale("fa");

          if (pickedTime.isAfter(now)) setValue(timeValue);
          else {
            toast({
              title: "خطای انتخاب زمان",
              description:
                "زمان انتخاب شده نمی تواند قبل  یا برابر زمان فعلی باشد",
            });
          }
        }}
        value={value}
      />
    </div>
  );
}
