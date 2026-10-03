/* Owner SMS alerts via Twilio's REST API (no SDK, same style as the other
   integrations). Used to text the shop the moment a booking or quote request
   comes in. If any of the three Twilio values or the recipient is unset (local
   dev, previews) nothing is sent. */
const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const FROM = process.env.TWILIO_FROM_NUMBER;
const TIMEOUT_MS = 8000;

/** OWNER_NOTIFY_PHONE may hold several numbers separated by commas. */
function recipients() {
  return (process.env.OWNER_NOTIFY_PHONE ?? "")
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean)
    .map((n) => {
      const digits = n.replace(/\D/g, "");
      return digits.length === 10 ? `+1${digits}` : `+${digits}`;
    });
}

export const isSmsConfigured = () => Boolean(ACCOUNT_SID && AUTH_TOKEN && FROM && recipients().length);

/** Texts every owner number. Never throws: a failed text must not fail a real
 *  booking, so errors are logged and swallowed. Awaited by callers (with its own
 *  timeout) because serverless hosts can freeze the function once the response
 *  is sent, which would drop a fire-and-forget request. */
export async function notifyOwner(message: string) {
  if (!isSmsConfigured()) return;

  const auth = Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString("base64");
  const results = await Promise.allSettled(
    recipients().map(async (to) => {
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`, {
        method: "POST",
        headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ To: to, From: FROM!, Body: message }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`Twilio ${res.status} ${await res.text()}`);
    }),
  );
  results.forEach((r) => r.status === "rejected" && console.error("Owner SMS failed", r.reason));
}
