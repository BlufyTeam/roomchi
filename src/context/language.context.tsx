import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { iranSans, poppins } from "~/pages/_app"; // Import font variables
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
  const [language, setLanguage] = useState<Language>("fa");
  const t: (typeof translations)["en" | "fa"] = translations[language];
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as Language;
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    // Update the <html> class dynamically
    const fontClass =
      language === "fa"
        ? `font-iransans ${iranSans.variable}`
        : `font-poppins ${poppins.variable}`;
    // document.documentElement.setAttribute(
    //   "dir",
    //   language === "fa" ? "rtl" : "ltr"
    // );
    document.documentElement.className = `h-full ${fontClass}`;
  }, [language]);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        t: t, // Add your translations logic
        language,
        setLanguage: changeLanguage,
      }}
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
