"use client";

import { useState } from "react";
import s from "./Booking.module.css";
import { useLocalizedTiers, useLocalizedAddons } from "@/lib/useLocalizedContent";
import { ArrowRight, Check, Chevron, IconClock, IconGlobe, IconShield } from "./Icons";
import { useBooking } from "./BookingProvider";
import { useLocale } from "./LocaleProvider";
import Reveal from "./Reveal";

const PAIR_BUTTONS = [1, 2, 3, 4, 5, 6];

/** Navigation stack entry. Pushed on every forward step, popped on Back —
 *  this lets Back retrace the exact path taken through the per-pair loop. */
type Stage =
  | { kind: "pairs" }
  | { kind: "service"; pairIndex: number }
  | { kind: "addons"; pairIndex: number }
  | { kind: "quoteCount" }
  | { kind: "quoteForm" }
  | { kind: "schedule" }
  | { kind: "contact" };

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
  const { pairs, setPairs, pairTiers, setPairTier, pairAddOns, togglePairAddOn } = useBooking();
  const { t, locale } = useLocale();
  const tiers = useLocalizedTiers();
  const addons = useLocalizedAddons();

  const [history, setHistory] = useState<Stage[]>([{ kind: "pairs" }]);
  const stage = history[history.length - 1];

  const [done, setDone] = useState(false);
  const [submissionType, setSubmissionType] = useState<"booking" | "quote" | null>(null);

  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<"morning" | "afternoon" | "evening">("morning");
  const [photoCount, setPhotoCount] = useState(0);

  const [quotePairCount, setQuotePairCount] = useState("");
  const [quotePickup, setQuotePickup] = useState<"pickup" | "dropoff">("pickup");

  function goTo(next: Stage) {
    setHistory((prev) => [...prev, next]);
  }
  function goBack() {
    setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }
  function resetAll() {
    setHistory([{ kind: "pairs" }]);
    setDone(false);
    setSubmissionType(null);
    setDate(null);
    setTime("morning");
    setPhotoCount(0);
    setQuotePairCount("");
    setQuotePickup("pickup");
  }

  function advanceAfterAddons(pairIndex: number) {
    if (pairIndex + 1 < pairs) goTo({ kind: "service", pairIndex: pairIndex + 1 });
    else goTo({ kind: "schedule" });
  }

  const inQuoteBranch = history.some((st) => st.kind === "quoteCount" || st.kind === "quoteForm");
  const totalSteps = inQuoteBranch ? 3 : 2 * Math.min(Math.max(pairs, 1), 6) + 3;
  const stepNumber = history.length;

  const groupIndexes = !inQuoteBranch && pairs <= 6 ? Array.from({ length: pairs }, (_, i) => i) : [];
  const pairSummaries = groupIndexes.map((i) => {
    const tr = tiers.find((tr) => tr.id === pairTiers[i]) ?? tiers[1];
    const ids = pairAddOns[i] ?? [];
    const items = addons.filter((a) => ids.includes(a.id));
    const addonsTotal = items.reduce((n, a) => n + a.price, 0);
    return { pairNum: i + 1, tier: tr, items, subtotal: tr.price + addonsTotal };
  });
  const total = pairSummaries.reduce((n, p) => n + p.subtotal, 0);

  const quoteCountValid = /^\d+$/.test(quotePairCount.trim()) && Number(quotePairCount) > 0;

  let title = "";
  switch (stage.kind) {
    case "pairs": title = t.booking.pairsQuestion; break;
    case "service": title = `${t.booking.pairLabel} ${stage.pairIndex + 1}: ${t.booking.serviceQuestion}`; break;
    case "addons": title = `${t.booking.pairLabel} ${stage.pairIndex + 1}: ${t.booking.addonsQuestion}`; break;
    case "quoteCount": title = t.booking.quoteCountTitle; break;
    case "quoteForm": title = t.booking.quoteFormTitle; break;
    case "schedule": title = t.booking.dateQuestion; break;
    case "contact": title = t.booking.contactQuestion; break;
  }

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
                <h2 className={s.doneTitle}>
                  {submissionType === "quote" ? t.booking.quoteDoneTitle : t.booking.doneTitle}
                </h2>
                <p className={s.doneCopy}>
                  {submissionType === "quote" ? t.booking.quoteDoneCopy : t.booking.doneCopy}
                </p>

                {submissionType !== "quote" && (
                  <p className={s.doneBox}>
                    <IconShield size={16} />
                    <span>
                      {t.booking.doneStep1} · {t.booking.doneStep2} · {t.booking.doneStep3}
                      <br />
                      {t.booking.donePrep}
                    </span>
                  </p>
                )}

                <div className={s.doneActions}>
                  <button type="button" className="btn btn--ghost" onClick={resetAll}>
                    {t.booking.doneChange}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={s.head}>
                  <div className={s.headText}>
                    <h3 className={s.title}>{title}</h3>
                    <p className={s.sub}>{t.booking.stepWord} {stepNumber} {t.booking.ofWord} {totalSteps}</p>
                  </div>
                </div>

                <div className={s.progress}>
                  {Array.from({ length: totalSteps }, (_, i) => i + 1).map((n) => (
                    <span key={n} className={s.dot} data-on={n <= stepNumber} />
                  ))}
                </div>

                <div className={s.body}>
                  {stage.kind === "pairs" && (
                    <div className={s.pairsRow}>
                      {PAIR_BUTTONS.map((n) => (
                        <button
                          key={n}
                          type="button"
                          className={s.pairBtn}
                          onClick={() => { setPairs(n); goTo({ kind: "service", pairIndex: 0 }); }}
                        >
                          {n}
                        </button>
                      ))}
                      <button
                        type="button"
                        className={s.pairBtn}
                        onClick={() => { setPairs(7); goTo({ kind: "quoteCount" }); }}
                      >
                        7+
                      </button>
                    </div>
                  )}

                  {stage.kind === "service" && (
                    <div className={s.options}>
                      {tiers.map((tr) => (
                        <button
                          key={tr.id}
                          type="button"
                          className={s.option}
                          data-on={pairTiers[stage.pairIndex] === tr.id}
                          aria-pressed={pairTiers[stage.pairIndex] === tr.id}
                          onClick={() => {
                            setPairTier(stage.pairIndex, tr.id);
                            goTo({ kind: "addons", pairIndex: stage.pairIndex });
                          }}
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
                  )}

                  {stage.kind === "addons" && (
                    <div className={s.addGrid}>
                      {addons.map((a) => {
                        const on = (pairAddOns[stage.pairIndex] ?? []).includes(a.id);
                        return (
                          <button
                            key={a.id}
                            type="button"
                            className={s.option}
                            data-on={on}
                            aria-pressed={on}
                            onClick={() => togglePairAddOn(stage.pairIndex, a.id)}
                          >
                            <span className={s.tick} aria-hidden><Check size={12} /></span>
                            <span className={s.optText}>
                              <span className={s.optName}>{a.name}</span>
                            </span>
                            <span className={s.optPrice}>+${a.price}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {stage.kind === "quoteCount" && (
                    <>
                      <div className={s.field}>
                        <label className={s.label} htmlFor="b-quote-count">{t.booking.quoteCountLabel}</label>
                        <input
                          className={s.input}
                          id="b-quote-count"
                          type="number"
                          inputMode="numeric"
                          min={7}
                          value={quotePairCount}
                          onChange={(e) => setQuotePairCount(e.target.value)}
                          placeholder="7"
                        />
                      </div>
                      <p className={s.footNote}>{t.booking.quoteCountNote}</p>
                    </>
                  )}

                  {stage.kind === "quoteForm" && (
                    <form
                      id="quote-form"
                      className={s.fields}
                      onSubmit={(e) => { e.preventDefault(); setSubmissionType("quote"); setDone(true); }}
                    >
                      <p className={s.footNote}>{t.booking.quoteFormIntro}</p>
                      <div className={s.pair}>
                        <div className={s.field}>
                          <label className={s.label} htmlFor="q-name">{t.booking.name}</label>
                          <input className={s.input} id="q-name" name="name" type="text"
                                 autoComplete="name" required />
                        </div>
                        <div className={s.field}>
                          <label className={s.label} htmlFor="q-phone">{t.booking.phone}</label>
                          <input className={s.input} id="q-phone" name="phone" type="tel"
                                 autoComplete="tel" placeholder="(514) 000-0000" required />
                        </div>
                      </div>

                      <div className={s.field}>
                        <label className={s.label} htmlFor="q-email">{t.booking.email}</label>
                        <input className={s.input} id="q-email" name="email" type="email"
                               autoComplete="email" placeholder="you@example.com" required />
                      </div>

                      <div className={s.gap}>
                        <p className={s.sectionLabel}>{t.booking.pickupPreference}</p>
                        <div className={s.deliveryRow}>
                          <button
                            type="button"
                            className={s.option}
                            data-on={quotePickup === "pickup"}
                            aria-pressed={quotePickup === "pickup"}
                            onClick={() => setQuotePickup("pickup")}
                          >
                            <span className={s.tick} aria-hidden><Check size={12} /></span>
                            <span className={s.optText}>
                              <span className={s.optName}>{t.booking.pickup}</span>
                            </span>
                          </button>
                          <button
                            type="button"
                            className={s.option}
                            data-on={quotePickup === "dropoff"}
                            aria-pressed={quotePickup === "dropoff"}
                            onClick={() => setQuotePickup("dropoff")}
                          >
                            <span className={s.tick} aria-hidden><Check size={12} /></span>
                            <span className={s.optText}>
                              <span className={s.optName}>{t.booking.dropoff}</span>
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className={s.field}>
                        <label className={s.label} htmlFor="q-notes">{t.booking.notes}</label>
                        <textarea className={s.textarea} id="q-notes" name="notes"
                                  placeholder={t.booking.notesPlaceholder} />
                      </div>
                    </form>
                  )}

                  {stage.kind === "schedule" && (
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
                    </>
                  )}

                  {stage.kind === "contact" && (
                    <form
                      id="booking-form"
                      className={s.fields}
                      onSubmit={(e) => { e.preventDefault(); setSubmissionType("booking"); setDone(true); }}
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

                  {/* Running price summary — hidden on the custom-quote branch */}
                  {!inQuoteBranch && (
                    <div className={s.summary}>
                      {pairSummaries.map((p) => (
                        <div className={s.sumRow} key={p.pairNum}>
                          <span>{t.booking.pairLabel} {p.pairNum} — {p.tier.name}{p.items.length > 0 && ` + ${p.items.length}`}</span>
                          <span>${p.subtotal}</span>
                        </div>
                      ))}
                      <div className={s.sumTotal}>
                        <span className="micro">{t.booking.estimatedTotal}</span>
                        <b>${total} CAD</b>
                      </div>
                    </div>
                  )}
                </div>

                <div className={s.foot}>
                  {history.length > 1 && (
                    <button type="button" className="btn btn--ghost" onClick={goBack}>
                      {t.booking.back}
                    </button>
                  )}
                  <p className={s.footNote}>{t.booking.footNote}</p>

                  {stage.kind === "addons" && (
                    <button
                      type="button"
                      className="btn btn--blue btn--lg"
                      onClick={() => advanceAfterAddons(stage.pairIndex)}
                    >
                      {(pairAddOns[stage.pairIndex] ?? []).length > 0 ? t.booking.continue : t.booking.noAddons}
                      <ArrowRight className="btn-arrow" size={15} />
                    </button>
                  )}

                  {stage.kind === "quoteCount" && (
                    <button
                      type="button"
                      className="btn btn--blue btn--lg"
                      disabled={!quoteCountValid}
                      onClick={() => goTo({ kind: "quoteForm" })}
                    >
                      {t.booking.continue}
                      <ArrowRight className="btn-arrow" size={15} />
                    </button>
                  )}

                  {stage.kind === "quoteForm" && (
                    <button type="submit" form="quote-form" className="btn btn--blue btn--lg">
                      {t.booking.requestQuote}
                      <ArrowRight className="btn-arrow" size={15} />
                    </button>
                  )}

                  {stage.kind === "schedule" && (
                    <button
                      type="button"
                      className="btn btn--blue btn--lg"
                      disabled={date === null}
                      onClick={() => goTo({ kind: "contact" })}
                    >
                      {t.booking.continue}
                      <ArrowRight className="btn-arrow" size={15} />
                    </button>
                  )}

                  {stage.kind === "contact" && (
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
