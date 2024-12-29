"use client";

import * as React from "react";

import { cn } from "~/lib/utils";
import { CheckIcon, MinusIcon, XIcon } from "lucide-react";

// const switchVariants = cva(
//   "peer relative inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-xl ring-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-primary disabled:cursor-not-allowed disabled:opacity-50",
//   {
//     variants: {
//       bg: {
//         magenta:
//           "data-[state=checked]:bg-dikado-magenta-100 data-[state=unchecked]:bg-dikado-magenta-950",
//         green:
//           "data-[state=checked]:bg-dikado-green-100 data-[state=unchecked]:bg-dikado-green-950",
//         yellow:
//           "data-[state=checked]:bg-dikado-yellow-100 data-[state=unchecked]:bg-dikado-yellow-950",
//         blue: "data-[state=checked]:bg-dikado-blue-100 data-[state=unchecked]:bg-dikado-blue-950",
//         red: "data-[state=checked]:bg-dikado-red-100 data-[state=unchecked]:bg-dikado-red-950",
//         primary:
//           "data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary",
//       },
//       stroke: {
//         magenta:
//           "data-[state=checked]:stroke-dikado-magenta-500 data-[state=unchecked]:stroke-dikado-magenta-100",
//         green:
//           "data-[state=checked]:stroke-dikado-green-500 data-[state=unchecked]:stroke-dikado-green-100",
//         yellow:
//           "data-[state=checked]:stroke-dikado-yellow-500 data-[state=unchecked]:stroke-dikado-yellow-100",
//         blue: "stroke-dikado-blue-default ",
//         red: "data-[state=checked]:stroke-dikado-red-500 data-[state=unchecked]:stroke-dikado-red-100",
//         primary: "stroke-primary",
//       },
//     },
//     defaultVariants: {
//       bg: "magenta",
//     },
//   },
// );

export function Switch({
  className = "",
  middle = false,
  checked = false,
  IconLeft = XIcon,
  IconRight = CheckIcon,
  onClick = () => {},
  ...props
}) {
  return (
    <div
      onClick={() => onClick()}
      data-state={checked ? "checked" : "unchecked"}
      className={cn(
        `focus-visible:ring-offset-primary peer relative inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-xl ring-primary transition-colors data-[state=checked]:bg-accent/30 data-[state=unchecked]:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
        className
      )}
      {...props}
    >
      <div
        data-state={checked ? "checked" : "unchecked"}
        className={cn(
          `pointer-events-none absolute left-0 block h-4 w-4 rounded-full bg-transparent shadow-lg ring-0 transition-transform`,
          middle
            ? `w-6 translate-x-1 data-[state=checked]:bg-primbuttn/50 data-[state=unchecked]:bg-secondary/5`
            : ``,
          checked
            ? "translate-x-4 bg-accent/10"
            : "translate-x-0 bg-secondary/20"
        )}
      />
      {middle && (
        <MinusIcon
          className={cn(
            `absolute left-1/2 top-1/2 w-4 -translate-x-1/2 -translate-y-1/2 stroke-accent`
          )}
        />
      )}

      <IconRight
        className={cn(
          `absolute right-0 top-1/2 h-3 w-3 -translate-x-[2px] -translate-y-1/2 stroke-accent stroke-[3px] drop-shadow-lg transition-all duration-500`,
          checked && !middle
            ? ""
            : "right-0 top-1/2 h-3 w-3 -translate-x-[18px] -translate-y-1/2 -rotate-180 scale-0"
        )}
      />

      <IconLeft
        className={cn(
          `absolute right-0 top-1/2 h-3 w-3 -translate-x-[18px] -translate-y-1/2 stroke-primary transition-all duration-500`,
          !checked && !middle
            ? ""
            : "right-0 top-1/2 h-3 w-3 -translate-x-[2px] -translate-y-1/2 -rotate-180 scale-0"
        )}
      />
    </div>
  );
}
