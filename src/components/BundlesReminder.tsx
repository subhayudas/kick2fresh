"use client";

import s from "./BundlesReminder.module.css";
import { useLocalizedBundles } from "@/lib/useLocalizedContent";
import { ArrowRight } from "./Icons";
import Reveal from "./Reveal";
import { useLocale } from "./LocaleProvider";

export default function BundlesReminder() {
  const { t } = useLocale();
  const bundles = useLocalizedBundles();

  return (
    <section className={s.sec}>
      <div className="shell">
        <Reveal className={s.head}>
          <span className="eyebrow">{t.bundles.eyebrow}</span>
          <h2 className={`h2 ${s.title}`} style={{ fontSize: "clamp(1.5rem, 2.6vw, 2rem)" }}>{t.bundles.title}</h2>
        </Reveal>

        <div className={s.row}>
          {bundles.map((b, i) => (
            <Reveal key={b.id} delay={i * 60}>
              <div className={`${s.bundle} card`}>
                <div className={s.name}>{b.name}</div>
                <div className={s.price}>{b.price}{b.unit && <small>{b.unit}</small>}</div>
                <p className={s.detail}>{b.detail}</p>
                {b.save && <span className={s.save}>{b.save}</span>}
              </div>
            </Reveal>
          ))}
        </div>

        <div className={s.ctaRow}>
          <a href="#services" className="btn btn--ghost btn--lg">
            {t.bundles.cta}
            <ArrowRight className="btn-arrow" size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
