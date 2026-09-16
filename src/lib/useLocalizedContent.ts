"use client";

import { useMemo } from "react";
import { useLocale } from "@/components/LocaleProvider";
import {
  TIERS, ADDONS, BUNDLES, MATERIALS, PROCESS, TIMING, FAQ, STATS, GUARANTEE,
  GALLERY, REVIEWS_PLACEHOLDER, NAV, TURNAROUND, CITY, type Bi,
} from "@/lib/content";

function pick<T extends Bi>(bi: T, locale: "en" | "fr") {
  return bi[locale];
}

export function useLocalizedTiers() {
  const { locale } = useLocale();
  return useMemo(
    () =>
      TIERS.map((t) => ({
        ...t,
        name: pick(t.name, locale),
        tagline: pick(t.tagline, locale),
        bestFor: pick(t.bestFor, locale),
        blurb: pick(t.blurb, locale),
        idealFor: pick(t.idealFor, locale),
        includes: t.includes.map((i) => pick(i, locale)),
        imageAlt: pick(t.imageAlt, locale),
      })),
    [locale],
  );
}

export function useLocalizedAddons() {
  const { locale } = useLocale();
  return useMemo(
    () => ADDONS.map((a) => ({ ...a, name: pick(a.name, locale), note: pick(a.note, locale) })),
    [locale],
  );
}

export function useLocalizedBundles() {
  const { locale } = useLocale();
  return useMemo(
    () => BUNDLES.map((b) => ({ ...b, name: pick(b.name, locale), detail: pick(b.detail, locale) })),
    [locale],
  );
}

export function useLocalizedMaterials() {
  const { locale } = useLocale();
  return useMemo(
    () => MATERIALS.map((m) => ({ ...m, label: pick(m.label, locale), copy: pick(m.copy, locale), alt: m.alt ? pick(m.alt, locale) : undefined })),
    [locale],
  );
}

export function useLocalizedProcess() {
  const { locale } = useLocale();
  return useMemo(
    () => PROCESS.map((p) => ({ ...p, title: pick(p.title, locale), copy: pick(p.copy, locale) })),
    [locale],
  );
}

export function useLocalizedTiming() {
  const { locale } = useLocale();
  return useMemo(
    () => ({ standard: pick(TIMING.standard, locale), priority: pick(TIMING.priority, locale), pickup: pick(TIMING.pickup, locale) }),
    [locale],
  );
}

export function useLocalizedFaq() {
  const { locale } = useLocale();
  return useMemo(() => FAQ.map((f) => ({ q: pick(f.q, locale), a: pick(f.a, locale) })), [locale]);
}

export function useLocalizedStats() {
  const { locale } = useLocale();
  return useMemo(() => STATS.map((s) => ({ ...s, label: pick(s.label, locale) })), [locale]);
}

export function useLocalizedGuarantee() {
  const { locale } = useLocale();
  return useMemo(() => ({ headline: pick(GUARANTEE.headline, locale), subtitle: pick(GUARANTEE.subtitle, locale) }), [locale]);
}

export function useLocalizedGallery() {
  const { locale } = useLocale();
  return useMemo(() => GALLERY.map((g) => ({ ...g, alt: pick(g.alt, locale) })), [locale]);
}

export function useLocalizedReviews() {
  const { locale } = useLocale();
  return useMemo(
    () => REVIEWS_PLACEHOLDER.map((r) => ({ quote: pick(r.quote, locale), who: pick(r.who, locale), meta: pick(r.meta, locale) })),
    [locale],
  );
}

export function useLocalizedNav() {
  const { locale } = useLocale();
  return useMemo(() => NAV.map((n) => ({ ...n, label: pick(n.label, locale) })), [locale]);
}

export function useLocalizedStrings() {
  const { locale } = useLocale();
  return useMemo(() => ({ turnaround: pick(TURNAROUND, locale), city: pick(CITY, locale) }), [locale]);
}
