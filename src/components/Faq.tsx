"use client";

import { useState } from "react";
import s from "./Faq.module.css";
import { useLocalizedFaq } from "@/lib/useLocalizedContent";
import { Chevron } from "./Icons";
import Reveal from "./Reveal";
import { useLocale } from "./LocaleProvider";

export default function Faq() {
  const [open, setOpen] = useState(0);
  const { t } = useLocale();
  const faq = useLocalizedFaq();

  return (
    <section className={s.sec} id="faq">
      <div className="shell">
        <Reveal className={s.head}>
          <span className="eyebrow">{t.faq.eyebrow}</span>
          <h2 className={`h2 ${s.title}`}>{t.faq.title}</h2>
          <p className="lede" style={{ marginTop: 12 }}>{t.faq.subtitle}</p>
        </Reveal>

        <div className={s.grid}>
          {faq.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={(i % 5) * 40}>
                <div className={s.item} data-open={isOpen}>
                  <button
                    type="button"
                    className={s.q}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    {f.q}
                    <span className={s.qIcon} aria-hidden><Chevron size={13} /></span>
                  </button>
                  <div className={s.a} id={`faq-${i}`} role="region" aria-label={f.q}>
                    <div className={s.aInner}>
                      <p>{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
