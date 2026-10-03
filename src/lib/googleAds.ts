/* Google Ads tracking. Values come from Google Ads -> Goals -> Conversions ->
   a conversion action -> Tag setup -> event snippet:
     gtag('event', 'conversion', { 'send_to': 'AW-123456789/AbC-dEfGhIjK' })
                                                 ^ ADS_ID     ^ label
   Two actions are supported:
     BOOKING_LABEL  confirmed booking (value = booking total)  - the "primary" goal
     LEAD_LABEL     contact details submitted - a "secondary" goal that gives
                    Smart Bidding far more volume than bookings alone
   If the ID is unset (local dev, previews) nothing is loaded and nothing is sent. */
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const BOOKING_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_BOOKING_LABEL;
const LEAD_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Enhanced conversions: gtag hashes these (SHA-256) before sending. Lets Google
 *  match the conversion to the click even when the gclid cookie is lost. */
function setUserData(user?: { email?: string; phone?: string }) {
  if (!user || !window.gtag) return;
  const digits = user.phone?.replace(/\D/g, "");
  window.gtag("set", "user_data", {
    ...(user.email && { email: user.email.trim().toLowerCase() }),
    ...(digits && { phone_number: digits.length === 10 ? `+1${digits}` : `+${digits}` }),
  });
}

function fire(label: string | undefined, params: Record<string, unknown>, user?: { email?: string; phone?: string }) {
  if (!GOOGLE_ADS_ID || !label || typeof window === "undefined" || !window.gtag) return;
  setUserData(user);
  window.gtag("event", "conversion", { send_to: `${GOOGLE_ADS_ID}/${label}`, ...params });
}

/** Confirmed booking. `transactionId` (the Square booking id) lets Google de-duplicate. */
export function trackBookingConversion({
  transactionId,
  value,
  currency = "CAD",
  user,
}: {
  transactionId: string;
  value: number;
  currency?: string;
  user?: { email?: string; phone?: string };
}) {
  fire(BOOKING_LABEL, { value, currency, transaction_id: transactionId }, user);
}

/** Contact details submitted (before a time is picked). */
export function trackLeadConversion({
  transactionId,
  value,
  currency = "CAD",
  user,
}: {
  transactionId: string;
  value?: number;
  currency?: string;
  user?: { email?: string; phone?: string };
}) {
  fire(LEAD_LABEL, { ...(value !== undefined && { value, currency }), transaction_id: transactionId }, user);
}
