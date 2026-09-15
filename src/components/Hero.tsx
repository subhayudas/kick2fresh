"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import s from "./Hero.module.css";
import { ArrowRight, IconShield } from "./Icons";
import { useBooking } from "./BookingProvider";
import Reveal from "./Reveal";

export default function Hero() {
  const { openBooking } = useBooking();
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

      <div className="shell-wide">
        {/* ---------- Left: editorial copy ---------- */}
        <div className={s.copy}>
          <Reveal>
            <span className="eyebrow">Premium Sneaker Care · Montreal</span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className={s.headline}>
              Bring your kicks{" "}
              <span className={s.line2}>
                back to <em>life</em><span className={s.amberDot}>.</span>
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className={s.sub}>
              Your favourite shoes deserve expert care. Professional cleaning and
              restoration for sneakers that deserve a second life.
            </p>
          </Reveal>

          <Reveal delay={230}>
            <div className={s.actions}>
              <button
                type="button"
                className="btn btn--amber btn--lg"
                onClick={() => openBooking()}
              >
                Book Your Clean
                <ArrowRight className="btn-arrow" size={15} />
              </button>
              <a href="#services" className="btn btn--bare">
                Explore Services
                <ArrowRight className="btn-arrow" size={14} />
                <span className="btn-underline" aria-hidden />
              </a>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <div className={s.priceTag}>
              <span className={s.hole} aria-hidden />
              <span className={s.priceTagBody}>
                <b>$65 CAD</b>
                <span>starting price</span>
              </span>
              <span className={s.priceTagRule} aria-hidden />
              <span className={s.priceTagSide}>
                <IconShield size={14} />
                3–5 day turnaround
              </span>
            </div>
          </Reveal>

          <Reveal delay={360}>
            <div className={s.cue}>
              <span className={s.cueRail} aria-hidden />
              Scroll to see the difference
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
