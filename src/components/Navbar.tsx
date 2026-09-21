"use client";

import { useEffect, useState } from "react";
import s from "./Navbar.module.css";
import { useLocalizedNav } from "@/lib/useLocalizedContent";
import { ArrowRight, ArrowUpRight } from "./Icons";
import { useBooking } from "./BookingProvider";
import { useLocale } from "./LocaleProvider";

export default function Navbar() {
  const [stuck, setStuck] = useState(false);
  const [menu, setMenu] = useState(false);
  const { openBooking } = useBooking();
  const { locale, toggleLocale, t } = useLocale();
  const nav = useLocalizedNav();

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("noscroll", menu);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("noscroll");
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  return (
    <>
      <header className={s.wrap} data-stuck={stuck}>
        <div className="shell-wide">
          <div className={s.bar}>
            <a href="/#top" className={s.logo} aria-label="Kicks2Fresh home">
              <img src="/LOGO-Kicks2Fresh.png" alt="Kicks2Fresh" className={s.mark} />
            </a>

            <nav className={s.links} aria-label="Primary">
              {nav.map((n) => (
                <a key={n.href} href={n.href} className={s.link}>
                  {n.label}
                </a>
              ))}
            </nav>

            <div className={s.right}>
              <button
                type="button"
                className={s.langToggle}
                onClick={toggleLocale}
                aria-label="Toggle language"
              >
                <span data-on={locale === "en"}>EN</span>
                <span aria-hidden>/</span>
                <span data-on={locale === "fr"}>FR</span>
              </button>
              <button
                type="button"
                className="btn btn--solid btn--sm"
                onClick={() => openBooking()}
              >
                {t.nav.bookNow}
                <ArrowRight className="btn-arrow" size={14} />
              </button>
              <button
                type="button"
                className={s.burger}
                aria-expanded={menu}
                aria-controls="mobile-menu"
                aria-label={menu ? "Close menu" : "Open menu"}
                onClick={() => setMenu((v) => !v)}
              >
                <span /><span /><span />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={s.sheet}
        data-open={menu}
        onClick={() => setMenu(false)}
        aria-hidden={!menu}
      >
        <div
          id="mobile-menu"
          className={s.panel}
          onClick={(e) => e.stopPropagation()}
        >
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={s.panelLink}
              onClick={() => setMenu(false)}
              tabIndex={menu ? 0 : -1}
            >
              {n.label}
              <ArrowUpRight size={16} />
            </a>
          ))}
          <button
            type="button"
            className={s.panelLink}
            onClick={toggleLocale}
            tabIndex={menu ? 0 : -1}
          >
            {locale === "en" ? "Français" : "English"}
            <ArrowUpRight size={16} />
          </button>
          <div className={s.panelCta}>
            <button
              type="button"
              className="btn btn--blue btn--lg"
              tabIndex={menu ? 0 : -1}
              onClick={() => {
                setMenu(false);
                openBooking();
              }}
            >
              {t.nav.bookNow}
              <ArrowRight className="btn-arrow" size={15} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
