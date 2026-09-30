/* GA4 site + form analytics. Analytics -> Admin -> Data Streams -> Web stream
   gives the Measurement ID ("G-XXXXXXX"). Shares the same gtag.js loader as
   Google Ads (see src/app/layout.tsx), just configured with a second id.
   If unset, no GA4 config is sent (Google Ads, if configured, still works). */
export const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

/** Sends a custom GA4 event. Used to mark booking-form steps and key
 *  interactions so drop-off can be read from a GA4 funnel exploration. */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!GA4_MEASUREMENT_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}
