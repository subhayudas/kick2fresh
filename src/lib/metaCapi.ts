import { createHash } from "node:crypto";
import { META_PIXEL_ID } from "@/lib/metaPixel";

/* Meta Conversions API: sends the same conversions server-side, as a backstop
   for the browser pixel (ad blockers, Safari ITP and in-app browsers drop a
   chunk of browser-side events). Events Manager -> Data Sources -> the pixel ->
   Settings -> Conversions API -> Generate access token gives CAPI_ACCESS_TOKEN.
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

export type CapiEvent = {
  eventName: "Lead" | "Schedule" | "InitiateCheckout" | "Contact";
  /** Shared with the browser pixel event so Meta deduplicates the pair. */
  eventId: string;
  value?: number;
  currency?: string;
  email?: string;
  phone?: string;
  name?: string;
  /** Meta browser cookies - the strongest signal for matching to the ad click. */
  fbp?: string;
  fbc?: string;
  clientIp?: string;
  userAgent?: string;
  sourceUrl: string;
  /** From Events Manager -> Test events. Never pass from the real flow. */
  testEventCode?: string;
};

export async function sendMetaCapiEvent(e: CapiEvent) {
  if (!META_PIXEL_ID || !CAPI_ACCESS_TOKEN) return;

  const [first, ...rest] = (e.name ?? "").trim().toLowerCase().split(/\s+/).filter(Boolean);
  const payload = {
    data: [
      {
        event_name: e.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: e.eventId,
        event_source_url: e.sourceUrl,
        action_source: "website",
        user_data: {
          ...(e.email && { em: [sha256(e.email.trim().toLowerCase())] }),
          ...(e.phone && { ph: [sha256(normalizePhone(e.phone))] }),
          ...(first && { fn: [sha256(first)] }),
          ...(rest.length && { ln: [sha256(rest.join(" "))] }),
          country: [sha256("ca")],
          ...(e.fbp && { fbp: e.fbp }),
          ...(e.fbc && { fbc: e.fbc }),
          ...(e.clientIp && { client_ip_address: e.clientIp }),
          ...(e.userAgent && { client_user_agent: e.userAgent }),
        },
        ...(e.value !== undefined && {
          custom_data: { value: e.value, currency: e.currency ?? "CAD" },
        }),
      },
    ],
    ...(e.testEventCode && { test_event_code: e.testEventCode }),
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
    throw new Error(`Meta CAPI ${e.eventName} failed: ${res.status} ${await res.text()}`);
  }
}
