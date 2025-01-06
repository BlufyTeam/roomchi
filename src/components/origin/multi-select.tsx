import { Label } from "~/components/shadcn/label";
import MultipleSelector, { Option } from "~/components/shadcn/multi-select";

interface SelectDemoProps {
  label?: string;
  options: Option[];
  value: Option[];
  placeholder?: string;
  hideClearAllButton?: boolean;
  hidePlaceholderWhenSelected?: boolean;
  emptyIndicator?: React.ReactNode;
  onChange: (selectedOptions: Option[]) => void;
}

export default function MultiSelector({
  label = "Multiselect",
  options,
  value,
  placeholder = "انتخاب گزینه",
  hideClearAllButton = false,
  hidePlaceholderWhenSelected = false,
  emptyIndicator = <p className="text-center text-sm">گزینه ای پیدا نشد</p>,
  onChange,
}: SelectDemoProps) {
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <MultipleSelector
        commandProps={{
          label: placeholder,
        }}
        value={value}
        defaultOptions={options}
        placeholder={placeholder}
        hideClearAllButton={hideClearAllButton}
        hidePlaceholderWhenSelected={hidePlaceholderWhenSelected}
        emptyIndicator={emptyIndicator}
        onChange={onChange} // Trigger onChange callback
      />
    </div>
  );
}
