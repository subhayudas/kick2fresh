"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type Ctx = {
  open: boolean;
  tier: string | null;
  addOns: string[];
  openBooking: (tier?: string, addOn?: string) => void;
  closeBooking: () => void;
  setTier: (id: string) => void;
  toggleAddOn: (id: string) => void;
};

const BookingCtx = createContext<Ctx | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [tier, setTier] = useState<string | null>("premium");
  const [addOns, setAddOns] = useState<string[]>([]);

  const openBooking = useCallback((t?: string, addOn?: string) => {
    if (t) setTier(t);
    if (addOn) setAddOns((prev) => (prev.includes(addOn) ? prev : [...prev, addOn]));
    setOpen(true);
  }, []);

  const closeBooking = useCallback(() => setOpen(false), []);

  const toggleAddOn = useCallback((id: string) => {
    setAddOns((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  }, []);

  const value = useMemo(
    () => ({ open, tier, addOns, openBooking, closeBooking, setTier, toggleAddOn }),
    [open, tier, addOns, openBooking, closeBooking, toggleAddOn],
  );

  return <BookingCtx.Provider value={value}>{children}</BookingCtx.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingCtx);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
