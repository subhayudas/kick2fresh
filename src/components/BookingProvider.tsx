"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

const DEFAULT_TIER = "premium";

type Ctx = {
  /** The one booking flow every CTA on the site opens. */
  isOpen: boolean;
  tier: string | null;
  addOns: string[];
  pairs: number;
  pairTiers: string[];
  pairAddOns: string[][];
  /** `source` = which CTA was tapped (hero, sticky, nav...), for GA4. */
  openBooking: (opts?: { tier?: string; addOn?: string; source?: string }) => void;
  closeBooking: () => void;
  setTier: (id: string) => void;
  /** Add-ons apply to every pair - one choice, not one screen per pair. */
  toggleAddOn: (id: string) => void;
  setPairs: (n: number) => void;
};

const BookingCtx = createContext<Ctx | null>(null);

/** Pairs beyond 6 ("7+") are a custom quote, so they share a single slot. */
function groupSizeFor(pairs: number) {
  return pairs <= 6 ? pairs : 1;
}

function resize<T>(prev: T[], pairs: number, make: () => T) {
  const next = prev.slice(0, groupSizeFor(pairs));
  while (next.length < groupSizeFor(pairs)) next.push(make());
  return next;
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tier, setTierState] = useState<string | null>(DEFAULT_TIER);
  const [pairs, setPairsState] = useState(1);
  const [pairTiers, setPairTiers] = useState<string[]>([DEFAULT_TIER]);
  const [pairAddOns, setPairAddOns] = useState<string[][]>([[]]);

  const setTier = useCallback((id: string) => {
    setTierState(id);
    setPairTiers((prev) => prev.map(() => id));
  }, []);

  const setPairs = useCallback(
    (n: number) => {
      setPairsState(n);
      const fallback = tier ?? DEFAULT_TIER;
      setPairTiers((prev) => resize(prev, n, () => prev[0] ?? fallback));
      setPairAddOns((prev) => resize(prev, n, () => [...(prev[0] ?? [])]));
    },
    [tier],
  );

  const toggleAddOn = useCallback((id: string) => {
    setPairAddOns((prev) => {
      const on = (prev[0] ?? []).includes(id);
      return prev.map((arr) => (on ? arr.filter((a) => a !== id) : arr.includes(id) ? arr : [...arr, id]));
    });
  }, []);

  const openBooking = useCallback(
    (opts?: { tier?: string; addOn?: string; source?: string }) => {
      if (opts?.tier) setTier(opts.tier);
      if (opts?.addOn) {
        setPairAddOns((prev) => prev.map((arr) => (arr.includes(opts.addOn!) ? arr : [...arr, opts.addOn!])));
      }
      trackEvent("cta_click", { source: opts?.source ?? "unknown", tier: opts?.tier });
      setIsOpen(true);
      // A history entry means the phone's Back button closes the sheet instead of leaving the site.
      if (window.location.hash !== "#book") window.history.pushState({ k2fBook: true }, "", "#book");
    },
    [setTier],
  );

  const closeBooking = useCallback(() => {
    setIsOpen(false);
    if (window.location.hash === "#book") {
      if (window.history.state?.k2fBook) window.history.back();
      else window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  // Deep link: an ad can point straight at /#book (or /?book=1) and land with the flow open.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (window.location.hash === "#book" || params.get("book") === "1") setIsOpen(true);
    const onPop = () => setIsOpen(window.location.hash === "#book");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Anchor links to #book anywhere (footer, markdown-ish links) open the sheet too.
  useEffect(() => {
    const onHash = () => window.location.hash === "#book" && setIsOpen(true);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const addOns = pairAddOns[0] ?? [];

  const value = useMemo(
    () => ({
      isOpen, tier, addOns, pairs, pairTiers, pairAddOns,
      openBooking, closeBooking, setTier, toggleAddOn, setPairs,
    }),
    [isOpen, tier, addOns, pairs, pairTiers, pairAddOns, openBooking, closeBooking, setTier, toggleAddOn, setPairs],
  );

  return <BookingCtx.Provider value={value}>{children}</BookingCtx.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingCtx);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
