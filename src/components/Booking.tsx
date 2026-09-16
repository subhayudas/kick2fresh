"use client";

import { useState } from "react";
import s from "./Booking.module.css";
import { useLocalizedTiers, useLocalizedAddons } from "@/lib/useLocalizedContent";
import { ArrowRight, Check, IconClock, IconGlobe, IconShield } from "./Icons";
import { useBooking } from "./BookingProvider";
import { useLocale } from "./LocaleProvider";
import Reveal from "./Reveal";

const PAIR_OPTIONS = [1, 2, 3, 4, 5, 6, 7];

export default function Booking() {
  const { tier, setTier, addOns, toggleAddOn, pairs, setPairs } = useBooking();
  const { t } = useLocale();
  const tiers = useLocalizedTiers();
  const addons = useLocalizedAddons();

  const [step, setStep] = useState<1 | 2>(1);
  const [done, setDone] = useState(false);
  const [delivery, setDelivery] = useState<"pickup" | "dropoff">("dropoff");
  const [time, setTime] = useState<"morning" | "afternoon" | "evening">("morning");
  const [photoCount, setPhotoCount] = useState(0);

  const selected = tiers.find((tr) => tr.id === tier) ?? tiers[1];
  const extras = addons.filter((a) => addOns.includes(a.id));
  const perPair = selected.price + extras.reduce((n, a) => n + a.price, 0);
  const total = perPair * pairs;

  return (
    <section className={s.sec} id="booking">
      <div className="shell">
        <div className={s.grid}>
          {/* ---------- Left: trust copy ---------- */}
          <Reveal className={s.left}>
            <span className="eyebrow">{t.booking.eyebrow}</span>
            <h2 className={`h2 ${s.leftTitle}`}>{t.booking.title}</h2>
            <p className={`lede ${s.leftSub}`}>{t.booking.subtitle}</p>

            <div className={s.guarantees}>
              <span className={s.guarantee}><IconShield size={16} />{t.booking.guarantee1}</span>
              <span className={s.guarantee}><IconClock size={16} />{t.booking.guarantee2}</span>
              <span className={s.guarantee}><IconGlobe size={16} />{t.booking.guarantee3}</span>
            </div>

            <div className={`${s.trustBar} card`}>
              <span className={s.avatars} aria-hidden>
                {[0, 1, 2, 3].map((n) => <span className={s.avatar} key={n} />)}
              </span>
              <p className={s.trustCopy}>{t.booking.trustBar}</p>
            </div>
          </Reveal>

          {/* ---------- Right: the real 2-step form ---------- */}
          <Reveal className={s.panel} delay={80}>
            {done ? (
              <div className={s.done}>
                <span className={s.doneMark} aria-hidden><Check size={26} /></span>
                <h2 className={s.doneTitle}>{t.booking.doneTitle}</h2>
                <p className={s.doneCopy}>{t.booking.doneCopy}</p>

                <p className={s.doneBox}>
                  <IconShield size={16} />
                  <span>
                    {t.booking.doneStep1} · {t.booking.doneStep2} · {t.booking.doneStep3}
                    <br />
                    {t.booking.donePrep}
                  </span>
                </p>

                <div className={s.doneActions}>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => { setDone(false); setStep(1); }}
                  >
                    {t.booking.doneChange}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={s.head}>
                  <div className={s.headText}>
                    <h3 className={s.title}>{t.booking.chooseService}</h3>
                    <p className={s.sub}>{step === 1 ? t.booking.step1of2 : t.booking.step2of2}</p>
                  </div>
                </div>

                <div className={s.rail}>
                  <span className={s.railStep} data-on={step === 1}>
                    <span className={s.railNum}>1</span> {t.booking.chooseService}
                  </span>
                  <span className={s.railStep} data-on={step === 2}>
                    <span className={s.railNum}>2</span> {t.booking.yourDetails}
                  </span>
                </div>

                <div className={s.body}>
                  {step === 1 ? (
                    <>
                      <p className={s.sectionLabel}>{t.booking.chooseService}</p>
                      <div className={s.options}>
                        {tiers.map((tr) => (
                          <button
                            key={tr.id}
                            type="button"
                            className={s.option}
                            data-on={tier === tr.id}
                            aria-pressed={tier === tr.id}
                            onClick={() => setTier(tr.id)}
                          >
                            <span className={s.tick} aria-hidden><Check size={12} /></span>
                            <span className={s.optText}>
                              <span className={s.optName}>{tr.name}</span>
                              <span className={s.optMeta}>{tr.tagline}</span>
                            </span>
                            <span className={s.optPrice}>
                              {tr.priceLabel}{tr.from ? "+" : ""}
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className={s.gap}>
                        <p className={s.sectionLabel}>{t.booking.addonsOptional}</p>
                        <div className={s.addGrid}>
                          {addons.map((a) => (
                            <button
                              key={a.id}
                              type="button"
                              className={s.option}
                              data-on={addOns.includes(a.id)}
                              aria-pressed={addOns.includes(a.id)}
                              onClick={() => toggleAddOn(a.id)}
                            >
                              <span className={s.tick} aria-hidden><Check size={12} /></span>
                              <span className={s.optText}>
                                <span className={s.optName}>{a.name}</span>
                              </span>
                              <span className={s.optPrice}>+${a.price}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className={s.gap}>
                        <p className={s.sectionLabel}>{t.booking.pairsLabel}</p>
                        <div className={s.pairsRow}>
                          {PAIR_OPTIONS.map((n) => (
                            <button
                              key={n}
                              type="button"
                              className={s.pairBtn}
                              data-on={pairs === n}
                              aria-pressed={pairs === n}
                              onClick={() => setPairs(n)}
                            >
                              {n === 7 ? "7+" : n}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <form
                      id="booking-form"
                      className={s.fields}
                      onSubmit={(e) => { e.preventDefault(); setDone(true); }}
                    >
                      <div className={s.pair}>
                        <div className={s.field}>
                          <label className={s.label} htmlFor="b-name">{t.booking.name}</label>
                          <input className={s.input} id="b-name" name="name" type="text"
                                 autoComplete="name" required />
                        </div>
                        <div className={s.field}>
                          <label className={s.label} htmlFor="b-phone">{t.booking.phone}</label>
                          <input className={s.input} id="b-phone" name="phone" type="tel"
                                 autoComplete="tel" placeholder="(514) 000-0000" required />
                        </div>
                      </div>

                      <div className={s.field}>
                        <label className={s.label} htmlFor="b-email">{t.booking.email}</label>
                        <input className={s.input} id="b-email" name="email" type="email"
                               autoComplete="email" placeholder="you@example.com" required />
                      </div>

                      <div className={s.pair}>
                        <div className={s.field}>
                          <label className={s.label} htmlFor="b-date">{t.booking.date}</label>
                          <input className={s.input} id="b-date" name="date" type="date" required />
                        </div>
                        <div className={s.field}>
                          <label className={s.label} htmlFor="b-time">{t.booking.time}</label>
                          <select
                            className={s.select}
                            id="b-time"
                            name="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value as typeof time)}
                          >
                            <option value="morning">{t.booking.timeMorning}</option>
                            <option value="afternoon">{t.booking.timeAfternoon}</option>
                            <option value="evening">{t.booking.timeEvening}</option>
                          </select>
                        </div>
                      </div>

                      <div className={s.field}>
                        <span className={s.label}>{t.booking.delivery}</span>
                        <div className={s.deliveryRow}>
                          <button
                            type="button"
                            className={s.option}
                            data-on={delivery === "pickup"}
                            aria-pressed={delivery === "pickup"}
                            onClick={() => setDelivery("pickup")}
                          >
                            <span className={s.tick} aria-hidden><Check size={12} /></span>
                            <span className={s.optText}>
                              <span className={s.optName}>{t.booking.pickup}</span>
                            </span>
                          </button>
                          <button
                            type="button"
                            className={s.option}
                            data-on={delivery === "dropoff"}
                            aria-pressed={delivery === "dropoff"}
                            onClick={() => setDelivery("dropoff")}
                          >
                            <span className={s.tick} aria-hidden><Check size={12} /></span>
                            <span className={s.optText}>
                              <span className={s.optName}>{t.booking.dropoff}</span>
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className={s.field}>
                        <label className={s.label} htmlFor="b-photos">{t.booking.photos}</label>
                        <label className={s.fileLabel} htmlFor="b-photos" data-has={photoCount > 0}>
                          {photoCount > 0 ? `${photoCount} photo${photoCount > 1 ? "s" : ""} selected` : t.booking.photosNote}
                        </label>
                        <input
                          id="b-photos"
                          name="photos"
                          type="file"
                          accept="image/*"
                          multiple
                          className="sr-only"
                          onChange={(e) => setPhotoCount(e.target.files?.length ?? 0)}
                        />
                      </div>

                      <div className={s.field}>
                        <label className={s.label} htmlFor="b-notes">{t.booking.notes}</label>
                        <textarea className={s.textarea} id="b-notes" name="notes"
                                  placeholder={t.booking.notesPlaceholder} />
                      </div>
                    </form>
                  )}

                  {/* Running summary — always visible, never hidden behind a step */}
                  <div className={s.summary}>
                    <div className={s.sumRow}>
                      <span>{selected.name}</span>
                      <span>${selected.price}{selected.from ? "+" : ""}</span>
                    </div>
                    {extras.map((a) => (
                      <div className={s.sumRow} key={a.id}>
                        <span>{a.name}</span>
                        <span>+${a.price}</span>
                      </div>
                    ))}
                    {pairs > 1 && (
                      <div className={s.sumRow}>
                        <span>× {pairs} pairs</span>
                        <span>${perPair} each</span>
                      </div>
                    )}
                    <div className={s.sumTotal}>
                      <span className="micro">{t.booking.estimatedTotal}</span>
                      <b>${total}{selected.from ? "+" : ""} CAD</b>
                    </div>
                  </div>
                </div>

                <div className={s.foot}>
                  {step === 2 && (
                    <button type="button" className="btn btn--ghost" onClick={() => setStep(1)}>
                      {t.booking.back}
                    </button>
                  )}
                  <p className={s.footNote}>{t.booking.footNote}</p>
                  {step === 1 ? (
                    <button type="button" className="btn btn--amber btn--lg" onClick={() => setStep(2)}>
                      {t.booking.continue}
                      <ArrowRight className="btn-arrow" size={15} />
                    </button>
                  ) : (
                    <button type="submit" form="booking-form" className="btn btn--amber btn--lg">
                      {t.booking.confirm}
                      <ArrowRight className="btn-arrow" size={15} />
                    </button>
                  )}
                </div>
              </>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
