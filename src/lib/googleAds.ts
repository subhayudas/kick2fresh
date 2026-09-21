/* Google Ads tracking. Both values come from Google Ads -> Goals -> Conversions ->
   the "New Booking" conversion action -> Tag setup -> "Use Google Tag" / event snippet:
     gtag('event', 'conversion', { 'send_to': 'AW-123456789/AbC-dEfGhIjK' })
                                                 ^ ADS_ID     ^ BOOKING_LABEL
   If the ID is unset (local dev, previews) nothing is loaded and nothing is sent. */
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const BOOKING_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_BOOKING_LABEL;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Reports a confirmed booking to Google Ads. `transactionId` (the Square booking id)
 *  lets Google de-duplicate if the same confirmation is ever reported twice. */
export function trackBookingConversion({
  transactionId,
  value,
  currency = "CAD",
}: {
  transactionId: string;
  value: number;
  currency?: string;
}) {
  if (!GOOGLE_ADS_ID || !BOOKING_LABEL || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${BOOKING_LABEL}`,
    value,
    currency,
    transaction_id: transactionId,
  });
}
