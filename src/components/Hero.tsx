"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import s from "./Hero.module.css";
import { ArrowRight, IconShield, Star } from "./Icons";
import { useBooking } from "./BookingProvider";
import { useLocale } from "./LocaleProvider";
import Reveal from "./Reveal";

export default function Hero() {
  const { openBooking } = useBooking();
  const { t } = useLocale();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  /* The loop only loads once the hero is on screen and motion is welcome. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          v.load();
          v.play().catch(() => {});
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <section className={s.hero} id="top">
      {/* ---------- Right-side background: the sneaker loop, blended into the ivory ---------- */}
      <div className={s.media} aria-hidden>
        <Image
          src="/media/hero-sneaker.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 1060px) 78vw, 54vw"
          className={s.mediaImage}
        />
        <video
          ref={videoRef}
          className={s.mediaVideo}
          muted
          loop
          playsInline
          preload="none"
          poster="/media/hero-loop-poster.webp"
          data-ready={videoReady}
          onPlaying={() => setVideoReady(true)}
        >
          <source src="/media/hero-loop.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ---------- Floating before/after result card ---------- */}
      <div className={`${s.resultCard} card--float`} aria-hidden>
        <span className={s.resultThumbs}>
          <span className={s.resultThumb}>
            <Image src="/media/before.webp" alt="" width={92} height={92} />
          </span>
          <span className={s.resultThumb}>
            <Image src="/media/after.webp" alt="" width={92} height={92} />
          </span>
        </span>
        <span className={s.resultLabel}>
          {t.hero.realResult}
          <span>{t.hero.beforeAfterLabel}</span>
        </span>
      </div>

      <div className="shell-wide">
        {/* ---------- Left: editorial copy ---------- */}
        <div className={s.copy}>
          <Reveal>
            <span className="eyebrow eyebrow--bare">
              <span className={s.liveDot} aria-hidden />
              {t.hero.eyebrow}
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className={s.headline}>{t.hero.headline}</h1>
          </Reveal>

          <Reveal delay={160}>
            <p className={s.sub}>{t.hero.tagline}</p>
          </Reveal>

          <Reveal delay={220}>
            <div className={s.badges}>
              <span className={s.badge}>
                <IconShield size={14} />
                {t.hero.badge1}
              </span>
              <span className={s.badge}>
                <IconShield size={14} />
                {t.hero.badge2}
              </span>
              <span className={s.badge}>
                <Star size={13} />
                {t.hero.badge3}
              </span>
            </div>
          </Reveal>

          <Reveal delay={280}>
            <div className={s.actions}>
              <button
                type="button"
                className="btn btn--amber btn--lg"
                onClick={() => openBooking()}
              >
                {t.hero.ctaPrimary}
                <ArrowRight className="btn-arrow" size={15} />
              </button>
              <a href="#results" className="btn btn--bare">
                {t.hero.ctaSecondary}
                <ArrowRight className="btn-arrow" size={14} />
                <span className="btn-underline" aria-hidden />
              </a>
            </div>
          </Reveal>

          <Reveal delay={340}>
            <div className={s.cue}>
              <span className={s.cueRail} aria-hidden />
              {t.hero.scrollCue}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
