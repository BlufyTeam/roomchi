import moment from "jalali-moment";
import React, { useState, useLayoutEffect, useEffect } from "react";
import { useToast } from "~/components/ui/toast/use-toast";
import { TimePicker } from "~/ui/time-picker";
export default function PickTimeView() {
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
          if (moment(timeValue, "HH:mm").isAfter(moment(moment(), "HH:mm")))
            setValue(timeValue);
          else {
            toast({
              title: "خطای انتخاب زمان",
              description:
                "زمان انتخاب شده نمی تواند قبل  یا برابر زمان فعلی باشد",
            });
            setValue(undefined);
          }
        }}
        value={value}
      />
    </div>
  );
}
