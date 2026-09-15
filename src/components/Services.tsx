"use client";

import Image from "next/image";
import { useState } from "react";
import s from "./Services.module.css";
import { TIERS } from "@/lib/content";
import {
  ArrowRight, Check, Chevron, IconBrush, IconDroplet, IconSole, IconTool,
  IconClock, IconGlobe, IconShield,
} from "./Icons";
import Reveal from "./Reveal";
import { useBooking } from "./BookingProvider";

const GLYPH = {
  essential: IconDroplet,
  premium: IconBrush,
  expert: IconTool,
} as const;

export default function Services() {
  const [open, setOpen] = useState<string>("premium");
  const { openBooking } = useBooking();

  return (
    <section className={s.sec} id="services">
      <div className="shell">
        <div className={s.grid}>
          {/* ---------- Left: sticky editorial ---------- */}
          <Reveal className={s.aside}>
            <span className="eyebrow">Services</span>
            <h2 className={`h2 ${s.title}`}>
              Premium shoe care, <em>tailored</em> to you.
            </h2>
            <p className={`lede ${s.asideCopy}`}>
              Three levels, one standard. Pick the one that matches the pair —
              we&rsquo;ll tell you honestly if it needs more or less.
            </p>

            <div className={s.asideMeta}>
              <span className={s.metaRow}>
                <IconClock size={17} /> 3–5 day standard turnaround
              </span>
              <span className={s.metaRow}>
                <IconGlobe size={17} /> Service in English &amp; French
              </span>
              <span className={s.metaRow}>
                <IconShield size={17} /> Every pair logged and handled individually
              </span>
            </div>
          </Reveal>

          {/* ---------- Right: stacked controls ---------- */}
          <div className={s.stack}>
            {TIERS.map((t, i) => {
              const G = GLYPH[t.id];
              const isOpen = open === t.id;
              return (
                <Reveal key={t.id} delay={i * 70}>
                  <div className={s.item} data-open={isOpen}>
                    <button
                      type="button"
                      className={s.head}
                      aria-expanded={isOpen}
                      aria-controls={`svc-${t.id}`}
                      onClick={() => setOpen(isOpen ? "" : t.id)}
                    >
                      <span className={s.glyph} aria-hidden><G size={19} /></span>
                      <span className={s.headText}>
                        <span className={s.name}>{t.name}</span>
                        <span className={s.tagline}>{t.tagline}</span>
                      </span>
                      <span className={s.price}>
                        {t.from && <small>from</small>}
                        {t.priceLabel}
                        <small>CAD</small>
                      </span>
                      <span className={s.toggle} aria-hidden><Chevron size={15} /></span>
                    </button>

                    <div className={s.body} id={`svc-${t.id}`} role="region" aria-label={t.name}>
                      <div className={s.bodyInner}>
                        <div className={s.bodyGrid}>
                          <div>
                            <p className={s.desc}>{t.blurb}</p>
                            <ul className={s.includes}>
                              {t.includes.map((inc) => (
                                <li key={inc}>
                                  <Check size={13} />
                                  {inc}
                                </li>
                              ))}
                            </ul>
                            <span className={s.ideal}>Ideal for — {t.idealFor}</span>
                            <div className={s.cta}>
                              <button
                                type="button"
                                className="btn btn--solid"
                                onClick={() => openBooking(t.id)}
                                tabIndex={isOpen ? 0 : -1}
                              >
                                Book {t.name}
                                <ArrowRight className="btn-arrow" size={14} />
                              </button>
                              <a
                                href="#pricing"
                                className="btn btn--ghost"
                                tabIndex={isOpen ? 0 : -1}
                              >
                                Compare pricing
                              </a>
                            </div>
                          </div>
                          <div className={s.thumb}>
                            <Image
                              src={t.image}
                              alt={t.imageAlt}
                              width={800}
                              height={800}
                              sizes="(max-width: 640px) 90vw, 170px"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}

            {/* Fourth control — specialty work, not a priced tier */}
            <Reveal delay={220}>
              <a href="#pricing" className={`${s.item} ${s["item--flat"]}`} style={{ display: "block" }}>
                <span className={s.head} style={{ display: "flex" }}>
                  <span className={s.glyph} aria-hidden><IconSole size={19} /></span>
                  <span className={s.headText}>
                    <span className={s.name}>Sole &amp; Specialty Care</span>
                    <span className={s.tagline}>Add-ons, priced per pair</span>
                  </span>
                  <span className={s.price}>
                    <small>from</small>+$10
                  </span>
                  <span className={s.toggle} aria-hidden style={{ transform: "rotate(-90deg)" }}>
                    <Chevron size={15} />
                  </span>
                </span>
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
