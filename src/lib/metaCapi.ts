import { createHash } from "node:crypto";
import { META_PIXEL_ID } from "@/lib/metaPixel";

/* Meta Conversions API: sends the same "Schedule" conversion server-side, as a
   backstop for the browser pixel (ad blockers, Safari ITP, etc. drop a chunk of
   browser-side events). Events Manager -> Data Sources -> the pixel -> Settings
   -> Conversions API -> Generate access token gives CAPI_ACCESS_TOKEN.
   If either value is unset (local dev, previews) nothing is sent. */
const CAPI_ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const GRAPH_VERSION = "v21.0";

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

/** Digits only, with the Canada/US country code prefixed when the number was
 *  entered without one - matches how Meta expects `ph` to be hashed. */
function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `1${digits}` : digits;
}

/** Reports a confirmed booking to Meta via server-side Conversions API. Shares
 *  `eventId` with the browser pixel's `Schedule` event so Meta deduplicates the
 *  two into one conversion. `testEventCode` (from Events Manager -> Test events)
 *  routes the call there instead of into real ad-optimization data - pass it only
 *  when manually verifying the integration, never from the real booking flow. */
export async function sendBookingScheduleCapiEvent({
  eventId,
  value,
  currency = "CAD",
  email,
  phone,
  clientIp,
  userAgent,
  sourceUrl,
  testEventCode,
}: {
  eventId: string;
  value: number;
  currency?: string;
  email: string;
  phone: string;
  clientIp?: string;
  userAgent?: string;
  sourceUrl: string;
  testEventCode?: string;
}) {
  if (!META_PIXEL_ID || !CAPI_ACCESS_TOKEN) return;

  const payload = {
    data: [
      {
        event_name: "Schedule",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: sourceUrl,
        action_source: "website",
        user_data: {
          em: [sha256(email.trim().toLowerCase())],
          ph: [sha256(normalizePhone(phone))],
          ...(clientIp && { client_ip_address: clientIp }),
          ...(userAgent && { client_user_agent: userAgent }),
        },
        custom_data: { value, currency },
      },
    ],
    ...(testEventCode && { test_event_code: testEventCode }),
  };

  const res = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${META_PIXEL_ID}/events?access_token=${CAPI_ACCESS_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    throw new Error(`Meta CAPI event failed: ${res.status} ${await res.text()}`);
  }
}
