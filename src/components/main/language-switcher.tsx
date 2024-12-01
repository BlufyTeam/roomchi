"use client";

import { Button } from "~/components/ui/button";
import { useLanguage } from "~/context/language.context";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "fa" ? "en" : "fa");
  };

  return (
    <Button onClick={toggleLanguage} variant="outline" size="sm">
      {language === "fa" ? "English" : "فارسی"}
    </Button>
  );
}
