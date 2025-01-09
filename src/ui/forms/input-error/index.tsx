import { useLanguage } from "~/context/language.context";
import { translations } from "~/utils/translations";

export default function InputError({ message = "" }) {
  const { language } = useLanguage();
  const t = translations[language];
  return (
    <>
      <div
        className={`${
          message.length > 0 ? "scale-100" : "scale-0"
        } h-3 origin-right py-2 text-right text-sm text-red-500 transition-transform`}
      >
        {message}
      </div>
    </>
  );
}
