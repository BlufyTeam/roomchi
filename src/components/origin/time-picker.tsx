import { Time } from "@internationalized/date";

import { Clock } from "lucide-react";
import { useState } from "react";
import {
  DateInput,
  DateSegment,
  Label,
  TimeField,
  TimeFieldProps,
  TimeValue,
  ValidationResult,
} from "react-aria-components";

interface MyTimeFieldProps<T extends TimeValue> extends TimeFieldProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function MyTimeField<T extends TimeValue>({
  label,
  description,
  errorMessage,
  ...props
}: MyTimeFieldProps<T>) {
  return (
    <TimeField {...props} className="w-[150px] space-y-2" hourCycle={24}>
      <div className="relative w-full">
        <DateInput
          style={{
            direction: "ltr",
          }}
          className="border-input data-[focus-within]:border-ring  data-[focus-within]:ring-ring/20 relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border px-3 py-2 ps-9 text-sm shadow-sm shadow-black/5 transition-shadow data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px]"
        >
          {(segment) => (
            <DateSegment
              style={{
                direction: "ltr",
              }}
              segment={segment}
              className="inline   rounded p-0.5 text-accent caret-transparent outline outline-0 data-[disabled]:cursor-not-allowed data-[focused]:bg-primary/50  data-[invalid]:data-[focused]:bg-red-600 data-[type=literal]:px-0 data-[focused]:data-[placeholder]:text-accent data-[focused]:text-secondary data-[invalid]:data-[focused]:data-[placeholder]:text-green-500 data-[invalid]:data-[focused]:text-green-500 data-[invalid]:data-[placeholder]:text-green-500 data-[invalid]:text-green-500 data-[placeholder]:text-accent/70 data-[type=literal]:text-accent/70 data-[disabled]:opacity-50"
            />
          )}
        </DateInput>{" "}
        <div className="pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center justify-center ps-3 text-accent/80">
          <Clock size={16} strokeWidth={2} aria-hidden="true" />
        </div>
      </div>
    </TimeField>
  );
}
