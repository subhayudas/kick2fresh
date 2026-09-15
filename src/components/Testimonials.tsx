"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import s from "./Testimonials.module.css";
import { Star, IconShield } from "./Icons";
import Reveal from "./Reveal";

/**
 * Review section.
 *
 * The quotes below are clearly-labelled PLACEHOLDERS. Kicks2Fresh has not
 * supplied verified testimonials, and inventing customer names, ratings or
 * review counts would be fabricated social proof. Replace `SLOTS` with real,
 * attributable reviews and delete the `placeholder` badge + notice when you do.
 */
const SLOTS = [
  {
    quote: "Placeholder review slot — paste a real customer quote here.",
    who: "Customer name",
    meta: "Service used · Montreal",
  },
  {
    quote: "Placeholder review slot — two or three sentences works best.",
    who: "Customer name",
    meta: "Service used · Montreal",
  },
  {
    quote: "Placeholder review slot — keep the customer's own wording.",
    who: "Customer name",
    meta: "Service used · Montreal",
  },
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setFade(true);
      window.setTimeout(() => {
        setI((v) => (v + 1) % SLOTS.length);
        setFade(false);
      }, 380);
    }, 6000);
    return () => window.clearInterval(id);
  }, []);

  const go = (n: number) => {
    setFade(true);
    window.setTimeout(() => { setI(n); setFade(false); }, 200);
  };

  return (
    <section className={s.sec} id="reviews">
      <div className="shell">
        <div className={s.grid}>
          <Reveal className={s.stage}>
            <div className={s.plate}>
              <Image
                src="/media/testimonial.webp"
                alt="A freshly restored pair of cream leather sneakers on charcoal felt beside a sand-coloured dust bag"
                width={1792}
                height={1344}
                sizes="(max-width: 940px) 92vw, 56vw"
                loading="lazy"
              />
            </div>

            <figure className={s.quoteCard}>
              <div className={s.qTop}>
                <span className={s.stars} aria-hidden>
                  {[0, 1, 2, 3, 4].map((n) => <Star key={n} size={13} />)}
                </span>
                <span className={s.placeholder}>Placeholder</span>
              </div>

              <blockquote className={s.quote} data-fade={fade}>
                &ldquo;{SLOTS[i].quote}&rdquo;
              </blockquote>

              <figcaption className={s.qFoot}>
                <span className={s.who}>
                  <span className={s.avatar} aria-hidden>—</span>
                  <span>
                    <span style={{ display: "block", fontSize: 13, fontWeight: 550, letterSpacing: "-0.02em" }}>
                      {SLOTS[i].who}
                    </span>
                    <span className="micro" style={{ fontSize: 11 }}>{SLOTS[i].meta}</span>
                  </span>
                </span>
                <span className={s.dots}>
                  {SLOTS.map((_, n) => (
                    <button
                      key={n}
                      type="button"
                      className={s.dot}
                      data-on={n === i}
                      aria-label={`Show review slot ${n + 1}`}
                      onClick={() => go(n)}
                    />
                  ))}
                </span>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal className={s.copy} delay={90}>
            <span className="eyebrow">Reviews</span>
            <h2 className={`h2 ${s.title}`}>
              What people say when they <em>open the box</em>.
            </h2>
            <p className={`lede ${s.body}`}>
              Every pair goes back in a dust bag with the laces re-strung. Most
              people notice the midsole first — then the smell.
            </p>

            <div className={s.notice}>
              <IconShield size={16} />
              <span>
                These review cards are unpopulated placeholders. Real customer
                quotes drop straight into <code>Testimonials.tsx</code> — we
                won&rsquo;t publish invented social proof.
              </span>
            </div>

            <div className={s.stats}>
              <div className={s.stat}>
                <div className={s.statNum}>3–5 days</div>
                <div className={s.statLabel}>Standard turnaround on most pairs</div>
              </div>
              <div className={s.stat}>
                <div className={s.statNum}>4 materials</div>
                <div className={s.statLabel}>Leather, suede, nubuck and mesh, each treated differently</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
