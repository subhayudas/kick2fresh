"use client";

import s from "./ServiceSelection.module.css";
import { useLocalizedTiers, useLocalizedAddons } from "@/lib/useLocalizedContent";
import { ArrowRight, Check, IconSparkle } from "./Icons";
import Reveal from "./Reveal";
import { useBooking } from "./BookingProvider";
import { useLocale } from "./LocaleProvider";

/* Pricing, stacked and thumb-sized on phones. The recommended tier leads; every
   "book" button opens the same booking sheet with that tier already chosen. */
export default function ServiceSelection() {
  const { openBooking } = useBooking();
  const { t } = useLocale();
  const tiers = useLocalizedTiers();
  const addons = useLocalizedAddons();

  return (
    <section className={s.sec} id="services">
      <div className="shell">
        <div className={s.head}>
          <span className="eyebrow">{t.services.eyebrow}</span>
          <h2 className={`h2 ${s.title}`}>{t.services.title}</h2>
          <p className="lede">{t.services.subtitle}</p>
        </div>

        <div className={s.tiers}>
          {tiers.map((tr) => (
            <Reveal key={tr.id} className={tr.featured ? s.first : ""}>
              <div className={`${s.tier} ${tr.featured ? s["tier--featured"] : ""}`}>
                {tr.featured && (
                  <span className={s.ribbon}>
                    <IconSparkle size={11} /> {t.services.recommended}
                  </span>
                )}
                <div className={s.top}>
                  <div>
                    <h3 className={s.tierName}>{tr.name}</h3>
                    <p className={s.bestFor}>{tr.bestFor}</p>
                  </div>
                  <p className={s.amount}>
                    <b>{tr.priceLabel}</b>
                    <span>{t.services.cadPerPair}</span>
                  </p>
                </div>

                <details className={s.details}>
                  <summary>{t.services.seeIncluded}</summary>
                  <ul className={s.list}>
                    {tr.includes.map((inc) => (
                      <li key={inc}>
                        <Check size={13} />
                        {inc}
                      </li>
                    ))}
                  </ul>
                </details>

                <button
                  type="button"
                  className={`btn btn--block ${tr.featured ? "btn--blue" : "btn--solid"}`}
                  onClick={() => openBooking({ tier: tr.id, source: `tier_${tr.id}` })}
                >
                  {t.services.cta}
                  <ArrowRight className="btn-arrow" size={15} />
                </button>
              </div>
            </Reveal>
          ))}
        </div>

        <p className={s.addons}>
          <b>{t.services.addonsTitle}:</b>{" "}
          {addons.map((a) => `${a.name} +$${a.price}`).join(" · ")}
        </p>
      </div>
    </section>
  );
}
