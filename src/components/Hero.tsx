"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import s from "./Hero.module.css";
import { ArrowRight, IconBrush, IconDroplet, IconTool, Star, IconShield } from "./Icons";
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
    if (window.matchMedia("(max-width: 640px)").matches) return;

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
      <div className="shell-wide">
        <div className={s.grid}>
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

          {/* ---------- Right: image plate breaking the grid ---------- */}
          <Reveal className={s.stage} delay={120}>
            <div className={s.plate}>
              <Image
                src="/media/hero-sneaker.webp"
                alt="A pristine cream leather sneaker suspended against a warm ivory studio backdrop"
                width={1344}
                height={1680}
                priority
                sizes="(max-width: 1060px) 90vw, 52vw"
              />
              <video
                ref={videoRef}
                className={s.video}
                muted
                loop
                playsInline
                preload="none"
                poster="/media/hero-loop-poster.webp"
                aria-hidden
                data-ready={videoReady}
                onPlaying={() => setVideoReady(true)}
              >
                <source src="/media/hero-loop.mp4" type="video/mp4" />
              </video>
              <span className={s.plateSheen} aria-hidden />
            </div>

            <span className={`${s.chip} ${s.chip1}`}>
              <i aria-hidden><IconDroplet size={13} /></i>
              Deep Clean
            </span>
            <span className={`${s.chip} ${s.chip2}`}>
              <i aria-hidden><IconBrush size={13} /></i>
              Premium Care
            </span>
            <span className={`${s.chip} ${s.chip3}`}>
              <i aria-hidden><IconTool size={13} /></i>
              Expert Restoration
            </span>

            <figure className={s.review}>
              <div className={s.reviewTop}>
                <span className={s.stars} aria-label="Five out of five">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} size={12} />
                  ))}
                </span>
                <span className={s.placeholder}>Sample</span>
              </div>
              <blockquote className={s.reviewQuote}>
                “Placeholder review — swap for a real customer quote before launch.”
              </blockquote>
              <figcaption className={s.reviewFoot}>
                <span className={s.avatar} aria-hidden>—</span>
                <span className="micro">Customer name · Montreal</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
