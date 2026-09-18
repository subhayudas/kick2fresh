/**
 * Server-only Square client. Uses fetch directly against Square's REST API —
 * no SDK dependency. Requires SQUARE_ACCESS_TOKEN / SQUARE_LOCATION_ID /
 * SQUARE_TEAM_MEMBER_ID / SQUARE_DROPOFF_SERVICE_VARIATION_ID (see .env.example
 * and scripts/setup-square-catalog.mjs).
 */
import { randomUUID } from "node:crypto";

const SQUARE_VERSION = process.env.SQUARE_API_VERSION || "2025-01-23";

function squareBaseUrl() {
  return process.env.SQUARE_ENVIRONMENT === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";
}

export function isSquareConfigured() {
  return Boolean(
    process.env.SQUARE_ACCESS_TOKEN &&
      process.env.SQUARE_LOCATION_ID &&
      process.env.SQUARE_TEAM_MEMBER_ID &&
      process.env.SQUARE_DROPOFF_SERVICE_VARIATION_ID,
  );
}

async function squareFetch(path: string, init: RequestInit = {}) {
  const res = await fetch(`${squareBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "Square-Version": SQUARE_VERSION,
      Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
      ...init.headers,
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = body?.errors?.[0]?.detail || res.statusText;
    throw new Error(`Square API error (${res.status}): ${message}`);
  }
  return body;
}

export type PairSelection = {
  pairNum: number;
  tierName: string;
  addonNames: string[];
  subtotal: number;
};

/** Finds an existing customer by email, or creates one. Returns the Square customer id. */
export async function findOrCreateCustomer(input: { name: string; email: string; phone: string }) {
  const [givenName, ...rest] = input.name.trim().split(/\s+/);
  const familyName = rest.join(" ") || undefined;

  const search = await squareFetch("/v2/customers/search", {
    method: "POST",
    body: JSON.stringify({ query: { filter: { email_address: { exact: input.email } } } }),
  });
  const existing = search.customers?.[0];
  if (existing) return existing.id as string;

  const created = await squareFetch("/v2/customers", {
    method: "POST",
    body: JSON.stringify({
      idempotency_key: randomUUID(),
      given_name: givenName,
      family_name: familyName,
      email_address: input.email,
      phone_number: input.phone,
    }),
  });
  return created.customer.id as string;
}

/** Returns Square's available appointment start times (UTC ISO) for the drop-off service within a range. */
export async function searchAvailability(startAtUtc: string, endAtUtc: string) {
  const body = await squareFetch("/v2/bookings/availability/search", {
    method: "POST",
    body: JSON.stringify({
      query: {
        filter: {
          start_at_range: { start_at: startAtUtc, end_at: endAtUtc },
          location_id: process.env.SQUARE_LOCATION_ID,
          segment_filters: [
            {
              service_variation_id: process.env.SQUARE_DROPOFF_SERVICE_VARIATION_ID,
              team_member_id_filter: { any: [process.env.SQUARE_TEAM_MEMBER_ID] },
            },
          ],
        },
      },
    }),
  });
  return (body.availabilities ?? []) as { start_at: string }[];
}

/** Re-checks that an exact start time is still free right before booking it — Square's
 *  CreateBooking does not reject overlapping bookings on its own, so the caller must. */
export async function isSlotStillAvailable(startAtUtc: string) {
  // Square rejects a start_at_range shorter than 1 hour, so the window must be
  // at least that even though we only care about the single exact timestamp.
  const windowEnd = new Date(new Date(startAtUtc).getTime() + 65 * 60_000).toISOString();
  const availabilities = await searchAvailability(startAtUtc, windowEnd);
  const targetMs = new Date(startAtUtc).getTime();
  // Compare parsed instants, not raw strings — Square omits milliseconds
  // (e.g. "...T14:00:00Z") while ours always includes them ("...000Z").
  return availabilities.some((a) => new Date(a.start_at).getTime() === targetMs);
}

async function getServiceVariationDetails(): Promise<{ version: number; durationMinutes: number }> {
  const body = await squareFetch(`/v2/catalog/object/${process.env.SQUARE_DROPOFF_SERVICE_VARIATION_ID}`);
  const variation = body.object.item_variation_data;
  return {
    version: body.object.version as number,
    durationMinutes: Math.round((variation.service_duration as number) / 60_000),
  };
}

/** Creates the calendar appointment for the drop-off slot, tied to the Square team member's calendar. */
export async function createBooking(input: {
  customerId: string;
  startAtUtc: string;
  sellerNote: string;
  customerNote?: string;
  idempotencyKey: string;
}) {
  const { version, durationMinutes } = await getServiceVariationDetails();

  const body = await squareFetch("/v2/bookings", {
    method: "POST",
    body: JSON.stringify({
      idempotency_key: input.idempotencyKey,
      booking: {
        location_id: process.env.SQUARE_LOCATION_ID,
        start_at: input.startAtUtc,
        customer_id: input.customerId,
        seller_note: input.sellerNote,
        customer_note: input.customerNote || undefined,
        appointment_segments: [
          {
            team_member_id: process.env.SQUARE_TEAM_MEMBER_ID,
            service_variation_id: process.env.SQUARE_DROPOFF_SERVICE_VARIATION_ID,
            service_variation_version: version,
            duration_minutes: durationMinutes,
          },
        ],
      },
    }),
  });
  return body.booking as { id: string };
}

/** Creates a real priced Order (one line item per pair) linked to the booking via reference_id. */
export async function createDropoffOrder(input: {
  customerId: string;
  pairs: PairSelection[];
  bookingId: string;
  idempotencyKey: string;
}) {
  const lineItems = input.pairs.map((p) => ({
    name: `Pair ${p.pairNum} — ${p.tierName}${p.addonNames.length ? ` + ${p.addonNames.join(", ")}` : ""}`,
    quantity: "1",
    base_price_money: { amount: Math.round(p.subtotal * 100), currency: "CAD" },
  }));

  const body = await squareFetch("/v2/orders", {
    method: "POST",
    body: JSON.stringify({
      idempotency_key: input.idempotencyKey,
      order: {
        location_id: process.env.SQUARE_LOCATION_ID,
        customer_id: input.customerId,
        reference_id: input.bookingId,
        line_items: lineItems,
      },
    }),
  });
  return body.order as { id: string };
}
