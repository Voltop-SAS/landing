"use client";

import { createContext, useContext, useState, useCallback } from "react";

export type Lang = "es" | "en";
/** Todo texto se modela como par bilingüe {es, en} desde el inicio. */
export type Localized = { es: string; en?: string };

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (value: Localized) => string;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Se diseña/escribe primero en ES; EN soportado por arquitectura.
  const [lang, setLangState] = useState<Lang>("es");

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof document !== "undefined") document.documentElement.lang = l;
  }, []);

  const t = useCallback(
    (value: Localized) => (lang === "en" ? value.en ?? value.es : value.es),
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
