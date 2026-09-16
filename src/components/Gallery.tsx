"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import s from "./Gallery.module.css";
import { Handle, ArrowRight, IconShield } from "./Icons";
import Reveal from "./Reveal";
import { useBooking } from "./BookingProvider";
import { useLocale } from "./LocaleProvider";
import { useLocalizedGallery } from "@/lib/useLocalizedContent";

export default function Gallery() {
  const [split, setSplit] = useState(52);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const { openBooking } = useBooking();
  const { t } = useLocale();
  const items = useLocalizedGallery();
  const [real, ...illustrative] = items;

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
    <section className={s.sec} id="results">
      <div className="shell">
        <div className={s.head}>
          <Reveal>
            <span className="eyebrow">{t.gallery.eyebrow}</span>
            <h2 className={`h2 ${s.title}`}>{t.gallery.title}</h2>
          </Reveal>

          <Reveal className={s.headRight} delay={90}>
            <p className="lede">{t.gallery.subtitle}</p>
            <button type="button" className="btn btn--ghost" onClick={() => openBooking("essential")}>
              {t.gallery.cta}
              <ArrowRight className="btn-arrow" size={14} />
            </button>
          </Reveal>
        </div>

        {/* ---------- Real pair: interactive drag slider ---------- */}
        {real && (
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
                  src={real.before}
                  alt={real.alt}
                  width={2016}
                  height={1344}
                  sizes="(max-width: 900px) 100vw, 1200px"
                  loading="lazy"
                />
              </div>
              <div className={`${s.layer} ${s.afterLayer}`}>
                <Image
                  src={real.after}
                  alt={real.alt}
                  width={2016}
                  height={1344}
                  sizes="(max-width: 900px) 100vw, 1200px"
                  loading="lazy"
                />
              </div>

              <span className={`${s.tag} ${s.tagBefore}`} style={{ opacity: split < 18 ? 0 : 1 }}>
                {t.gallery.before}
              </span>
              <span className={`${s.tag} ${s.tagAfter}`} style={{ opacity: split > 82 ? 0 : 1 }}>
                <span className={s.dotLive} aria-hidden />
                {t.gallery.after}
              </span>

              <span className={s.divider} aria-hidden />

              <button
                type="button"
                className={s.knob}
                role="slider"
                aria-label={t.gallery.revealAria}
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
          </Reveal>
        )}

        <Reveal className={s.hint} delay={140}>
          <span className={s.hintKey}>← →</span>
          {t.gallery.dragHint}
        </Reveal>

        {/* ---------- Additional illustrative results ---------- */}
        <div className={s.grid}>
          {illustrative.map((g, i) => (
            <Reveal key={g.before} delay={i * 60}>
              <div className={s.tile}>
                <div className={s.tilePane}>
                  <span className={s.tileTag}>{t.gallery.before}</span>
                  <Image src={g.before} alt={g.alt} fill sizes="(max-width: 780px) 50vw, 33vw" loading="lazy" />
                </div>
                <div className={s.tilePane}>
                  <span className={s.tileTag}>{t.gallery.after}</span>
                  <Image src={g.after} alt={g.alt} fill sizes="(max-width: 780px) 50vw, 33vw" loading="lazy" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className={s.note} delay={80}>
          <IconShield size={15} />
          <span>{t.gallery.caption}</span>
        </Reveal>

        <div className={s.ctaRow}>
          <button type="button" className="btn btn--amber btn--lg" onClick={() => openBooking()}>
            {t.gallery.cta}
            <ArrowRight className="btn-arrow" size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
