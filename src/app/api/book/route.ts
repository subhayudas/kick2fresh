import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  createBooking,
  createDropoffOrder,
  findOrCreateCustomer,
  isSlotStillAvailable,
  isSquareConfigured,
  type PairSelection,
} from "@/lib/square";
import { BUSINESS_TIMEZONE, zonedHourToUtcIso } from "@/lib/quebecTime";

const OPEN_HOUR = Number(process.env.BUSINESS_OPEN_HOUR ?? 9);
const CLOSE_HOUR = Number(process.env.BUSINESS_CLOSE_HOUR ?? 18);

type BookRequest = {
  name: string;
  email: string;
  phone: string;
  notes?: string;
  date: string; // YYYY-MM-DD, Quebec local
  time: string; // "HH:00", Quebec local
  pairs: PairSelection[];
  total: number;
};

function isValid(body: Partial<BookRequest>): body is BookRequest {
  if (!body.name?.trim() || !body.email?.trim() || !body.phone?.trim()) return false;
  if (!body.date || !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) return false;
  if (!body.time || !/^\d{2}:00$/.test(body.time)) return false;
  if (!Array.isArray(body.pairs) || body.pairs.length === 0) return false;
  return true;
}

/** Deterministic key so a retried request (network blip, timeout) reuses the same
 *  Square booking/order instead of creating a duplicate for the same slot+customer. */
function idempotencyKey(seed: string) {
  return createHash("sha256").update(seed).digest("hex").slice(0, 32);
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Partial<BookRequest> | null;
  if (!body || !isValid(body)) {
    return NextResponse.json({ ok: false, error: "Missing or invalid booking details." }, { status: 400 });
  }

  const hour = Number(body.time.slice(0, 2));
  if (hour < OPEN_HOUR || hour >= CLOSE_HOUR) {
    return NextResponse.json({ ok: false, error: "That time is outside business hours." }, { status: 400 });
  }

  if (!isSquareConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Online booking isn't connected yet. Please call or text us to confirm your drop-off." },
      { status: 503 },
    );
  }

  try {
    const startAtUtc = zonedHourToUtcIso(body.date, hour, BUSINESS_TIMEZONE);

    // Square's CreateBooking does not reject overlapping appointments on its own -
    // re-check right before writing, closing the window between page load and submit.
    const stillAvailable = await isSlotStillAvailable(startAtUtc);
    if (!stillAvailable) {
      return NextResponse.json(
        { ok: false, code: "SLOT_TAKEN", error: "That time was just booked by someone else. Please pick another." },
        { status: 409 },
      );
    }

    const noteLines = body.pairs.map(
      (p) =>
        `Pair ${p.pairNum}: ${p.tierName}${p.addonNames.length ? ` + ${p.addonNames.join(", ")}` : ""}, $${p.subtotal} CAD`,
    );
    const sellerNote = [...noteLines, `Total: $${body.total} CAD`].join("\n");
    const customerNote = body.notes?.trim() || undefined;

    const seed = `${body.date}|${body.time}|${body.email.trim().toLowerCase()}`;
    const customerId = await findOrCreateCustomer({ name: body.name, email: body.email, phone: body.phone });
    const booking = await createBooking({
      customerId,
      startAtUtc,
      sellerNote,
      customerNote,
      idempotencyKey: idempotencyKey(`booking|${seed}`),
    });
    const order = await createDropoffOrder({
      customerId,
      pairs: body.pairs,
      bookingId: booking.id,
      idempotencyKey: idempotencyKey(`order|${seed}`),
    });

    return NextResponse.json({ ok: true, bookingId: booking.id, orderId: order.id });
  } catch (err) {
    console.error("Square booking failed", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: `Booking failed: ${message}` }, { status: 502 });
  }
}
