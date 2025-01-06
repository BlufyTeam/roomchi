import React, { useEffect, useState } from "react";
import { ComboBox } from "~/features/shadui/ComboBox";
import { THEMESE } from "~/constants";
import useLocalStorage from "~/hooks/useLocalStorage";
import { useLanguage } from "~/context/language.context";
import { translations } from "~/utils/translations";

export default function ThemeBox() {
  const [value, setValue] = useState(null); // Initialize as null
  const { language } = useLanguage();
  const t = translations[language];

  // Ensure localStorage is accessed on the client
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || THEMESE[0]; // Fallback to the first theme
    setValue(storedTheme);
    document.querySelector("body").className = storedTheme as string;
  }, []);

  const handleChange = (value) => {
    localStorage.setItem("theme", value);
    document.querySelector("body").className = value;
    setValue(value);
  };

  return (
    <div className="scale-75">
      {value && ( // Only render ComboBox after value is set
        <ComboBox
          value={value}
          placeHolder={t.searchTheme}
          values={THEMESE}
          onChange={handleChange}
        />
      )}
    </div>
  );
}
