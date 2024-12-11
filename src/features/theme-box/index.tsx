import React from "react";
import { useState } from "react";
import { ComboBox } from "~/features/shadui/ComboBox";
import { THEMESE } from "~/constants";
import useLocalStorage from "~/hooks/useLocalStorage";
import { useLanguage } from "~/context/language.context";
import { translations } from "~/utils/translations";

export default function ThemeBox() {
  const [value, setValue] = useLocalStorage("theme", () => {
    return localStorage.getItem("theme");
  });
  const { language } = useLanguage();
  const t = translations[language];
  return (
    <div className="scale-75">
      <ComboBox
        value={value}
        placeHolder={t.searchTheme}
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
