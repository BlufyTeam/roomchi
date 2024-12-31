import { BellIcon, BellOffIcon, CheckIcon } from "lucide-react";
import React from "react";
import { Label } from "~/components/shadcn/label";
import { cn } from "~/lib/utils";
import Button from "~/ui/buttons";
import XIcon from "~/ui/icons/xicon";

export default function ButtonCheckbox({ checked, text, onClick = () => {} }) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 py-3 font-bold transition-all",
        checked
          ? "bg-emerald-200 text-emerald-800"
          : "bg-rose-200 text-rose-800"
      )}
    >
      {" "}
      <input
        type="hidden"
        className="size-4 cursor-pointer"
        checked={checked}
      />
      <Label htmlFor="send_email" className="cursor-pointer">
        {text}
      </Label>{" "}
      {checked ? (
        <BellIcon className={cn("size-5")} />
      ) : (
        <BellOffIcon className={cn("size-5")} />
      )}
    </Button>
  );
}
