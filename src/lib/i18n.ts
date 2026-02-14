import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "@/locales/en.json";
import th from "@/locales/th.json";

export type Lang = "th" | "en";

export const SUPPORTED_LANGS: Lang[] = ["th", "en"];

export const DEFAULT_LANG: Lang = "th";

const STORAGE_KEY = "app_lang";

const resources = {
  en: { translation: en },
  th: { translation: th },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANG,
    supportedLngs: SUPPORTED_LANGS,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: STORAGE_KEY,
      caches: ["localStorage"],
    },
    react: {
      useSuspense: false,
    },
  });

export const getLang = (): Lang => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "en" ? "en" : "th";
};

export const setLang = (lang: Lang) => {
  localStorage.setItem(STORAGE_KEY, lang);
  i18n.changeLanguage(lang);
};

export default i18n;
