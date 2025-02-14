"use client";

import { Label } from "~/components/shadcn/label";
import { Check, ChevronDown } from "lucide-react";
import { useState, FC, useEffect } from "react";

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
import { cn } from "~/lib/utils";
import withLabel from "~/ui/forms/with-label";
import TextField from "~/ui/forms/text-field";
const TextFieldWithLabel = withLabel(TextField);
interface Item {
  value: string;
  label: string;
  label2?: string;
}

interface SelectAndSearchProps {
  list: Item[];
  name?: string;
  title?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  withOtherOption?: boolean;
  btnClassName?: string;
  disabled?: boolean;
}

const SelectAndSearch: FC<SelectAndSearchProps> = ({
  list = [],
  name,
  value,
  title = "انتخاب کنید",
  onChange,
  className,
  withOtherOption = true,
  btnClassName,
  disabled = false,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isOther, setIsOther] = useState<boolean>(false);
  const [other_value, setOther_value] = useState<string>("");
  const [_value, set_Value] = useState<string>(value);

  useEffect(() => {
    if (list?.map((a) => a.value).includes(value)) {
      setIsOther(false);
    }
    set_Value(value);
  }, [value]);
  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <div className="flex items-center justify-center gap-1">
          <PopoverTrigger
            disabled={disabled}
            asChild
            className="cursor-pointer py-3"
          >
            <Button
              id="select-41"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "focus-visible:border-ring focus-visible:outline-ring/20 h-[50px] cursor-pointer justify-between rounded-xl border-none bg-secondary px-3 font-normal text-primary outline-offset-0 hover:bg-secondary hover:text-accent focus-visible:outline-[3px]",
                isOther ? "w-auto justify-center" : "w-full",
                btnClassName
              )}
            >
              {!isOther && value !== "other" && (
                <span
                  className={cn("truncate py-3", !_value && "text-primary")}
                >
                  {list?.find((item) => item.value === _value)?.label || title}
                </span>
              )}
              <ChevronDown
                size={16}
                strokeWidth={2}
                className="shrink-0 text-primary/80"
                //  aria-hidden="true"
              />
            </Button>
          </PopoverTrigger>{" "}
          {isOther && (
            <div className="">
              <TextFieldWithLabel
                label={title}
                name={name}
                value={other_value}
                maxLength={255}
                onChange={(e) => {
                  setOther_value(e.target.value);
                  onChange(e.target.value);
                }}
                className="border-b-0 text-primary"
                labelClassName=" peer-focus:text-primary text-primary"
                containerClassName="bg-secondary md:max-w-[220px] w-full rounded-xl text-primary"
                iconContainerClassName="peer-focus:stroke-primary stroke-primary"
              />
            </div>
          )}
        </div>
        <PopoverContent
          dir="rtl"
          className="w-full min-w-[var(--radix-popper-anchor-width)] rounded-xl border-none bg-secondary p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder={title} />
            <CommandList>
              <CommandEmpty>موردی یافت نشد</CommandEmpty>
              <CommandGroup>
                {list?.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    className={cn(
                      "flex w-full cursor-pointer items-start justify-between ",
                      _value === item.value
                        ? "bg-primary text-secondary hover:text-secondary"
                        : "bg-secondary text-primary hover:text-primary"
                    )}
                    onSelect={(current_value) => {
                      onChange(current_value === _value ? "" : current_value);
                      setOpen(false);
                    }}
                  >
                    <span>{item.label}</span>
                    <div className="flex">
                      {_value === item.value && (
                        <Check
                          className={cn(
                            "",
                            _value === item.value
                              ? "size-5 opacity-100"
                              : "opacity-0"
                          )}
                        />
                      )}{" "}
                      {item?.label2 && <span>{item?.label2}</span>}
                    </div>
                  </CommandItem>
                ))}
                {withOtherOption && (
                  <CommandItem
                    key="other"
                    value="other"
                    className="flex w-full items-start justify-between"
                    onSelect={() => {
                      onChange("other");
                      setIsOther(true);
                      setOpen(false);
                    }}
                  >
                    <span className="text-primary">سایر</span>
                    <Check
                      className={cn(
                        "",
                        isOther && _value === "other"
                          ? "size-5 opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SelectAndSearch;
