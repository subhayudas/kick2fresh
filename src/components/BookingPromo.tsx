"use client";

import s from "./BookingPromo.module.css";
import { ArrowRight, Check, IconClock, IconGlobe, IconShield, IconShoe } from "./Icons";
import Reveal from "./Reveal";
import { useBooking } from "./BookingProvider";

/**
 * Kicks2Fresh has no mobile app, so this section promotes the online booking
 * flow rather than claiming an app exists. The device is a mockup of the
 * booking screen on a phone browser — built in DOM so the type stays crisp.
 */
export default function BookingPromo() {
  const { openBooking } = useBooking();

  return (
    <section className={s.sec}>
      <div className="shell">
        <Reveal>
          <div className={s.plate}>
            <div className={s.copy}>
              <span className="eyebrow eyebrow--dark">Book online</span>
              <h2 className={s.title}>
                Your sneaker care, at your <em>fingertips</em>.
              </h2>
              <p className={s.sub}>
                Choose your service, select your preferred time, and get your
                sneakers into expert hands. Two steps — no quote form, no waiting
                on a callback.
              </p>

              <div className={s.actions}>
                <button type="button" className="btn btn--amber btn--lg" onClick={() => openBooking()}>
                  Book Online
                  <ArrowRight className="btn-arrow" size={15} />
                </button>
                <a href="#pricing" className="btn btn--onDark btn--lg">See all prices</a>
              </div>

              <ul className={s.bullets}>
                <li className={s.bullet}>
                  <span className={s.bulletDot} aria-hidden><IconClock size={12} /></span>
                  Pick your drop-off window when you book
                </li>
                <li className={s.bullet}>
                  <span className={s.bulletDot} aria-hidden><IconShield size={12} /></span>
                  Price confirmed on screen before you commit
                </li>
                <li className={s.bullet}>
                  <span className={s.bulletDot} aria-hidden><IconGlobe size={12} /></span>
                  English or French, whichever you prefer
                </li>
              </ul>
            </div>

            {/* ---------- Device mockup ---------- */}
            <div className={s.deviceWrap}>
              <div className={s.device} role="img" aria-label="The Kicks2Fresh booking screen shown on a phone: service selection with Premium Restoration chosen and a running total of $120.">
                <div className={s.screen}>
                  <span className={s.notch} aria-hidden />
                  <span className={s.glass} aria-hidden />

                  <div className={s.appBar} aria-hidden>
                    <span className={s.appLogo}>
                      <span className={s.appDot}><IconShoe size={12} /></span>
                      Kicks<em>2</em>Fresh
                    </span>
                    <span className="meta" style={{ fontSize: 8 }}>Step 1 / 2</span>
                  </div>

                  <div className={s.appBody} aria-hidden>
                    <span className={s.appStep}>Choose your service</span>

                    <div className={s.appRow}>
                      <span className={s.appTick} />
                      <span className={s.appRowText}>
                        <span className={s.appRowName}>Essential Clean</span>
                        <span className={s.appRowMeta}>Regular maintenance</span>
                      </span>
                      <span className={s.appRowPrice}>$65</span>
                    </div>

                    <div className={s.appRow} data-sel="true">
                      <span className={s.appTick}><Check size={10} /></span>
                      <span className={s.appRowText}>
                        <span className={s.appRowName}>Premium Restoration</span>
                        <span className={s.appRowMeta}>Suede, nubuck &amp; leather</span>
                      </span>
                      <span className={s.appRowPrice}>$95</span>
                    </div>

                    <div className={s.appRow}>
                      <span className={s.appTick} />
                      <span className={s.appRowText}>
                        <span className={s.appRowName}>Expert Restoration</span>
                        <span className={s.appRowMeta}>Repairs &amp; re-dyeing</span>
                      </span>
                      <span className={s.appRowPrice}>$150+</span>
                    </div>

                    <span className={s.appStep} style={{ marginTop: 6 }}>Add-ons</span>

                    <div className={s.appRow} data-sel="true">
                      <span className={s.appTick}><Check size={10} /></span>
                      <span className={s.appRowText}>
                        <span className={s.appRowName}>Sole Whitening</span>
                      </span>
                      <span className={s.appRowPrice}>+$25</span>
                    </div>

                    <div className={s.appTotal}>
                      <span className={s.appTotalLabel}>Total · 1 pair</span>
                      <span className={s.appTotalNum}>$120 CAD</span>
                    </div>
                  </div>

                  <div className={s.appCta} aria-hidden>Continue to details</div>
                  <span className={s.homeBar} aria-hidden />
                </div>
              </div>

              <span className={s.confirm} aria-hidden>
                <i><Check size={12} /></i>
                Booking confirmed
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
