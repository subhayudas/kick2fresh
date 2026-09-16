"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { UI, type Locale, type UiDict } from "@/lib/i18n";

type Ctx = {
  locale: Locale;
  t: UiDict;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
};

const LocaleCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = "k2f-locale";

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "fr") setLocaleState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "fr" ? "fr-CA" : "en-CA";
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {}
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);
  const toggleLocale = useCallback(() => setLocaleState((l) => (l === "en" ? "fr" : "en")), []);

  const value = useMemo<Ctx>(
    () => ({ locale, t: UI[locale], setLocale, toggleLocale }),
    [locale, setLocale, toggleLocale],
  );

  return <LocaleCtx.Provider value={value}>{children}</LocaleCtx.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleCtx);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}
