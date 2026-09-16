"use client";

import s from "./Guarantee.module.css";
import { IconShield } from "./Icons";
import Reveal from "./Reveal";
import { useLocalizedGuarantee } from "@/lib/useLocalizedContent";
import { useLocale } from "./LocaleProvider";

export default function Guarantee() {
  const { t } = useLocale();
  const g = useLocalizedGuarantee();

  return (
    <section className={s.sec}>
      <div className="shell">
        <Reveal className={`${s.band} card--dark`}>
          <span className="eyebrow eyebrow--dark" style={{ marginBottom: 16 }}>{t.guarantee.eyebrow}</span>
          <span className={s.icon} aria-hidden><IconShield size={26} /></span>
          <h2 className={s.headline}>{g.headline}</h2>
          <p className={s.subtitle}>{g.subtitle}</p>
        </Reveal>
      </div>
    </section>
  );
}
