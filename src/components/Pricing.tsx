"use client";

import s from "./Pricing.module.css";
import { TIERS, ADDONS, BUNDLES } from "@/lib/content";
import { ArrowRight, Check, Plus, IconSparkle } from "./Icons";
import Reveal from "./Reveal";
import { useBooking } from "./BookingProvider";

export default function Pricing() {
  const { openBooking, addOns, toggleAddOn, tier } = useBooking();

  const base = TIERS.find((t) => t.id === (tier ?? "premium")) ?? TIERS[1];
  const extras = ADDONS.filter((a) => addOns.includes(a.id)).reduce((n, a) => n + a.price, 0);
  const total = base.price + extras;

  return (
    <section className={s.sec} id="pricing">
      <div className="shell">
        <div className={s.head}>
          <Reveal>
            <span className="eyebrow">Pricing</span>
            <h2 className={`h2 ${s.title}`}>
              No quote funnel. <em>Just prices.</em>
            </h2>
          </Reveal>
          <Reveal className={s.headRight} delay={80}>
            <p className="lede">
              Every service and add-on is listed below in Canadian dollars. Build
              your order here and it carries straight into booking.
            </p>
          </Reveal>
        </div>

        {/* ---------- Tiers ---------- */}
        <div className={s.tiers}>
          {TIERS.map((t, i) => (
            <Reveal key={t.id} delay={i * 90}>
              <div className={`${s.tier} ${t.featured ? s["tier--featured"] : ""}`}>
                {t.featured && (
                  <span className={s.ribbon}>
                    <IconSparkle size={11} /> Most chosen
                  </span>
                )}
                <div className={s.tierTop}>
                  <span className={s.num}>{t.index}</span>
                </div>
                <h3 className={s.tierName}>{t.name}</h3>
                <p className={s.tierTagline}>{t.tagline}</p>

                <p className={s.amount}>
                  <b>{t.priceLabel}</b>
                  <span>{t.from ? "CAD and up" : "CAD per pair"}</span>
                </p>

                <ul className={s.list}>
                  {t.includes.map((inc) => (
                    <li key={inc}>
                      <Check size={13} />
                      {inc}
                    </li>
                  ))}
                </ul>

                <div className={s.tierCta}>
                  <button
                    type="button"
                    className={`btn ${t.featured ? "btn--amber" : "btn--ghost"}`}
                    onClick={() => openBooking(t.id)}
                  >
                    Choose {t.name.split(" ")[0]}
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
              <h3 className={s.panelTitle}>Add-ons</h3>
              <span className="meta">Tap to add</span>
            </div>

            {ADDONS.map((a) => {
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
                Book this
                <ArrowRight className="btn-arrow" size={13} />
              </button>
            </div>
          </Reveal>

          <Reveal className={s.bundles} delay={100}>
            {BUNDLES.map((b) => (
              <div className={s.bundle} key={b.id}>
                <div className={s.bundleBody}>
                  <div className={s.bundleName}>{b.name}</div>
                  <p className={s.bundleDetail}>{b.detail}</p>
                </div>
                <div className={s.bundlePrice}>
                  <b>{b.price}</b>
                  {b.unit && <small>{b.unit}</small>}
                  {b.perPair && <span className={s.bundlePer}>{b.perPair}</span>}
                </div>
              </div>
            ))}
            <p className={s.bundleNote}>
              Bundles and the monthly plan are arranged when you book — mention the
              one you want in the notes and we&rsquo;ll set it up.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
