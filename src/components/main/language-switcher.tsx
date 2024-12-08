"use client";

import { Button } from "~/components/ui/button";
import { useLanguage } from "~/context/language.context";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "fa" ? "en" : "fa");
  };

  return (
    <Button onClick={toggleLanguage} className="bg-primary text-secondary">
      {language === "fa" ? "English" : "فارسی"}
    </Button>
  );
}
