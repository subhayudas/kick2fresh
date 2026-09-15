# Kicks2Fresh

Premium sneaker cleaning and restoration — Montreal, Quebec.

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

Layout is deliberately asymmetric — image plates break the shell, cards overlap
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
| **Testimonials** | `src/components/Testimonials.tsx` → `SLOTS` | Real, attributable customer quotes. Delete the `Placeholder` badge and the amber notice once populated. |
| **Hero review card** | `src/components/Hero.tsx` | One real quote; remove the `Sample` chip. |
| **Booking submit** | `src/components/BookingModal.tsx` → the `onSubmit` on `#booking-form` | Scheduling / payment integration. It currently shows a request summary and states plainly that nothing was booked. |
| **Contact form** | `src/components/Contact.tsx` → `onSubmit` | Inbox or CRM endpoint. Same honesty notice applies. |
| **Newsletter** | `src/components/Footer.tsx` | Mailing-list endpoint. |
| **Address** | `src/components/Contact.tsx`, `src/app/layout.tsx` JSON-LD | Only "Montreal, Quebec" is claimed. Add a verified street address to both if there is a storefront. |
| **Social links** | not present | Add to the footer only when real URLs exist. |
| **Trust strip** | `src/lib/content.ts` → `TRUST` | Statements about how the business works, not partnerships. Swap for real partner marks only if partnerships exist. |
| **Domain** | `src/app/layout.tsx` → `SITE` | Currently `https://kicks2fresh.ca`. |

## Booking flow

Two steps, by design — the previous four-step quote funnel was the main source
of friction:

1. **Choose service** — three tiers with prices on screen, plus add-ons. A
   running total updates live.
2. **Your details** — name, email, phone, preferred date/time, number of pairs,
   notes. The total stays visible.

Selection state lives in `BookingProvider` and is shared with the pricing
section, so toggling an add-on in either place updates both.
