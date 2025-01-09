"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { translations } from "~/utils/translations";

type Language = "fa" | "en";

interface LanguageContextType {
  t: (typeof translations)["en" | "fa"];
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("fa"); // Start with a default language
  const t: (typeof translations)["en" | "fa"] = translations[language];
  useEffect(() => {
    // Only run on the client side
    const storedLanguage = localStorage.getItem("language") as Language;
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider
      value={{ t, language, setLanguage: changeLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
