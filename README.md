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

## Google Ads conversion tracking

When a booking is confirmed (Square accepted it and the "you're booked" screen
shows), the site sends a Google Ads `conversion` event with the booking total as
its value (CAD) and the Square booking id as `transaction_id`, so Google
de-duplicates repeats. Quote requests and failed or slot-taken submissions send
nothing. The code is in `src/lib/googleAds.ts` (helper), `src/app/layout.tsx`
(loads the Google tag) and `src/components/Booking.tsx` (fires the event).

1. In Google Ads: **Goals → Conversions → New conversion action → Website**, create a
   **Book** / "New Booking" action, and choose *use different value for each conversion*
   (Google fills it from the booking total). Count: **One** per click is right for bookings.
2. Open the action's **Tag setup → Install the tag yourself → Event snippet**. It contains
   `'send_to': 'AW-123456789/AbC-dEfGhIjK'`: the part before `/` is the ID, after it the label.
3. Set `NEXT_PUBLIC_GOOGLE_ADS_ID` and `NEXT_PUBLIC_GOOGLE_ADS_BOOKING_LABEL` in the
   hosting provider's environment variables (and `.env.local` to test locally). These are
   inlined at build time, so redeploy after changing them. With them unset, no tag loads.
4. Check it: Google Ads → the conversion action's status moves to *Recording conversions*
   after a real booking (can take a few hours), or use Tag Assistant / the browser's
   Network tab for a request to `googleadservices.com/pagead/conversion` or
   `google.com/pagead/1p-conversion` after submitting a test booking.

Note: the tag sets cookies, so if visitors from Quebec/EU need consent (Law 25, GDPR),
add a consent banner and gate the tag on it.

## Meta Pixel tracking

The Meta Pixel base code loads on every page (fires `PageView`), and when a
booking is confirmed the site also sends a `Schedule` event (Meta's standard
event for booking an appointment) with the booking total as its value (CAD).
Quote requests and failed or slot-taken submissions send nothing. The code is
in `src/lib/metaPixel.ts` (helper), `src/app/layout.tsx` (loads the pixel) and
`src/components/Booking.tsx` (fires the event).

1. In Meta Events Manager: **Data Sources → your pixel → Settings** to find the
   pixel ID (or **Connect data sources → Web → create a pixel** if you don't
   have one yet).
2. Set `NEXT_PUBLIC_META_PIXEL_ID` in the hosting provider's environment
   variables (and `.env.local` to test locally). This is inlined at build
   time, so redeploy after changing it. With it unset, no pixel loads.
3. Check it: install the [Meta Pixel Helper](https://chromewebstore.google.com/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
   Chrome extension, or Events Manager → **Test events**, and confirm `PageView`
   fires on load and `Schedule` fires after a test booking.

Note: like the Google Ads tag, this sets cookies, so if visitors from
Quebec/EU need consent (Law 25, GDPR), add a consent banner and gate both
tags on it.

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
