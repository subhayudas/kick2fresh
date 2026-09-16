"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type Ctx = {
  tier: string | null;
  addOns: string[];
  pairs: number;
  openBooking: (tier?: string, addOn?: string) => void;
  setTier: (id: string) => void;
  toggleAddOn: (id: string) => void;
  setPairs: (n: number) => void;
};

const BookingCtx = createContext<Ctx | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<string | null>("premium");
  const [addOns, setAddOns] = useState<string[]>([]);
  const [pairs, setPairs] = useState(1);

  const openBooking = useCallback((t?: string, addOn?: string) => {
    if (t) setTier(t);
    if (addOn) setAddOns((prev) => (prev.includes(addOn) ? prev : [...prev, addOn]));
    window.setTimeout(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById("booking")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }, 0);
  }, []);

  const toggleAddOn = useCallback((id: string) => {
    setAddOns((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  }, []);

  const value = useMemo(
    () => ({ tier, addOns, pairs, openBooking, setTier, toggleAddOn, setPairs }),
    [tier, addOns, pairs, openBooking, toggleAddOn],
  );

  return <BookingCtx.Provider value={value}>{children}</BookingCtx.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingCtx);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
