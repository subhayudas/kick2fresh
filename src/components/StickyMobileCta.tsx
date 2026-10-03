"use client";

import { useEffect, useState } from "react";
import s from "./StickyMobileCta.module.css";
import { ArrowRight } from "./Icons";
import { useBooking } from "./BookingProvider";
import { useLocale } from "./LocaleProvider";
import { CONTACT } from "@/lib/contact";
import { PhoneIcon } from "./ContactLinks";
import { trackEvent } from "@/lib/analytics";
import { trackMeta } from "@/lib/metaPixel";

/* Always-visible bottom bar on phones: the same booking flow as every other CTA,
   plus a one-tap call when a number is configured. Hidden while the sheet is open. */
export default function StickyMobileCta() {
  const { openBooking, isOpen } = useBooking();
  const { t } = useLocale();
  const [past, setPast] = useState(false);

  // Hold the bar back until the hero's own button has scrolled out of view, so
  // the first screen shows one CTA, not two.
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > 380);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isOpen) return null;

  return (
    <div className={s.bar} data-show={past}>
      {CONTACT.telHref && (
        <a
          className={`btn btn--ghost ${s.call}`}
          href={CONTACT.telHref}
          aria-label={t.nav.call}
          onClick={() => {
            trackEvent("contact_click", { channel: "call", location: "sticky" });
            trackMeta("Contact", { channel: "call", location: "sticky" });
          }}
        >
          <PhoneIcon />
        </a>
      )}
      <button
        type="button"
        className={`btn btn--blue btn--lg ${s.book}`}
        onClick={() => openBooking({ source: "sticky" })}
      >
        {t.stickyCta.bookNow}
        <ArrowRight className="btn-arrow" size={16} />
      </button>
    </div>
  );
}
