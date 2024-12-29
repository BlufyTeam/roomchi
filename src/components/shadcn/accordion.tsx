"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { MinusIcon, PlusIcon } from "lucide-react";

import { cn } from "~/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("", className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex items-center justify-center gap-2 rounded-lg border border-primary/10 bg-secondary px-5">
    <AccordionPrimitive.Trigger
      dir="rtl"
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-start gap-2 py-4 text-right font-medium text-accent transition-all [&[data-state=open]>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      <PlusIcon className="size-10 shrink-0 stroke-accent transition-transform duration-200" />
      {children}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    {" "}
    <div className="mt-5 flex items-start justify-start gap-5 rounded-lg bg-secondary/90 py-5 pr-5">
      <MinusIcon className="size-10 shrink-0 stroke-primary" />
      <p
        dir="rtl"
        className={cn("pl-5 pt-2.5 text-justify text-primary", className)}
      >
        {children}
      </p>
    </div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
