import React from "react";
import { useState } from "react";
import { ComboBox } from "~/features/shadui/ComboBox";
import { THEMESE } from "~/constants";
import useLocalStorage from "~/hooks/useLocalStorage";

export default function ThemeBox() {
  const [value, setValue] = useLocalStorage("theme", () => {
    return localStorage.getItem("theme");
  });

  return (
    <div className="scale-75">
      <ComboBox
        value={value}
        placeHolder="جستجو تم"
        values={THEMESE}
        onChange={(value) => {
          localStorage.setItem("theme", value);
          document.querySelector("body").className = value;
          setValue(value);
        }}
      />
    </div>
  );
}
