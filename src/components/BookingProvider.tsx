"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

const DEFAULT_TIER = "premium";

type Ctx = {
  tier: string | null;
  addOns: string[];
  pairs: number;
  pairTiers: string[];
  openBooking: (tier?: string, addOn?: string) => void;
  setTier: (id: string) => void;
  toggleAddOn: (id: string) => void;
  setPairs: (n: number) => void;
  setPairTier: (index: number, id: string) => void;
};

const BookingCtx = createContext<Ctx | null>(null);

/** Pairs beyond 6 ("7+") share a single tier selection since the exact count is unknown. */
function groupSizeFor(pairs: number) {
  return pairs <= 6 ? pairs : 1;
}

function resizePairTiers(prev: string[], pairs: number, fallback: string) {
  const size = groupSizeFor(pairs);
  const next = prev.slice(0, size);
  while (next.length < size) next.push(fallback);
  return next;
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [tier, setTierState] = useState<string | null>(DEFAULT_TIER);
  const [addOns, setAddOns] = useState<string[]>([]);
  const [pairs, setPairsState] = useState(1);
  const [pairTiers, setPairTiers] = useState<string[]>([DEFAULT_TIER]);

  const setTier = useCallback((id: string) => {
    setTierState(id);
    setPairTiers((prev) => prev.map(() => id));
  }, []);

  const setPairs = useCallback((n: number) => {
    setPairsState(n);
    setPairTiers((prev) => resizePairTiers(prev, n, tier ?? DEFAULT_TIER));
  }, [tier]);

  const setPairTier = useCallback((index: number, id: string) => {
    setPairTiers((prev) => {
      const next = [...prev];
      next[index] = id;
      return next;
    });
  }, []);

  const toggleAddOn = useCallback((id: string) => {
    setAddOns((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  }, []);

  const openBooking = useCallback((t?: string, addOn?: string) => {
    if (t) setTier(t);
    if (addOn) setAddOns((prev) => (prev.includes(addOn) ? prev : [...prev, addOn]));
    window.setTimeout(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // Target the form panel itself (not the section) so mobile lands straight on the form,
      // not on the trust copy that stacks above it once the grid collapses to one column.
      const target = document.getElementById("booking-panel") ?? document.getElementById("booking");
      target?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }, 0);
  }, [setTier]);

  const value = useMemo(
    () => ({ tier, addOns, pairs, pairTiers, openBooking, setTier, toggleAddOn, setPairs, setPairTier }),
    [tier, addOns, pairs, pairTiers, openBooking, setTier, toggleAddOn, setPairs, setPairTier],
  );

  return <BookingCtx.Provider value={value}>{children}</BookingCtx.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingCtx);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
