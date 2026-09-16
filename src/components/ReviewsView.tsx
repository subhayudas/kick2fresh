"use client";

import { LocaleProvider } from "./LocaleProvider";
import { BookingProvider, useBooking } from "./BookingProvider";
import { useLocale } from "./LocaleProvider";
import LanguagePicker from "./LanguagePicker";
import Navbar from "./Navbar";
import Footer from "./Footer";
import StickyMobileCta from "./StickyMobileCta";
import Reveal from "./Reveal";
import s from "./ReviewsView.module.css";
import { Star, ArrowRight, ArrowUpRight } from "./Icons";
import { useLocalizedAllReviews } from "@/lib/useLocalizedContent";
import { GOOGLE_REVIEWS_URL, GOOGLE_REVIEW_TOTAL, GOOGLE_REVIEW_UNWRITTEN } from "@/lib/content";

function ReviewsBody() {
  const { t } = useLocale();
  const { openBooking } = useBooking();
  const reviews = useLocalizedAllReviews();

  return (
    <main id="main">
      <section className={s.hero}>
        <div className="shell">
          <Reveal>
            <a href="/#top" className={s.back}>
              <span aria-hidden>←</span> {t.reviewsPage.back}
            </a>
          </Reveal>

          <div className={s.heroGrid}>
            <Reveal>
              <span className="eyebrow">{t.reviewsPage.eyebrow}</span>
              <h1 className={`display ${s.title}`}>{t.reviewsPage.title}</h1>
              <p className={`lede ${s.lede}`}>{t.reviewsPage.subtitle}</p>
            </Reveal>

            <Reveal delay={80} className={`${s.scoreCard} card`}>
              <div className={s.scoreTop}>
                <span className={s.scoreNum}>5.0</span>
                <span className={s.stars} aria-hidden>
                  {[0, 1, 2, 3, 4].map((n) => <Star key={n} size={17} />)}
                </span>
              </div>
              <span className={s.scoreMeta}>
                {GOOGLE_REVIEW_TOTAL} {t.trust.reviewsLabel} · {t.reviewsPage.scoreMeta}
              </span>
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn--ghost btn--sm ${s.scoreCta}`}
              >
                {t.reviewsPage.leaveReview}
                <ArrowUpRight size={13} />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={s.listSec}>
        <div className="shell">
          <div className={s.grid}>
            {reviews.map((r, i) => (
              <Reveal key={r.who + i} delay={Math.min(i, 8) * 40} className={`${s.card} card`}>
                <div className={s.cardTop}>
                  <span className={s.stars} aria-hidden>
                    {[0, 1, 2, 3, 4].map((n) => <Star key={n} size={12} />)}
                  </span>
                </div>
                <p className={s.quote}>&ldquo;{r.quote}&rdquo;</p>
                <div className={s.foot}>
                  <span className={s.avatar} aria-hidden>{r.who.charAt(0)}</span>
                  <span>
                    <span className={s.who}>{r.who}</span>
                    <span className={s.meta}>{r.meta}</span>
                  </span>
                </div>
              </Reveal>
            ))}
          </div>

          {GOOGLE_REVIEW_UNWRITTEN > 0 && (
            <Reveal className={s.note}>
              {t.reviewsPage.moreNote.replace("{n}", String(GOOGLE_REVIEW_UNWRITTEN))}
            </Reveal>
          )}

          <Reveal className={s.ctaRow}>
            <button type="button" className="btn btn--blue btn--lg" onClick={() => openBooking()}>
              {t.reviewsPage.cta}
              <ArrowRight className="btn-arrow" size={15} />
            </button>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

export default function ReviewsView() {
  return (
    <LocaleProvider>
      <LanguagePicker />
      <BookingProvider>
        <Navbar />
        <ReviewsBody />
        <Footer />
        <StickyMobileCta />
      </BookingProvider>
    </LocaleProvider>
  );
}
