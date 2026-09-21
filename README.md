# Kicks2Fresh

Premium sneaker cleaning and restoration, Montreal, Quebec.

Next.js 15 (App Router) · React 19 · TypeScript · CSS Modules. No UI framework;
the design system lives in [`src/app/globals.css`](src/app/globals.css).

```bash
npm install
npm run dev      # http://localhost:4321
npm run build
```

## Structure

```
src/
  app/
    globals.css        design tokens, buttons, surfaces, reveal, reset
    layout.tsx         metadata, fonts, LocalBusiness JSON-LD
    page.tsx           section order
    icon.svg           favicon
  lib/content.ts       ← ALL business content: prices, tiers, add-ons, bundles
  components/          one .tsx + one .module.css per section
public/media/          generated photography + video loops (webp / mp4)
```

**Change prices and services in `src/lib/content.ts` only.** The services
accordion, the pricing table, the booking flow and the footer all read from it,
so a single edit propagates everywhere.

## Design system

Warm ivory canvas (`--ivory`), charcoal ink, one restrained amber accent.
Surfaces are modern-skeuomorphic: every raised element pairs a contact shadow,
an ambient shadow and an inner top highlight (`--lift-1` … `--lift-4`); inputs
are recessed with `--press-in`; buttons translate on `:active`.

Layout is deliberately asymmetric, image plates break the shell, cards overlap
their containers, the featured pricing tier is offset upward. When adapting a
section for small screens, simplify it rather than flattening it into a stack.

Motion is gated on `prefers-reduced-motion`; all reveals, carousels, marquees
and video loops stop when it's set.

## Media

Photography and the three video loops were generated as one campaign (warm
ivory / charcoal / amber, controlled studio and window light) and optimised to
webp / h264 with poster frames. Videos are `preload="none"` and only load when
their section intersects the viewport, are skipped on mobile, and never play
under reduced motion.

Sources are ~1300–2300px wide, so `next.config.ts` caps `deviceSizes` at 2304
to stop the optimiser upscaling.

---

## ⚠️ Placeholders that need real data before launch

These are deliberately visible as placeholders rather than dressed up as real.
Nothing here fabricates customers, partners, addresses or bookings.

| What | Where | Needs |
|---|---|---|
| **Booking submit** | `src/components/Booking.tsx` → `#booking-form`, backed by `src/app/api/book/route.ts` | Wired to Square Bookings/Customers/Orders, see "Square booking setup" below. Won't actually create a booking until the Square env vars are filled in; until then it shows a clear error instead of a fake success. |
| **Contact form** | `src/components/Contact.tsx` → `onSubmit` | Inbox or CRM endpoint. Same honesty notice applies. |
| **Newsletter** | `src/components/Footer.tsx` | Mailing-list endpoint. |
| **Address** | `src/components/Contact.tsx`, `src/app/layout.tsx` JSON-LD | Only "Montreal, Quebec" is claimed. Add a verified street address to both if there is a storefront. |
| **Social links** | not present | Add to the footer only when real URLs exist. |
| **Trust strip** | `src/lib/content.ts` → `TRUST` | Statements about how the business works, not partnerships. Swap for real partner marks only if partnerships exist. |
| **Domain** | `src/app/layout.tsx` → `SITE` | Currently `https://kicks2fresh.ca`. |

## Booking flow

Two steps, by design, the previous four-step quote funnel was the main source
of friction:

1. **Choose service**: three tiers with prices on screen, plus add-ons. A
   running total updates live.
2. **Your details**: name, email, phone, preferred date/time, number of pairs,
   notes. The total stays visible.

Selection state lives in `BookingProvider` and is shared with the pricing
section, so toggling an add-on in either place updates both.

## Square booking setup

The drop-off step and the contact form are wired to Square, but need your
Square account's credentials before they'll actually create anything. Until
then, the site still works, dates show the full hourly range and submitting
shows a clear "not connected yet" message instead of a fake confirmation.

**How it works:** a drop-off is modeled as one lightweight Square Appointment
(the calendar slot, 20 min by default, price $0) plus a real Square Order
with one line item per pair (tier + add-ons), linked to the booking. The full
per-pair breakdown and total also go into the booking's notes. Availability is
read live from Square's own Bookings API, so the calendar can never double
book a slot, and any booking you create by hand in Square's dashboard also
blocks that slot on the website automatically.

1. **Get credentials**: [Square Developer Dashboard](https://developer.squareup.com/apps) → your app → *Credentials* for `SQUARE_ACCESS_TOKEN`, and *Locations* for `SQUARE_LOCATION_ID`. Start with the **Sandbox** token to test safely before going live.
2. **Get a team member ID**: Square Dashboard → *Staff* → *Team* → the person who should receive drop-offs → copy their ID for `SQUARE_TEAM_MEMBER_ID`. (Square requires every appointment to be assigned to a team member.)
3. Copy `.env.example` to `.env.local` and fill in the three values above.
4. Run the one-time catalog setup script, then paste its output back into `.env.local`:
   ```bash
   node scripts/setup-square-catalog.mjs
   ```
5. In the Square Dashboard, go to **Appointments → Settings** and set the booking time-slot increment to **60 minutes**, so only on-the-hour times are ever offered (this matches the hourly drop-off slots on the site).
6. Double-check `BUSINESS_OPEN_HOUR` / `BUSINESS_CLOSE_HOUR` in `.env.local` match your real hours (defaults: 9–18, Quebec/Eastern time via `SQUARE_TIMEZONE`).
7. When ready for real bookings, set `SQUARE_ENVIRONMENT=production` and swap in a production access token.

Restart `npm run dev` after editing `.env.local`, Next.js only reads it at startup.
