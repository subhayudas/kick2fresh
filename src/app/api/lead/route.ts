import { NextRequest, NextResponse } from "next/server";
import { findOrCreateCustomer, isSquareConfigured } from "@/lib/square";
import { sendMetaCapiEvent } from "@/lib/metaCapi";
import { notifyOwner } from "@/lib/sms";

/* Captures a lead the moment contact details are submitted - before the visitor
   has picked a time - so an abandoned booking is still a follow-up-able lead and
   the ad platforms get a conversion signal. Also the destination for 7+ pair
   quote requests. Delivery, in order of availability:
     1. Square customer (with the request in the customer note)
     2. LEAD_WEBHOOK_URL (Zapier / Make / Slack / n8n) - JSON POST of the lead
     3. Server log (always) - so a lead is never silently dropped
   Meta's server-side `Lead` event shares `eventId` with the browser pixel. */

type LeadRequest = {
  kind: "booking" | "quote";
  name: string;
  email: string;
  phone: string;
  notes?: string;
  summary?: string;
  total?: number;
  pairs?: number;
  eventId: string;
  attribution?: Record<string, string | undefined>;
};

const clip = (v: unknown, n = 300) => (typeof v === "string" ? v.trim().slice(0, n) : "");

export async function POST(req: NextRequest) {
  const raw = (await req.json().catch(() => null)) as Partial<LeadRequest> | null;
  const name = clip(raw?.name, 120);
  const email = clip(raw?.email, 200);
  const phone = clip(raw?.phone, 40);
  const eventId = clip(raw?.eventId, 80);
  if (!name || !email || !phone || phone.replace(/\D/g, "").length < 10 || !eventId) {
    return NextResponse.json({ ok: false, error: "Missing or invalid details." }, { status: 400 });
  }

  const kind = raw?.kind === "quote" ? "quote" : "booking";
  const attribution = raw?.attribution ?? {};
  const lead = {
    kind,
    name,
    email,
    phone,
    notes: clip(raw?.notes, 1000),
    summary: clip(raw?.summary, 600),
    total: typeof raw?.total === "number" ? raw.total : undefined,
    pairs: typeof raw?.pairs === "number" ? raw.pairs : undefined,
    attribution,
    receivedAt: new Date().toISOString(),
  };
  console.log("[lead]", JSON.stringify(lead));

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-nf-client-connection-ip") ??
    undefined;

  const jobs: Promise<unknown>[] = [
    sendMetaCapiEvent({
      eventName: "Lead",
      eventId,
      value: lead.total,
      email,
      phone,
      name,
      fbp: attribution.fbp,
      fbc: attribution.fbc,
      clientIp: ip,
      userAgent: req.headers.get("user-agent") ?? undefined,
      sourceUrl: req.headers.get("referer") ?? req.nextUrl.origin,
    }),
  ];

  if (isSquareConfigured()) {
    const note = [
      kind === "quote" ? "QUOTE REQUEST (7+ pairs)" : "Website lead (booking in progress)",
      lead.summary,
      lead.notes && `Notes: ${lead.notes}`,
    ]
      .filter(Boolean)
      .join(" | ");
    jobs.push(findOrCreateCustomer({ name, email, phone, note }));
  }

  // Quote requests only: ordinary booking leads fire before a time is picked and
  // would text the shop for every abandoned form.
  if (kind === "quote") {
    jobs.push(
      notifyOwner(
        [`New quote request: ${name}`, lead.summary, lead.notes && `Notes: ${lead.notes}`, phone]
          .filter(Boolean)
          .join("\n"),
      ),
    );
  }

  if (process.env.LEAD_WEBHOOK_URL) {
    jobs.push(
      fetch(process.env.LEAD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      }).then((r) => {
        if (!r.ok) throw new Error(`webhook ${r.status}`);
      }),
    );
  }

  const results = await Promise.allSettled(jobs);
  results.forEach((r) => r.status === "rejected" && console.error("[lead] side effect failed", r.reason));

  // The lead is already in the server log, so never fail the visitor's flow on a downstream hiccup.
  return NextResponse.json({ ok: true });
}
