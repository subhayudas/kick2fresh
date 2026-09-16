"use client";

import s from "./Footer.module.css";
import { useLocalizedNav, useLocalizedStrings, useLocalizedStats } from "@/lib/useLocalizedContent";
import { IconPin, Star } from "./Icons";
import { useBooking } from "./BookingProvider";
import { useLocale } from "./LocaleProvider";

export default function Footer() {
  const { openBooking } = useBooking();
  const { t } = useLocale();
  const nav = useLocalizedNav();
  const { city } = useLocalizedStrings();
  const googleStat = useLocalizedStats()[3];
  const year = 2026;

  return (
    <footer className={s.footer}>
      <div className="shell-wide">
        <div className={s.row}>
          <a href="#top" className={s.brand} aria-label="Kicks2Fresh — home">
            <img src="/logo.jpg" alt="Kicks2Fresh" className={s.mark} />
          </a>

          <div className={s.meta}>
            <span><IconPin size={14} />{city}</span>
            <span><Star size={13} />{googleStat.value} ({googleStat.label.split("·")[1]?.trim() ?? googleStat.label})</span>
          </div>

          <nav className={s.links} aria-label="Footer">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className={s.link}>{n.label}</a>
            ))}
            <button
              type="button"
              className={s.link}
              style={{ background: "none", border: "none", cursor: "pointer" }}
              onClick={() => openBooking()}
            >
              {t.footer.bookLabel}
            </button>
          </nav>
        </div>

        <div className={s.base}>
          <span>© {year} Kicks2Fresh · {city}</span>
          <span className={s.baseRight}>
            <span>{t.footer.bilingual}</span>
            <span>{t.footer.cad}</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
