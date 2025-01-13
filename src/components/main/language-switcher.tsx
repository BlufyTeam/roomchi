"use client";

import { Button } from "~/components/ui/button";
import { useLanguage } from "~/context/language.context";
import { cn } from "~/lib/utils";
import { iranSans, poppins } from "~/pages/_app";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "fa" ? "en" : "fa");
  };

  return (
    <Button
      onClick={toggleLanguage}
      className={cn(
        "bg-primary text-secondary",

        language === "fa"
          ? `font-poppins  ${poppins.variable}`
          : `font-iransans ${iranSans.variable}`
      )}
    >
      {language === "fa" ? "English" : "فارسی"}
    </Button>
  );
}
