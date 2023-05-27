import React from "react";
//import Circle  from "ui/icons/loadings/circle";
import ThreeDotsWave from "~/ui/loadings/three-dots-wave";
import { motion } from "framer-motion";

export default function Button({
  children,
  type = "button" || "reset" || "submit",
  disabled = false,
  isLoading = false,
  className = "",
  extraClass = "",
  onClick = () => {},
  ...rest
}) {
  const enabldedClass = `${className}   hover:bg-opacity-95 cursor-pointer`;
  const busyClass = `bg-gray-200 text-gray-500 cursor-not-allowed`;
  return (
    <motion.button
      whileTap={{
        scale: disabled || isLoading ? 1 : 0.95,
        transition: {
          duration: 0,
        },
      }}
      disabled={disabled}
      dir="rtl"
      type={type}
      onClick={onClick}
      className={`
       duration-400 relative flex select-none items-center justify-center rounded-lg p-2 transition-all
      ${extraClass}
      ${!disabled ? enabldedClass : busyClass}`}
      {...rest}
    >
      {children}
      <div
        dir="rtl"
        className="absolute top-7 flex  h-fit w-fit items-center justify-start"
      >
        {isLoading && <ThreeDotsWave />}
      </div>
    </motion.button>
  );
}
