"use client";

import Image from "next/image";
import s from "./Hero.module.css";
import { ArrowRight, Check, Star } from "./Icons";
import { useBooking } from "./BookingProvider";
import { useLocale } from "./LocaleProvider";
import ContactLinks from "./ContactLinks";

/* Above the fold on a phone: promise, price, one primary button, proof that it
   works (real before/after) - no video, no entrance animation, so the LCP image
   and the CTA are painted immediately. */
export default function Hero() {
  const { openBooking } = useBooking();
  const { t } = useLocale();

  return (
    <section className={s.hero} id="top">
      <div className={`shell ${s.grid}`}>
        <div className={s.copy}>
          <p className={s.rating}>
            <span className={s.stars} aria-hidden>
              {[0, 1, 2, 3, 4].map((n) => <Star key={n} size={13} />)}
            </span>
            {t.hero.eyebrow}
          </p>

          <h1 className={s.headline}>{t.hero.headline}</h1>
          <p className={s.sub}>{t.hero.tagline}</p>

          <div className={s.actions}>
            <button
              type="button"
              className="btn btn--blue btn--lg btn--block"
              onClick={() => openBooking({ source: "hero" })}
            >
              {t.hero.ctaPrimary}
              <ArrowRight className="btn-arrow" size={16} />
            </button>
            <ContactLinks location="hero" />
          </div>

          <ul className={s.points}>
            {[t.hero.point1, t.hero.point2, t.hero.point3].map((p) => (
              <li key={p}>
                <Check size={14} />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <figure className={s.proof}>
          <div className={s.pair}>
            <div className={s.shot}>
              <Image
                src="/paire-01-avant.jpg"
                alt=""
                fill
                priority
                sizes="(max-width: 900px) 48vw, 330px"
                className={s.img}
              />
              <span className={s.tag}>{t.hero.before}</span>
            </div>
            <div className={s.shot}>
              <Image
                src="/paire-01-apres.jpg"
                alt=""
                fill
                priority
                sizes="(max-width: 900px) 48vw, 330px"
                className={s.img}
              />
              <span className={`${s.tag} ${s.tagAfter}`}>{t.hero.after}</span>
            </div>
          </div>
          <figcaption className={s.caption}>{t.hero.realResult}</figcaption>
        </figure>
      </div>
    </section>
  );
}
