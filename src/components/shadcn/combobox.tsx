"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/shadcn/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/shadcn/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/shadcn/popover";
import { Label } from "recharts";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

type MyComboboxProps = {
  label?: string;
  value: string;
  setValue: (value: string) => void;
  values: { label: string; value: string }[];
  inputDisabled?: boolean;
  inputPlaceholder?: string;
};

export const MyCombobox: React.FC<MyComboboxProps> = (props) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex w-full flex-col">
        {props.label && <span className="mb-1">{props.label}</span>}
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            {props.value
              ? props.values.find((item) => item.value === props.value)?.label
              : props.label + "..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent
        className={"popover-content-width-same-as-its-trigger p-0"}
      >
        <Command>
          {props.inputDisabled && (
            <CommandInput placeholder={props.inputPlaceholder} />
          )}
          <CommandEmpty>NOTHING_FOUND</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {props.values.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    props.setValue(
                      currentValue === props.value ? "" : currentValue,
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      props.value === item.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
