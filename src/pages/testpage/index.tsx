"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import UploadImage from "~/features/uplaod-image-base64";
import moment from "jalali-moment";
import { api } from "~/utils/api";
import { generateQRCode } from "~/utils/qr-code";
import Image from "next/image";

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

export default function TestPage({ url }) {
  // const plans = api.plan.getPlansByDate.useQuery({
  //   // roomId: router.query.id as string,
  //   date: moment("2023-06-13").toDate(),
  // });
  // if (plans.isLoading) return <>loading</>;
  return (
    <>
      {url}
      <Image src={url} width={500} height={500} alt="" />
      <br />
    </>
  );
}

export function ComboBox({
  value = [],
  onChange = () => {},
  placeHolder = "",
}) {
  const [open, setOpen] = React.useState(false);
  const [_value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {_value
            ? value.find((item) => item.value === _value)?.label
            : placeHolder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeHolder} />
          <CommandEmpty>پیدا نشد</CommandEmpty>
          <CommandGroup>
            {value.map((item) => (
              <CommandItem
                key={item.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === _value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    _value === item.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export async function getServerSideProps() {
  const gen = await generateQRCode("https://google.com");
  console.log(gen);
  return {
    props: {
      url: gen,
    },
  };
}
