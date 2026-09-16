"use client";

import s from "./LanguagePicker.module.css";
import { useLocale } from "./LocaleProvider";

export default function LanguagePicker() {
  const { showLanguagePicker, chooseLocale, t } = useLocale();

  if (!showLanguagePicker) return null;

  return (
    <div className={s.overlay} role="dialog" aria-modal="true" aria-label="Language selection">
      <div className={s.card}>
        <img src="/LOGO-Kicks2Fresh.png" alt="Kicks2Fresh" className={s.mark} />
        <h2 className={s.title}>{t.languagePicker.title}</h2>
        <p className={s.subtitle}>{t.languagePicker.subtitle}</p>
        <div className={s.options}>
          <button type="button" className={s.option} onClick={() => chooseLocale("en")}>
            {t.languagePicker.english}
          </button>
          <button type="button" className={s.option} onClick={() => chooseLocale("fr")}>
            {t.languagePicker.french}
          </button>
        </div>
      </div>
    </div>
  );
}
