"use client";

import s from "./ServiceSelection.module.css";
import { useLocalizedTiers, useLocalizedAddons, useLocalizedBundles } from "@/lib/useLocalizedContent";
import { ArrowRight, Check, Plus, IconSparkle } from "./Icons";
import Reveal from "./Reveal";
import { useBooking } from "./BookingProvider";
import { useLocale } from "./LocaleProvider";

export default function ServiceSelection() {
  const { openBooking, addOns, toggleAddOn, tier } = useBooking();
  const { t } = useLocale();
  const tiers = useLocalizedTiers();
  const addons = useLocalizedAddons();
  const bundles = useLocalizedBundles();

  const base = tiers.find((tr) => tr.id === (tier ?? "premium")) ?? tiers[1];
  const extras = addons.filter((a) => addOns.includes(a.id)).reduce((n, a) => n + a.price, 0);
  const total = base.price + extras;

  return (
    <section className={s.sec} id="services">
      <div className="shell">
        <div className={s.head}>
          <Reveal>
            <span className="eyebrow">{t.services.eyebrow}</span>
            <h2 className={`h2 ${s.title}`}>{t.services.title}</h2>
          </Reveal>
          <Reveal className={s.headRight} delay={80}>
            <p className="lede">{t.services.subtitle}</p>
          </Reveal>
        </div>

        {/* ---------- Three pricing cards, side by side ---------- */}
        <div className={s.tiers}>
          {tiers.map((tr, i) => (
            <Reveal key={tr.id} delay={i * 90}>
              <div className={`${s.tier} ${tr.featured ? s["tier--featured"] : ""}`}>
                {tr.featured && (
                  <span className={s.ribbon}>
                    <IconSparkle size={11} /> {t.services.recommended}
                  </span>
                )}
                <div className={s.tierTop}>
                  <span className={s.num}>{tr.index}</span>
                </div>
                <h3 className={s.tierName}>{tr.name}</h3>
                <p className={s.tierTagline}>{tr.tagline}</p>
                <p className={s.bestFor}>{tr.bestFor}</p>

                <p className={s.amount}>
                  <b>{tr.priceLabel}</b>
                  <span>{tr.from ? t.services.cadAndUp : t.services.cadPerPair}</span>
                </p>

                <ul className={s.list}>
                  {tr.includes.map((inc) => (
                    <li key={inc}>
                      <Check size={13} />
                      {inc}
                    </li>
                  ))}
                </ul>

                <div className={s.tierCta}>
                  <button
                    type="button"
                    className={`btn ${tr.featured ? "btn--amber" : "btn--ghost"}`}
                    onClick={() => openBooking(tr.id)}
                  >
                    {t.services.cta}
                    <ArrowRight className="btn-arrow" size={14} />
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ---------- Add-ons + bundles ---------- */}
        <div className={s.extras}>
          <Reveal className={s.panel}>
            <div className={s.panelHead}>
              <h3 className={s.panelTitle}>{t.services.addonsTitle}</h3>
              <span className="meta">{t.services.addonsNote}</span>
            </div>

            {addons.map((a) => {
              const on = addOns.includes(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  className={s.addOn}
                  data-on={on}
                  aria-pressed={on}
                  onClick={() => toggleAddOn(a.id)}
                >
                  <span className={s.addBox} aria-hidden>
                    {on ? <Check size={13} /> : <Plus size={13} />}
                  </span>
                  <span className={s.addText}>
                    <span className={s.addName}>{a.name}</span>
                    <span className={s.addNote}>{a.note}</span>
                  </span>
                  <span className={s.addPrice}>+${a.price}</span>
                </button>
              );
            })}

            <div className={s.runningTotal}>
              <span className="micro">
                {base.name}
                {extras > 0 && ` + ${addOns.length} add-on${addOns.length > 1 ? "s" : ""}`}
                {base.from && " (from)"}
              </span>
              <span className={s.totalNum}>
                ${total}
                {base.from ? "+" : ""} CAD
              </span>
              <button
                type="button"
                className="btn btn--solid btn--sm"
                onClick={() => openBooking(base.id)}
              >
                {t.services.cta}
                <ArrowRight className="btn-arrow" size={13} />
              </button>
            </div>
          </Reveal>

          <Reveal className={s.bundles} delay={100}>
            <h3 className={s.panelTitle} style={{ marginBottom: 2 }}>{t.services.bundlesTitle}</h3>
            {bundles.map((b) => (
              <div className={s.bundle} key={b.id}>
                <div className={s.bundleBody}>
                  <div className={s.bundleName}>{b.name}</div>
                  <p className={s.bundleDetail}>{b.detail}</p>
                </div>
                <div className={s.bundlePrice}>
                  <b>{b.price}</b>
                  {b.unit && <small>{b.unit}</small>}
                  {b.save && <span className={s.bundlePer}>{b.save}</span>}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
