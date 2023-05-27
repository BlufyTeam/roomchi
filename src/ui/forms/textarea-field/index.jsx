import { useEffect, useRef } from "react";

export default function TextAreaField({
  children,
  extraClass = "",
  bg = "bg-gray-50",
  className = " placeholder:opacity-0 focus:placeholder:opacity-100 selection:text-white selection:bg-atysa-900 block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900  dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:border-atysa-main focus:outline-none focus:ring-0 focus:border-atysa-second peer",
  value = "",
  placeholder = " ",
  isRtl = true,
  rows = {},
  cols = {},
  onChange = (value) => {},
  focused = false,
  onFocus = () => {},
  onBlur = () => {},
  ...rest
}) {
  const direction = `${isRtl ? "text-right" : "text-left"}`;
  const ref = useRef(undefined);
  const placeholderRef = useRef(undefined);
  useEffect(() => {
    if (!focused) return;
    ref.current.focus();
    placeholderRef.current.style.opacity = 1;
  }, [focused]);
  return (
    <>
      <style jsx>
        {`
          @media (max-width: 1000px) {
            .placeholder {
              opacity: 0;
            }
          }
        `}
      </style>

      <textarea
        dir={isRtl ? "rtl" : "ltr"}
        rows={rows}
        cols={cols}
        ref={ref}
        type="text"
        className={`${direction} ${className} ${bg} ${extraClass}`}
        placeholder={" "}
        value={value}
        autoComplete="off"
        onFocus={() => {
          placeholderRef.current.style.opacity = 1;
          onFocus();
        }}
        onBlur={() => {
          placeholderRef.current.style.opacity = 0;
          onBlur();
        }}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />

      <label
        ref={placeholderRef}
        onClick={() => ref.current.focus()}
        className="placeholder absolute
       text-sm
    text-gray-500
    dark:text-gray-400
       duration-300
        transform
       -translate-y-4 
        scale-75
        top-9 
        origin-top-right 
        right-2.5
       peer-focus:text-blue-400
       peer-focus:dark:text-blue-200
        peer-placeholder-shown:scale-100  
         
        opacity-0
        mobileMax:peer-focus:opacity-100"
      >
        {placeholder}
      </label>
    </>
  );
}
