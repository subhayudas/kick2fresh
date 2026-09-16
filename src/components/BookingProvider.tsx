"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

const DEFAULT_TIER = "premium";

type Ctx = {
  tier: string | null;
  addOns: string[];
  pairs: number;
  pairTiers: string[];
  pairAddOns: string[][];
  openBooking: (tier?: string, addOn?: string) => void;
  setTier: (id: string) => void;
  toggleAddOn: (id: string) => void;
  togglePairAddOn: (index: number, id: string) => void;
  setPairs: (n: number) => void;
  setPairTier: (index: number, id: string) => void;
};

const BookingCtx = createContext<Ctx | null>(null);

/** Pairs beyond 6 ("7+") share a single tier/add-ons slot since the exact count is unknown. */
function groupSizeFor(pairs: number) {
  return pairs <= 6 ? pairs : 1;
}

function resizePairTiers(prev: string[], pairs: number, fallback: string) {
  const size = groupSizeFor(pairs);
  const next = prev.slice(0, size);
  while (next.length < size) next.push(fallback);
  return next;
}

function resizePairAddOns(prev: string[][], pairs: number) {
  const size = groupSizeFor(pairs);
  const next = prev.slice(0, size);
  while (next.length < size) next.push([]);
  return next;
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [tier, setTierState] = useState<string | null>(DEFAULT_TIER);
  const [pairs, setPairsState] = useState(1);
  const [pairTiers, setPairTiers] = useState<string[]>([DEFAULT_TIER]);
  const [pairAddOns, setPairAddOns] = useState<string[][]>([[]]);

  const setTier = useCallback((id: string) => {
    setTierState(id);
    setPairTiers((prev) => prev.map(() => id));
  }, []);

  const setPairs = useCallback((n: number) => {
    setPairsState(n);
    setPairTiers((prev) => resizePairTiers(prev, n, tier ?? DEFAULT_TIER));
    setPairAddOns((prev) => resizePairAddOns(prev, n));
  }, [tier]);

  const setPairTier = useCallback((index: number, id: string) => {
    setPairTiers((prev) => {
      const next = [...prev];
      next[index] = id;
      return next;
    });
  }, []);

  const togglePairAddOn = useCallback((index: number, id: string) => {
    setPairAddOns((prev) => {
      const next = prev.map((arr) => arr.slice());
      if (!next[index]) next[index] = [];
      next[index] = next[index].includes(id)
        ? next[index].filter((a) => a !== id)
        : [...next[index], id];
      return next;
    });
  }, []);

  // ServiceSelection previews a single pair's choice before the booking form
  // exists, so it reads/writes pair 0's add-ons directly.
  const addOns = pairAddOns[0] ?? [];
  const toggleAddOn = useCallback((id: string) => togglePairAddOn(0, id), [togglePairAddOn]);

  const openBooking = useCallback((t?: string, addOn?: string) => {
    if (t) setTier(t);
    if (addOn) {
      setPairAddOns((prev) => {
        const next = prev.map((arr) => arr.slice());
        if (!next[0]) next[0] = [];
        if (!next[0].includes(addOn)) next[0].push(addOn);
        return next;
      });
    }
    window.setTimeout(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // Target the form panel itself (not the section) so mobile lands straight on the form,
      // not on the trust copy that stacks above it once the grid collapses to one column.
      const target = document.getElementById("booking-panel") ?? document.getElementById("booking");
      if (!target) {
        window.location.href = "/#booking";
        return;
      }
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }, 0);
  }, [setTier]);

  const value = useMemo(
    () => ({
      tier, addOns, pairs, pairTiers, pairAddOns,
      openBooking, setTier, toggleAddOn, togglePairAddOn, setPairs, setPairTier,
    }),
    [tier, addOns, pairs, pairTiers, pairAddOns, openBooking, setTier, toggleAddOn, togglePairAddOn, setPairs, setPairTier],
  );

  return <BookingCtx.Provider value={value}>{children}</BookingCtx.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingCtx);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
