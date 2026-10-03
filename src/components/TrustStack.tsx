"use client";

import Link from "next/link";
import s from "./TrustStack.module.css";
import { Star, ArrowRight } from "./Icons";
import { useBooking } from "./BookingProvider";
import { useLocale } from "./LocaleProvider";
import { useLocalizedReviews, useLocalizedMaterials, useLocalizedStats } from "@/lib/useLocalizedContent";

/* Social proof, compact: a swipeable row of real Google reviews, then the
   materials we handle as chips (no 9-tile photo grid to scroll past). */
export default function TrustStack() {
  const { openBooking } = useBooking();
  const { t } = useLocale();
  const reviews = useLocalizedReviews();
  const materials = useLocalizedMaterials();
  const googleStat = useLocalizedStats()[3];

  return (
    <section className={s.sec} id="reviews">
      <div className="shell">
        <div className={s.head}>
          <span className="eyebrow">{t.trust.eyebrow}</span>
          <h2 className={`h2 ${s.title}`}>{t.trust.title}</h2>
          <p className={s.score}>
            <b>{googleStat.value}</b>
            <span className={s.stars} aria-hidden>
              {[0, 1, 2, 3, 4].map((n) => <Star key={n} size={15} />)}
            </span>
            <span>{googleStat.label}</span>
          </p>
        </div>
      </div>

      <div className={s.rail}>
        {reviews.map((r, i) => (
          <figure key={r.who + i} className={`${s.reviewCard} card`}>
            <span className={s.stars} aria-hidden>
              {[0, 1, 2, 3, 4].map((n) => <Star key={n} size={13} />)}
            </span>
            <blockquote className={s.reviewQuote}>&ldquo;{r.quote}&rdquo;</blockquote>
            <figcaption className={s.who}>
              {r.who}
              <span>{r.meta}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="shell">
        <Link href="/reviews" className={s.viewAll}>
          {t.trust.viewAll}
          <ArrowRight className="btn-arrow" size={14} />
        </Link>

        <h3 className={s.materialsTitle}>{t.trust.materialsTitle}</h3>
        <ul className={s.chips}>
          {materials.map((m) => (
            <li key={m.id} className={s.chip}>{m.label}</li>
          ))}
        </ul>

        <button
          type="button"
          className={`btn btn--blue btn--lg btn--block ${s.cta}`}
          onClick={() => openBooking({ source: "reviews" })}
        >
          {t.trust.cta}
          <ArrowRight className="btn-arrow" size={16} />
        </button>
      </div>
    </section>
  );
}
