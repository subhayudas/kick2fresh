/* Meta Pixel. Events Manager -> Data Sources -> the pixel -> Settings gives the
   pixel ID used below. If it's unset (local dev, previews) nothing is loaded and
   nothing is sent. */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };
    _fbq?: unknown;
  }
}

/** Reports a confirmed booking to Meta as a "Schedule" event (Meta's standard
 *  event for booking an appointment), with the booking total as its value. */
export function trackBookingSchedule({
  value,
  currency = "CAD",
}: {
  value: number;
  currency?: string;
}) {
  if (!META_PIXEL_ID || typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", "Schedule", { value, currency });
}
