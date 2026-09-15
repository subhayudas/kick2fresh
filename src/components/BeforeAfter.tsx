"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import s from "./BeforeAfter.module.css";
import { Handle, ArrowRight } from "./Icons";
import Reveal from "./Reveal";
import { useBooking } from "./BookingProvider";

export default function BeforeAfter() {
  const [split, setSplit] = useState(52);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const { openBooking } = useBooking();

  const setFromClientX = useCallback((clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pct = ((clientX - r.left) / r.width) * 100;
    setSplit(Math.min(98, Math.max(2, pct)));
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      e.preventDefault();
      setFromClientX(e.clientX);
    };
    const up = () => { dragging.current = false; };
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [setFromClientX]);

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 3;
    if (e.key === "ArrowLeft") { e.preventDefault(); setSplit((v) => Math.max(2, v - step)); }
    if (e.key === "ArrowRight") { e.preventDefault(); setSplit((v) => Math.min(98, v + step)); }
    if (e.key === "Home") { e.preventDefault(); setSplit(2); }
    if (e.key === "End") { e.preventDefault(); setSplit(98); }
  };

  return (
    <section className={s.sec} id="about">
      <div className="shell">
        <div className={s.head}>
          <Reveal>
            <span className="eyebrow">The transformation</span>
            <h2 className={`h2 ${s.title}`}>
              See the <em>difference</em>.
            </h2>
          </Reveal>

          <Reveal className={s.headRight} delay={90}>
            <p className="lede">
              From everyday dirt to a fresh finish — every pair gets the care it
              deserves. Drag the handle to see one Essential Clean, start to finish.
            </p>
            <button type="button" className="btn btn--ghost" onClick={() => openBooking("essential")}>
              Start with an Essential Clean
              <ArrowRight className="btn-arrow" size={14} />
            </button>
          </Reveal>
        </div>

        <Reveal className={s.stage} delay={60}>
          <div
            ref={frameRef}
            className={s.compare}
            style={{ ["--split" as string]: `${split}%` }}
            onPointerDown={(e) => {
              dragging.current = true;
              setFromClientX(e.clientX);
            }}
          >
            <div className={s.layer}>
              <Image
                src="/media/before.webp"
                alt="A heavily worn white leather sneaker with a stained, yellowed midsole before cleaning"
                width={2016}
                height={1344}
                sizes="(max-width: 900px) 100vw, 1200px"
                loading="lazy"
              />
            </div>
            <div className={`${s.layer} ${s.afterLayer}`}>
              <Image
                src="/media/after.webp"
                alt="The same sneaker after cleaning, with bright white leather and a fresh midsole"
                width={2016}
                height={1344}
                sizes="(max-width: 900px) 100vw, 1200px"
                loading="lazy"
              />
            </div>

            <span className={`${s.tag} ${s.tagBefore}`} style={{ opacity: split < 18 ? 0 : 1 }}>
              Before
            </span>
            <span className={`${s.tag} ${s.tagAfter}`} style={{ opacity: split > 82 ? 0 : 1 }}>
              <span className={s.dotLive} aria-hidden />
              After
            </span>

            <span className={s.divider} aria-hidden />

            <button
              type="button"
              className={s.knob}
              role="slider"
              aria-label="Reveal the cleaned sneaker"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(split)}
              aria-valuetext={`${Math.round(split)}% cleaned`}
              onKeyDown={onKey}
              onPointerDown={(e) => {
                e.stopPropagation();
                dragging.current = true;
              }}
            >
              <Handle size={18} />
            </button>

            <span className={s.sheen} aria-hidden />
          </div>

          <dl className={s.spec}>
            <div className={s.specRow}>
              <dt>Service applied</dt>
              <dd>Essential Clean</dd>
            </div>
            <div className={s.specRow}>
              <dt>Add-on</dt>
              <dd>Sole Whitening</dd>
            </div>
            <div className={s.specRow}>
              <dt>Turnaround</dt>
              <dd>3–5 days</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal className={s.hint} delay={140}>
          <span className={s.hintKey}>← →</span>
          Drag, or use the arrow keys once the handle is focused.
        </Reveal>
      </div>
    </section>
  );
}
