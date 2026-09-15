"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import s from "./Process.module.css";
import { PROCESS } from "@/lib/content";
import { ArrowRight } from "./Icons";
import Reveal from "./Reveal";
import { useBooking } from "./BookingProvider";

export default function Process() {
  const [step, setStep] = useState(2);
  const [paused, setPaused] = useState(false);
  const { openBooking } = useBooking();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setStep((i) => (i + 1) % PROCESS.length), 3600);
    return () => window.clearInterval(id);
  }, [paused]);

  useEffect(() => {
    const v = videoRef.current;
    const el = stageRef.current;
    if (!v || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 640px)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { v.load(); v.play().catch(() => {}); } else { v.pause(); }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const progress = ((step + 1) / PROCESS.length) * 100;

  return (
    <section className={s.sec}>
      <div className="shell">
        <div className={s.head}>
          <Reveal>
            <span className="eyebrow">How it works</span>
            <h2 className={`h2 ${s.title}`}>
              Our easy &amp; <em>fast</em> process.
            </h2>
          </Reveal>
          <Reveal className={s.headRight} delay={80}>
            <p className="lede">
              Hassle-free sneaker care in just a few steps. Two screens to book,
              then we take it from there.
            </p>
          </Reveal>
        </div>

        <div className={s.body}>
          {/* ---------- Left: photograph with floating interface ---------- */}
          <Reveal className={s.stage}>
            <div ref={stageRef}>
              <div className={s.plate}>
                <Image
                  src="/media/process-artisan.webp"
                  alt="A gloved artisan brushing foam across the toe of a white leather sneaker at a workbench"
                  width={1344}
                  height={1680}
                  sizes="(max-width: 980px) 88vw, 46vw"
                  loading="lazy"
                />
                <video
                  ref={videoRef}
                  muted loop playsInline preload="none"
                  poster="/media/cleaning-loop-poster.webp"
                  data-ready={videoReady}
                  onPlaying={() => setVideoReady(true)}
                  aria-hidden
                >
                  <source src="/media/cleaning-loop.mp4" type="video/mp4" />
                </video>
              </div>

              <div className={`${s.hud} ${s.hudStatus}`} aria-hidden>
                <div className={s.hudRow}>
                  <span className={s.pulse} />
                  <span className={s.hudLabel}>{PROCESS[step].title}</span>
                </div>
                <div className={s.bar}>
                  <span className={s.barFill} style={{ width: `${progress}%` }} />
                </div>
                <div className={s.barMeta}>
                  <span>Step {PROCESS[step].n}</span>
                  <span>of 04</span>
                </div>
              </div>

              <div className={`${s.hud} ${s.hudPair}`} aria-hidden>
                <div className={s.pairTop}>
                  <span className="meta">Order</span>
                  <span className={s.chipTiny}>On the bench</span>
                </div>
                <div className={s.pairName}>Premium Restoration</div>
                <div className={s.pairMeta}>1 pair · suede &amp; leather · $95</div>
              </div>
            </div>
          </Reveal>

          {/* ---------- Right: numbered rail ---------- */}
          <Reveal className={s.rail} delay={100}>
            <ol onMouseLeave={() => setPaused(false)}>
              {PROCESS.map((p, i) => (
                <li key={p.n}>
                  <button
                    type="button"
                    className={s.step}
                    data-on={step === i}
                    aria-pressed={step === i}
                    onMouseEnter={() => { setStep(i); setPaused(true); }}
                    onFocus={() => { setStep(i); setPaused(true); }}
                    onClick={() => { setStep(i); setPaused(true); }}
                  >
                    <span className={s.stepNum}>{p.n}</span>
                    <span className={s.stepBody}>
                      <span className={s.stepTitle}>{p.title}</span>
                      <span className={s.stepCopy}>{p.copy}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            <div className={s.railCta}>
              <button type="button" className="btn btn--solid btn--lg" onClick={() => openBooking()}>
                Start your booking
                <ArrowRight className="btn-arrow" size={15} />
              </button>
              <a href="#contact" className="btn btn--ghost btn--lg">Ask a question first</a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
