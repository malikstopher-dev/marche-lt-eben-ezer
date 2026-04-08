"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Language = "fr" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    "header.departments": "Départements",
    "nav.home": "Accueil",
    "nav.shop": "Boutique",
    "nav.promotions": "Promotions",
    "nav.about": "À Propos",
    "nav.contact": "Contact",
  },
  en: {
    "header.departments": "Departments",
    "nav.home": "Home",
    "nav.shop": "Shop",
    "nav.promotions": "Promotions",
    "nav.about": "About",
    "nav.contact": "Contact",
  },
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("fr");

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
