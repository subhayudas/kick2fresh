"use client";

import s from "./Footer.module.css";
import { NAV, TIERS } from "@/lib/content";
import { ArrowRight, IconShoe } from "./Icons";
import Reveal from "./Reveal";
import { useBooking } from "./BookingProvider";

export default function Footer() {
  const { openBooking } = useBooking();
  const year = 2026;

  return (
    <footer className={s.footer}>
      <div className="shell-wide">
        <Reveal className={s.band}>
          {/* ---------- Final CTA ---------- */}
          <div className={s.bandTop}>
            <div>
              <span className="eyebrow eyebrow--dark">Ready when you are</span>
              <h2 className={s.bandTitle}>
                Your favourite shoes deserve <em>expert care</em>.
              </h2>
            </div>
            <div className={s.bandRight}>
              <p className={s.bandCopy}>
                Professional sneaker cleaning and restoration in Montreal.
                Starting at $65 CAD.
              </p>
              <div className={s.bandActions}>
                <button type="button" className="btn btn--amber btn--lg" onClick={() => openBooking()}>
                  Book Your Clean
                  <ArrowRight className="btn-arrow" size={15} />
                </button>
                <a href="#pricing" className="btn btn--onDark btn--lg">Get your instant quote</a>
              </div>
            </div>
          </div>

          {/* ---------- Columns ---------- */}
          <div className={s.cols}>
            <div className={s.colBrand}>
              <span className={s.brand}>
                <span className={s.mark} aria-hidden><IconShoe size={17} /></span>
                <span className={s.word}>Kicks<em>2</em>Fresh</span>
              </span>
              <p className={s.brandCopy}>
                Professional sneaker cleaning and restoration in Montreal.
              </p>
            </div>

            <nav aria-label="Footer">
              <h3 className={s.colTitle}>Explore</h3>
              <div className={s.colList}>
                {NAV.map((n) => (
                  <a key={n.href} href={n.href} className={s.colLink}>{n.label}</a>
                ))}
                <a href="#pricing" className={s.colLink}>Pricing</a>
              </div>
            </nav>

            <div>
              <h3 className={s.colTitle}>Services</h3>
              <div className={s.colList}>
                {TIERS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={s.colLink}
                    style={{ background: "none", border: "none", padding: 0, textAlign: "left", cursor: "pointer" }}
                    onClick={() => openBooking(t.id)}
                  >
                    {t.name} — {t.priceLabel}
                  </button>
                ))}
                <a href="#pricing" className={s.colLink}>Add-ons &amp; bundles</a>
              </div>
            </div>

            <div>
              <h3 className={s.colTitle}>Stay in touch</h3>
              <form className={s.news} onSubmit={(e) => e.preventDefault()}>
                <label className="sr-only" htmlFor="news-email">Email address</label>
                <input
                  id="news-email"
                  className={s.newsInput}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                <button type="submit" className="btn btn--onDark btn--sm">Join</button>
              </form>
              <p className={s.newsNote}>
                Care tips and seasonal reminders. No backend connected yet — wire
                this to your mailing list before launch.
              </p>
            </div>
          </div>

          <div className={s.base}>
            <span>© {year} Kicks2Fresh · Montreal, Quebec</span>
            <span className={s.baseRight}>
              <span>Bilingual service</span>
              <span>Prices in CAD</span>
            </span>
          </div>

          <div className={s.watermark} aria-hidden>KICKS2FRESH</div>
        </Reveal>
      </div>
    </footer>
  );
}
