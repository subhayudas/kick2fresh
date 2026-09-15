"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import s from "./Expertise.module.css";
import { EXPERTISE } from "@/lib/content";
import Reveal from "./Reveal";

/**
 * Signature dark feature. Reads like a product-anatomy diagram: the sneaker is
 * the specimen, the callouts are pinned to points on it by hairline connectors.
 * Cycles on its own, and hovering a legend chip pins that annotation.
 */
export default function Expertise() {
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const plateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pinned) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % EXPERTISE.length),
      4200,
    );
    return () => window.clearInterval(id);
  }, [pinned]);

  useEffect(() => {
    const v = videoRef.current;
    const el = plateRef.current;
    if (!v || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 860px)").matches) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          v.load();
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className={s.sec}>
      <div className="shell-wide">
        <Reveal>
          <div className={s.plate} ref={plateRef}>
            <div className={s.media}>
              <Image
                src="/media/feature-dark.webp"
                alt="A white leather sneaker lit by a single warm light in a dark studio, steam drifting across it"
                width={2304}
                height={1296}
                sizes="100vw"
                loading="lazy"
              />
              <video
                muted
                loop
                playsInline
                preload="none"
                ref={videoRef}
                poster="/media/restoration-loop-poster.webp"
                data-ready={videoReady}
                onPlaying={() => setVideoReady(true)}
                aria-hidden
              >
                <source src="/media/restoration-loop.mp4" type="video/mp4" />
              </video>
            </div>
            <span className={s.scrim} aria-hidden />

            {/* Connector lines: a 100x100 viewBox stretched to the plate, so the
                endpoints track the percentage coordinates exactly. */}
            <svg
              className={s.lines}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              {EXPERTISE.map((e, i) => (
                <line
                  key={e.id}
                  data-on={active === i}
                  x1={e.dotX}
                  y1={e.dotY}
                  x2={e.x}
                  y2={e.y + 5}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>

            {/* Pins sit in the DOM so they stay perfectly round */}
            {EXPERTISE.map((e, i) => (
              <span
                key={`p-${e.id}`}
                className={s.pin}
                data-on={active === i}
                style={{ ["--x" as string]: `${e.dotX}%`, ["--y" as string]: `${e.dotY}%` }}
                aria-hidden
              />
            ))}

            {EXPERTISE.map((e, i) => (
              <div
                key={e.id}
                className={s.note}
                data-on={active === i}
                style={{ ["--x" as string]: `${e.x}%`, ["--y" as string]: `${e.y}%` }}
                aria-hidden={active !== i}
              >
                <span className={s.noteLabel}>{e.label}</span>
                <p className={s.noteCopy}>{e.copy}</p>
              </div>
            ))}

            <div className={s.inner}>
              <div className={s.top}>
                <span className="eyebrow eyebrow--dark">Inside the process</span>
                <h2 className={s.title}>
                  We treat sneakers like the <em>objects</em> they are.
                </h2>
                <p className={s.blurb}>
                  Every pair is assessed by material before a brush touches it. Leather,
                  suede, nubuck and mesh each get a different chemistry, a different
                  pressure and a different drying method.
                </p>
              </div>

              <div className={s.bottom}>
                <div
                  className={s.legend}
                  onMouseLeave={() => setPinned(false)}
                >
                  {EXPERTISE.map((e, i) => (
                    <button
                      key={e.id}
                      type="button"
                      className={s.legendBtn}
                      data-on={active === i}
                      onMouseEnter={() => { setActive(i); setPinned(true); }}
                      onFocus={() => { setActive(i); setPinned(true); }}
                      onBlur={() => setPinned(false)}
                      onClick={() => { setActive(i); setPinned(true); }}
                      aria-pressed={active === i}
                    >
                      {e.label}
                    </button>
                  ))}
                </div>

                {/* Mobile: the same four notes, stacked and always readable */}
                <div className={s.stack}>
                  {EXPERTISE.map((e) => (
                    <div key={e.id} className={s.stackItem}>
                      <span className={s.noteLabel}>{e.label}</span>
                      <p className={s.noteCopy}>{e.copy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
