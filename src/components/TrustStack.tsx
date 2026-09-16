"use client";

import Image from "next/image";
import s from "./TrustStack.module.css";
import { Star, ArrowRight } from "./Icons";
import Reveal from "./Reveal";
import { useBooking } from "./BookingProvider";
import { useLocale } from "./LocaleProvider";
import { useLocalizedReviews, useLocalizedMaterials, useLocalizedStats } from "@/lib/useLocalizedContent";

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
          <Reveal>
            <span className="eyebrow">{t.trust.eyebrow}</span>
            <h2 className={`h2 ${s.title}`}>{t.trust.title}</h2>
          </Reveal>
          <Reveal className={s.headRight} delay={80}>
            <p className="lede">{t.trust.subtitle}</p>
          </Reveal>
        </div>

        <Reveal className={`${s.score} card`}>
          <span className={s.scoreNum}>{googleStat.value}</span>
          <span className={s.scoreRight}>
            <span className={s.stars} aria-hidden>
              {[0, 1, 2, 3, 4].map((n) => <Star key={n} size={15} />)}
            </span>
            <span className={s.scoreMeta}>{googleStat.label}</span>
          </span>
        </Reveal>

        <div className={s.reviews}>
          {reviews.map((r, i) => (
            <Reveal key={r.who + i} delay={i * 70}>
              <div className={`${s.reviewCard} card`}>
                <div className={s.reviewTop}>
                  <span className={s.stars} aria-hidden>
                    {[0, 1, 2, 3, 4].map((n) => <Star key={n} size={12} />)}
                  </span>
                  <span className={s.placeholder}>{t.trust.placeholder}</span>
                </div>
                <p className={s.reviewQuote}>&ldquo;{r.quote}&rdquo;</p>
                <div className={s.reviewFoot}>
                  <span className={s.avatar} aria-hidden>—</span>
                  <span>
                    <span className={s.who}>{r.who}</span>
                    <span className={s.meta}>{r.meta}</span>
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className={s.materialsIntro}>
          <h3 className={s.materialsTitle}>{t.trust.materialsTitle}</h3>
          <p className={s.materialsCopy}>{t.trust.materialsCopy}</p>
        </Reveal>

        <div className={s.materials}>
          {materials.map((m, i) => (
            <Reveal key={m.id} delay={i * 40}>
              {m.image ? (
                <div className={`${s.mTile} ${s["mTile--photo"]}`}>
                  <Image src={m.image} alt={m.alt ?? ""} fill sizes="(max-width: 940px) 50vw, 24vw" loading="lazy" />
                  <div className={s.mBody}>
                    <div className={s.mLabel}>{m.label}</div>
                    <div className={s.mCopy}>{m.copy}</div>
                  </div>
                </div>
              ) : (
                <div className={`${s.mTile} ${s["mTile--plain"]}`}>
                  <div className={s.mBody}>
                    <div className={s.mLabel}>{m.label}</div>
                    <div className={s.mCopy}>{m.copy}</div>
                  </div>
                </div>
              )}
            </Reveal>
          ))}
        </div>

        <div className={s.ctaRow}>
          <button type="button" className="btn btn--amber btn--lg" onClick={() => openBooking()}>
            {t.trust.cta}
            <ArrowRight className="btn-arrow" size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
