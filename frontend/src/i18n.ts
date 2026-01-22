import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  ar: {
    translation: {
      hero_title: "حلول برمجية متقدمة بخبرة محلية وعالمية",
      cta_contact: "احجز مكالمة",
      cta_portfolio: "شاهد الأعمال",
    },
  },
  en: {
    translation: {
      hero_title: "Advanced software solutions with local insight and global execution",
      cta_contact: "Book a call",
      cta_portfolio: "View portfolio",
    },
  },
};

const applyDocumentLocale = (lng: string) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.lang = lng;
  root.dir = lng === "ar" ? "rtl" : "ltr";
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ar",
  fallbackLng: "ar",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", applyDocumentLocale);
applyDocumentLocale("ar");

export default i18n;
