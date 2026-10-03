"use client";

import s from "./FinalCta.module.css";
import { ArrowRight, IconShield } from "./Icons";
import { useBooking } from "./BookingProvider";
import { useLocale } from "./LocaleProvider";
import ContactLinks from "./ContactLinks";
import { hasDirectContact } from "@/lib/contact";

/* The page's last word. Replaces the old inline form at the bottom: the form now
   lives in the booking sheet, so this is one more door to the same flow. */
export default function FinalCta() {
  const { openBooking } = useBooking();
  const { t } = useLocale();

  return (
    <section className={s.sec} id="book-cta">
      <div className="shell">
        <div className={`${s.card} card--dark`}>
          <h2 className={s.title}>{t.finalCta.title}</h2>
          <p className={s.copy}>{t.finalCta.copy}</p>
          <button
            type="button"
            className="btn btn--blue btn--lg btn--block"
            onClick={() => openBooking({ source: "final" })}
          >
            {t.finalCta.cta}
            <ArrowRight className="btn-arrow" size={16} />
          </button>
          <p className={s.note}>
            <IconShield size={14} />
            {t.hero.point2}
          </p>
          {hasDirectContact && (
            <div className={s.alt}>
              <span>{t.finalCta.or}</span>
              <ContactLinks location="final" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
