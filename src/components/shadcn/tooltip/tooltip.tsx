import { Button } from "~/components/shadcn/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/shadcn/tooltip";

export function ShadcnTooltip({ children, content }) {
  return (
    <TooltipProvider delayDuration={0} disableHoverableContent>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="select-none bg-transparent text-primary backdrop-blur-md">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
