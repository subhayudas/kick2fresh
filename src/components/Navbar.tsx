"use client";

import { useEffect, useState } from "react";
import s from "./Navbar.module.css";
import { NAV } from "@/lib/content";
import { ArrowRight, ArrowUpRight, IconShoe } from "./Icons";
import { useBooking } from "./BookingProvider";

export default function Navbar() {
  const [stuck, setStuck] = useState(false);
  const [menu, setMenu] = useState(false);
  const { openBooking } = useBooking();

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
            <a href="#top" className={s.logo} aria-label="Kicks2Fresh — home">
              <span className={s.mark} aria-hidden>
                <IconShoe size={17} />
              </span>
              <span className={s.word}>
                Kicks<em>2</em>Fresh
              </span>
            </a>

            <nav className={s.links} aria-label="Primary">
              {NAV.map((n) => (
                <a key={n.href} href={n.href} className={s.link}>
                  {n.label}
                </a>
              ))}
            </nav>

            <div className={s.right}>
              <span className={s.phoneLine}>Montreal · Bilingual</span>
              <button
                type="button"
                className="btn btn--solid btn--sm"
                onClick={() => openBooking()}
              >
                Book Your Clean
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
          {NAV.map((n) => (
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
          <div className={s.panelCta}>
            <button
              type="button"
              className="btn btn--amber btn--lg"
              tabIndex={menu ? 0 : -1}
              onClick={() => {
                setMenu(false);
                openBooking();
              }}
            >
              Book Your Clean
              <ArrowRight className="btn-arrow" size={15} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
