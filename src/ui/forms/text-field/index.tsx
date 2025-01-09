"use client";
import {
  useEffect,
  useRef,
  forwardRef,
  ChangeEvent,
  ComponentPropsWithoutRef,
  Ref,
  ComponentProps,
} from "react";
import { twMerge } from "tailwind-merge";
import { cn } from "~/lib/utils";

type TextFieldProps = {
  children?: JSX.Element | string;
  className?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  isRtl?: boolean;
  min?: number;
  max?: number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string) => void;
  focused?: boolean;
  onFocus?: () => void;
} & ComponentProps<"input">;

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(({ children = <>

    </> || "", className = ``, value, defaultValue, placeholder = " ", isRtl = true, min = 0, max = 1000, onChange = () => {}, onValueChange = () => {}, focused = false, onFocus = () => {}, ...rest }, ref: Ref<HTMLInputElement>) => {
  function parse(value: string) {
    return value.slice(min, max);
  }

  const direction = `${isRtl ? "text-right" : "text-left"}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const placeholderRef = useRef<HTMLLabelElement>(null);

  useEffect(() => {
    if (!focused || !inputRef.current || !placeholderRef.current) return;

    inputRef.current.focus();
    // placeholderRef.current.style.opacity = "1";
  }, [focused]);

  useEffect(() => {
    if (typeof ref === "function") {
      ref(inputRef.current);
    } else if (ref) {
      (ref as any).current = inputRef.current;
    }
  }, [ref]);

  return (
    <>
      {/* <style jsx>
        {`
          @media (max-width: 1000px) {
            .placeholder {
              opacity: 0;
            }
          }
        `}
      </style> */}
      {children}{" "}
      <input
        dir={isRtl ? "rtl" : "ltr"}
        ref={inputRef}
        type="text"
        className={cn(
          direction,
          `selection:text-secondry peer block w-full appearance-none rounded-t-lg border-b-2 border-primary bg-transparent px-2.5 pb-2.5 pt-5 text-sm font-bold text-primary focus:border-accent focus:outline-none focus:ring-0 focus:placeholder:opacity-100`,
          className
        )}
        //  defaultValue={defaultValue}
        placeholder={placeholder ? placeholder : " "}
        value={value}
        autoComplete="off"
        onFocus={() => {
          if (placeholderRef.current)
            placeholderRef.current.style.opacity = "1";
          onFocus();
        }}
        onChange={(e) => {
          onValueChange(e.target.value);
          onChange(e);
        }}
        {...rest}
      />
      {/* <label
        ref={placeholderRef}
        onClick={() => {
          if (inputRef.current) inputRef.current.focus();
        }}
        className="placeholder absolute right-2.5 top-9 origin-top-right -translate-y-4 scale-75 transform text-sm text-secondary opacity-0 duration-300 peer-placeholder-shown:scale-100 peer-focus:text-primary mobileMax:peer-focus:opacity-100"
      >
        {placeholder}
      </label> */}
    </>
  );
});

export default TextField;

TextField.displayName = "TextField";
