"use client";

import { useState } from "react";
import s from "./Booking.module.css";
import { useLocalizedTiers, useLocalizedAddons } from "@/lib/useLocalizedContent";
import { ArrowRight, Check, Chevron, IconClock, IconGlobe, IconShield } from "./Icons";
import { useBooking } from "./BookingProvider";
import { useLocale } from "./LocaleProvider";
import Reveal from "./Reveal";

const PAIR_OPTIONS = [1, 2, 3, 4, 5, 6, 7];
type Step = 1 | 2 | 3 | 4 | 5;

function pad(n: number) {
  return n.toString().padStart(2, "0");
}
function toISO(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function Calendar({
  value,
  onChange,
  locale,
}: {
  value: string | null;
  onChange: (iso: string) => void;
  locale: "en" | "fr";
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const intlLocale = locale === "fr" ? "fr-CA" : "en-CA";
  const monthLabel = new Intl.DateTimeFormat(intlLocale, { month: "long", year: "numeric" }).format(view);
  const weekdayFmt = new Intl.DateTimeFormat(intlLocale, { weekday: "short" });
  // Jan 1 2023 was a Sunday, so this walks Sun..Sat regardless of locale.
  const weekdayLabels = Array.from({ length: 7 }, (_, i) => weekdayFmt.format(new Date(2023, 0, i + 1)));

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(new Date(year, month, d));

  return (
    <div className={s.calendar}>
      <div className={s.calHead}>
        <button
          type="button"
          className={s.calNav}
          aria-label="Previous month"
          disabled={isCurrentMonth}
          onClick={() => setView(new Date(year, month - 1, 1))}
        >
          <Chevron size={13} className={s.calNavPrev} />
        </button>
        <span className={s.calMonth}>{monthLabel}</span>
        <button
          type="button"
          className={s.calNav}
          aria-label="Next month"
          onClick={() => setView(new Date(year, month + 1, 1))}
        >
          <Chevron size={13} className={s.calNavNext} />
        </button>
      </div>
      <div className={s.calWeekdays}>
        {weekdayLabels.map((w, i) => <span key={i}>{w}</span>)}
      </div>
      <div className={s.calGrid}>
        {cells.map((d, i) => {
          if (!d) return <span key={i} className={s.calCellEmpty} aria-hidden />;
          const iso = toISO(d);
          const past = d < today;
          return (
            <button
              key={iso}
              type="button"
              className={s.calDay}
              data-on={value === iso}
              disabled={past}
              onClick={() => onChange(iso)}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Booking() {
  const { pairs, setPairs, pairTiers, setPairTier, addOns, toggleAddOn } = useBooking();
  const { t, locale } = useLocale();
  const tiers = useLocalizedTiers();
  const addons = useLocalizedAddons();

  const [step, setStep] = useState<Step>(1);
  const [done, setDone] = useState(false);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<"morning" | "afternoon" | "evening">("morning");
  const [delivery, setDelivery] = useState<"pickup" | "dropoff">("dropoff");
  const [photoCount, setPhotoCount] = useState(0);

  const groupCount = pairs <= 6 ? pairs : 1;
  const groupIndexes = Array.from({ length: groupCount }, (_, i) => i);
  const groupTiers = groupIndexes.map((i) => tiers.find((tr) => tr.id === pairTiers[i]) ?? tiers[1]);
  const extras = addons.filter((a) => addOns.includes(a.id));
  const addonsPerPair = extras.reduce((n, a) => n + a.price, 0);
  const servicesTotal = pairs <= 6
    ? groupTiers.reduce((n, tr) => n + tr.price, 0)
    : groupTiers[0].price * pairs;
  const total = servicesTotal + addonsPerPair * pairs;

  const stepTitles: Record<Step, string> = {
    1: t.booking.pairsQuestion,
    2: t.booking.serviceQuestion,
    3: t.booking.addonsQuestion,
    4: t.booking.dateQuestion,
    5: t.booking.contactQuestion,
  };

  const canContinue = step !== 4 || date !== null;

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

          {/* ---------- Right: the question-by-question form ---------- */}
          <Reveal className={s.panel} delay={80} id="booking-panel">
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
                    <h3 className={s.title}>{stepTitles[step]}</h3>
                    <p className={s.sub}>{t.booking.stepWord} {step} {t.booking.of5}</p>
                  </div>
                </div>

                <div className={s.progress}>
                  {([1, 2, 3, 4, 5] as Step[]).map((n) => (
                    <span key={n} className={s.dot} data-on={n <= step} />
                  ))}
                </div>

                <div className={s.body}>
                  {step === 1 && (
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
                  )}

                  {step === 2 && (
                    <div className={s.pairGroups}>
                      {groupIndexes.map((i) => (
                        <div className={s.pairGroup} key={i}>
                          {pairs > 6 ? null : (
                            <p className={s.pairGroupLabel}>{t.booking.pairLabel} {i + 1}</p>
                          )}
                          <div className={s.options}>
                            {tiers.map((tr) => (
                              <button
                                key={tr.id}
                                type="button"
                                className={s.option}
                                data-on={pairTiers[i] === tr.id}
                                aria-pressed={pairTiers[i] === tr.id}
                                onClick={() => setPairTier(i, tr.id)}
                              >
                                <span className={s.tick} aria-hidden><Check size={12} /></span>
                                <span className={s.optText}>
                                  <span className={s.optName}>{tr.name}</span>
                                  <span className={s.optMeta}>{tr.tagline}</span>
                                </span>
                                <span className={s.optPrice}>{tr.priceLabel}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {step === 3 && (
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
                  )}

                  {step === 4 && (
                    <>
                      <Calendar value={date} onChange={setDate} locale={locale} />

                      <div className={s.gap}>
                        <p className={s.sectionLabel}>{t.booking.time}</p>
                        <div className={s.timeRow}>
                          {(
                            [
                              ["morning", t.booking.timeMorning],
                              ["afternoon", t.booking.timeAfternoon],
                              ["evening", t.booking.timeEvening],
                            ] as const
                          ).map(([tm, label]) => (
                            <button
                              key={tm}
                              type="button"
                              className={s.option}
                              data-on={time === tm}
                              aria-pressed={time === tm}
                              onClick={() => setTime(tm)}
                            >
                              <span className={s.optText}>
                                <span className={s.optName}>{label}</span>
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className={s.gap}>
                        <p className={s.sectionLabel}>{t.booking.delivery}</p>
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
                    </>
                  )}

                  {step === 5 && (
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
                    {groupTiers.map((tr, i) => (
                      <div className={s.sumRow} key={i}>
                        <span>
                          {pairs > 6 ? `${t.booking.allPairsLabel} × ${pairs}` : `${t.booking.pairLabel} ${i + 1}`} — {tr.name}
                        </span>
                        <span>${pairs > 6 ? tr.price * pairs : tr.price}</span>
                      </div>
                    ))}
                    {extras.map((a) => (
                      <div className={s.sumRow} key={a.id}>
                        <span>{a.name} × {pairs}</span>
                        <span>+${a.price * pairs}</span>
                      </div>
                    ))}
                    <div className={s.sumTotal}>
                      <span className="micro">{t.booking.estimatedTotal}</span>
                      <b>${total} CAD</b>
                    </div>
                  </div>
                </div>

                <div className={s.foot}>
                  {step > 1 && (
                    <button type="button" className="btn btn--ghost" onClick={() => setStep((v) => (v - 1) as Step)}>
                      {t.booking.back}
                    </button>
                  )}
                  <p className={s.footNote}>{t.booking.footNote}</p>
                  {step < 5 ? (
                    <button
                      type="button"
                      className="btn btn--blue btn--lg"
                      disabled={!canContinue}
                      onClick={() => setStep((v) => (v + 1) as Step)}
                    >
                      {t.booking.continue}
                      <ArrowRight className="btn-arrow" size={15} />
                    </button>
                  ) : (
                    <button type="submit" form="booking-form" className="btn btn--blue btn--lg">
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
