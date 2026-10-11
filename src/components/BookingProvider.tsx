"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

const DEFAULT_TIER = "premium";
/** 7+ is a custom quote; the stepper stops here (more goes in the notes). */
export const MAX_PAIRS = 15;

/** What one pair of shoes gets. Every pair is chosen independently. */
export type PairChoice = { tier: string; addOns: string[]; nickname: string };

const newPair = (tier = DEFAULT_TIER): PairChoice => ({ tier, addOns: [], nickname: "" });

type Ctx = {
  /** The one booking flow every CTA on the site opens. */
  isOpen: boolean;
  pairs: number;
  /** One entry per pair, always `pairs` long. */
  pairChoices: PairChoice[];
  /** `source` = which CTA was tapped (hero, sticky, nav...), for GA4. */
  openBooking: (opts?: { tier?: string; addOn?: string; source?: string }) => void;
  closeBooking: () => void;
  /** Grows with default pairs or trims from the end; existing pairs are untouched. */
  setPairs: (n: number) => void;
  setPairTier: (index: number, id: string) => void;
  togglePairAddOn: (index: number, id: string) => void;
  setPairNickname: (index: number, nickname: string) => void;
  /** Copies one pair's service + add-ons to every other pair (nicknames stay). */
  applyToAllPairs: (index: number) => void;
};

const BookingCtx = createContext<Ctx | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pairChoices, setPairChoices] = useState<PairChoice[]>([newPair()]);
  const pairs = pairChoices.length;

  const updatePair = useCallback((index: number, fn: (p: PairChoice) => PairChoice) => {
    setPairChoices((prev) => prev.map((p, i) => (i === index ? fn(p) : p)));
  }, []);

  const setPairs = useCallback((n: number) => {
    const count = Math.min(MAX_PAIRS, Math.max(1, Math.round(n)));
    setPairChoices((prev) => {
      const next = prev.slice(0, count);
      while (next.length < count) next.push(newPair());
      return next;
    });
  }, []);

  const setPairTier = useCallback(
    (index: number, id: string) => updatePair(index, (p) => ({ ...p, tier: id })),
    [updatePair],
  );

  const togglePairAddOn = useCallback(
    (index: number, id: string) =>
      updatePair(index, (p) => ({
        ...p,
        addOns: p.addOns.includes(id) ? p.addOns.filter((a) => a !== id) : [...p.addOns, id],
      })),
    [updatePair],
  );

  const setPairNickname = useCallback(
    (index: number, nickname: string) => updatePair(index, (p) => ({ ...p, nickname })),
    [updatePair],
  );

  const applyToAllPairs = useCallback((index: number) => {
    setPairChoices((prev) => {
      const src = prev[index];
      if (!src) return prev;
      return prev.map((p) => ({ ...p, tier: src.tier, addOns: [...src.addOns] }));
    });
  }, []);

  const openBooking = useCallback((opts?: { tier?: string; addOn?: string; source?: string }) => {
    // A CTA tied to a service or add-on (e.g. a pricing card) pre-selects it on every pair.
    if (opts?.tier || opts?.addOn) {
      setPairChoices((prev) =>
        prev.map((p) => ({
          ...p,
          tier: opts.tier ?? p.tier,
          addOns: opts.addOn && !p.addOns.includes(opts.addOn) ? [...p.addOns, opts.addOn] : p.addOns,
        })),
      );
    }
    trackEvent("cta_click", { source: opts?.source ?? "unknown", tier: opts?.tier });
    setIsOpen(true);
    // A history entry means the phone's Back button closes the sheet instead of leaving the site.
    if (window.location.hash !== "#book") window.history.pushState({ k2fBook: true }, "", "#book");
  }, []);

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

  const value = useMemo(
    () => ({
      isOpen, pairs, pairChoices,
      openBooking, closeBooking, setPairs, setPairTier, togglePairAddOn, setPairNickname, applyToAllPairs,
    }),
    [isOpen, pairs, pairChoices, openBooking, closeBooking, setPairs, setPairTier, togglePairAddOn, setPairNickname, applyToAllPairs],
  );

  return <BookingCtx.Provider value={value}>{children}</BookingCtx.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingCtx);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
