/* Meta Pixel. Events Manager -> Data Sources -> the pixel -> Settings gives the
   pixel ID used below. If it's unset (local dev, previews) nothing is loaded and
   nothing is sent.

   Funnel events (give Meta's optimiser volume, not just the rare final booking):
     ViewContent       booking sheet opened
     InitiateCheckout  service chosen, contact step reached
     Lead              name + phone + email submitted (also sent server-side)
     Contact           tapped call / text / WhatsApp
     Schedule          booking confirmed (also sent server-side) */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };
    _fbq?: unknown;
  }
}

/** `eventId` is shared with the matching server-side Conversions API event so
 *  Meta deduplicates the two into one conversion. */
export function trackMeta(
  event: string,
  params?: Record<string, unknown>,
  eventId?: string,
) {
  if (!META_PIXEL_ID || typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", event, params ?? {}, eventId ? { eventID: eventId } : undefined);
}

export function trackBookingSchedule({
  value,
  currency = "CAD",
  eventId,
}: {
  value: number;
  currency?: string;
  eventId?: string;
}) {
  trackMeta("Schedule", { value, currency }, eventId);
}
