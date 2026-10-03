"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import s from "./Booking.module.css";
import { useLocalizedTiers, useLocalizedAddons } from "@/lib/useLocalizedContent";
import { trackBookingConversion, trackLeadConversion } from "@/lib/googleAds";
import { trackBookingSchedule, trackMeta } from "@/lib/metaPixel";
import { trackEvent } from "@/lib/analytics";
import { getAttribution, newEventId } from "@/lib/attribution";
import { CONTACT } from "@/lib/contact";
import { ArrowRight, Check, Chevron } from "./Icons";
import { useBooking } from "./BookingProvider";
import { useLocale } from "./LocaleProvider";

const PAIR_BUTTONS = [1, 2, 3, 4, 5, 6];

type Step = "service" | "contact" | "schedule" | "quote";

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
  const weekdayFmt = new Intl.DateTimeFormat(intlLocale, { weekday: "narrow" });
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
          <Chevron size={14} className={s.calNavPrev} />
        </button>
        <span className={s.calMonth}>{monthLabel}</span>
        <button
          type="button"
          className={s.calNav}
          aria-label="Next month"
          onClick={() => setView(new Date(year, month + 1, 1))}
        >
          <Chevron size={14} className={s.calNavNext} />
        </button>
      </div>
      <div className={s.calWeekdays}>
        {weekdayLabels.map((w, i) => <span key={i}>{w}</span>)}
      </div>
      <div className={s.calGrid}>
        {cells.map((d, i) => {
          if (!d) return <span key={i} aria-hidden />;
          const iso = toISO(d);
          return (
            <button
              key={iso}
              type="button"
              className={s.calDay}
              data-on={value === iso}
              disabled={d < today}
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

/** Which of the lead's identifying fields a Lead was last reported for, so going
 *  Back and re-submitting the same details never double-counts a conversion. */
const leadKey = (f: { email: string; phone: string }) => `${f.email.trim().toLowerCase()}|${f.phone.replace(/\D/g, "")}`;

export default function Booking() {
  const { isOpen, closeBooking, pairs, setPairs, tier, setTier, addOns, toggleAddOn, pairTiers, pairAddOns } =
    useBooking();
  const { t, locale } = useLocale();
  const tiers = useLocalizedTiers();
  const addons = useLocalizedAddons();

  const [step, setStep] = useState<Step>("service");
  const [done, setDone] = useState<"booking" | "quote" | null>(null);

  const [fields, setFields] = useState({ name: "", phone: "", email: "", notes: "" });
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(false);

  const [quotePairCount, setQuotePairCount] = useState(7);
  const [quotePickup, setQuotePickup] = useState<"pickup" | "dropoff">("pickup");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [slotTaken, setSlotTaken] = useState(false);

  const leadSent = useRef<{ key: string; eventId: string } | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const isQuote = pairs > 6;
  const stepOrder: Step[] = isQuote ? ["service", "quote"] : ["service", "contact", "schedule"];
  const stepNumber = stepOrder.indexOf(step) + 1;
  const totalSteps = stepOrder.length;

  // ---------- price ----------
  const pairSummaries = useMemo(() => {
    if (isQuote) return [];
    return Array.from({ length: pairs }, (_, i) => {
      const tr = tiers.find((x) => x.id === pairTiers[i]) ?? tiers[1];
      const items = addons.filter((a) => (pairAddOns[i] ?? []).includes(a.id));
      return { pairNum: i + 1, tier: tr, items, subtotal: tr.price + items.reduce((n, a) => n + a.price, 0) };
    });
  }, [isQuote, pairs, tiers, addons, pairTiers, pairAddOns]);
  const total = pairSummaries.reduce((n, p) => n + p.subtotal, 0);
  const chosenTier = tiers.find((x) => x.id === (tier ?? "premium")) ?? tiers[1];

  // ---------- availability ----------
  const refreshSlots = useCallback((forDate: string, { resetTime = true } = {}) => {
    let cancelled = false;
    setSlotsLoading(true);
    setSlotsError(false);
    if (resetTime) setTime(null);
    fetch(`/api/availability?date=${forDate}`)
      .then((res) => {
        if (!res.ok) throw new Error("availability request failed");
        return res.json();
      })
      .then((data: { slots?: string[] }) => {
        if (!cancelled) setSlots(data.slots ?? []);
      })
      .catch(() => {
        if (!cancelled) setSlotsError(true);
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!date) return;
    return refreshSlots(date);
  }, [date, refreshSlots]);

  // ---------- open / close side effects ----------
  useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add("noscroll");
    trackEvent("booking_opened");
    trackMeta("ViewContent", { content_name: "booking", currency: "CAD", value: chosenTier?.price });
    // Page behind the sheet is inert: no tab/focus/screen-reader access to it.
    const dialog = document.querySelector('[role="dialog"]');
    const inerted: Element[] = [];
    Array.from(document.body.children).forEach((el) => {
      if (el.tagName === "SCRIPT" || el.tagName === "NOSCRIPT" || (dialog && el.contains(dialog))) return;
      el.setAttribute("inert", "");
      inerted.push(el);
    });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeBooking();
    window.addEventListener("keydown", onKey);
    return () => {
      inerted.forEach((el) => el.removeAttribute("inert"));
      document.body.classList.remove("noscroll");
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Per-step funnel event + scroll back to the top of the step.
  useEffect(() => {
    if (!isOpen || done) return;
    trackEvent("booking_step_view", { step, step_number: stepNumber, total_steps: totalSteps });
    bodyRef.current?.scrollTo({ top: 0 });
    titleRef.current?.focus({ preventScroll: true });
  }, [isOpen, step, stepNumber, totalSteps, done]);

  function goBack() {
    trackEvent("booking_back", { from: step });
    const i = stepOrder.indexOf(step);
    if (i > 0) setStep(stepOrder[i - 1]);
  }

  function reset() {
    setStep("service");
    setDone(null);
    setDate(null);
    setTime(null);
    setSlots([]);
    setSubmitError(false);
    setSlotTaken(false);
    leadSent.current = null;
  }

  function onClose() {
    const wasDone = done;
    closeBooking();
    if (wasDone) reset();
  }

  /** Reports the lead once per distinct email+phone. Fire-and-forget: the visitor
   *  never waits on it, and a failure never blocks the booking. */
  function submitLead(kind: "booking" | "quote") {
    const key = leadKey(fields);
    if (leadSent.current?.key === key) return;
    const eventId = newEventId();
    leadSent.current = { key, eventId };
    const value = kind === "booking" ? total : undefined;
    const attribution = getAttribution();
    const summary =
      kind === "booking"
        ? `${pairs}x ${chosenTier.name}${addOns.length ? ` + ${addons.filter((a) => addOns.includes(a.id)).map((a) => a.name).join(", ")}` : ""} = $${total} CAD`
        : `${quotePairCount} pairs, ${quotePickup}`;

    trackMeta("Lead", { ...(value !== undefined && { value, currency: "CAD" }), content_name: kind }, eventId);
    trackLeadConversion({ transactionId: eventId, value, user: { email: fields.email, phone: fields.phone } });
    trackEvent("generate_lead", { kind, ...(value !== undefined && { value, currency: "CAD" }) });

    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        kind,
        ...fields,
        summary,
        total: value,
        pairs: kind === "quote" ? quotePairCount : pairs,
        eventId,
        attribution,
      }),
    }).catch(() => {});
  }

  async function confirmBooking() {
    if (!date || !time) return;
    setSubmitting(true);
    setSubmitError(false);
    setSlotTaken(false);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.name,
          email: fields.email,
          phone: fields.phone,
          notes: fields.notes,
          date,
          time,
          pairs: pairSummaries.map((p) => ({
            pairNum: p.pairNum,
            tierName: p.tier.name,
            addonNames: p.items.map((i) => i.name),
            subtotal: p.subtotal,
          })),
          total,
          attribution: getAttribution(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        if (data.code === "SLOT_TAKEN") {
          trackEvent("booking_slot_taken");
          setSlotTaken(true);
          refreshSlots(date);
          return;
        }
        throw new Error(data.error ?? "booking failed");
      }
      trackBookingConversion({ transactionId: data.bookingId, value: total, user: { email: fields.email, phone: fields.phone } });
      trackBookingSchedule({ value: total, eventId: data.bookingId });
      trackEvent("booking_confirmed", { value: total, currency: "CAD", pairs });
      setDone("booking");
    } catch {
      trackEvent("booking_submit_error");
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  const titles: Record<Step, string> = {
    service: t.booking.step1Title,
    contact: t.booking.step2Title,
    schedule: t.booking.step3Title,
    quote: t.booking.quoteFormTitle,
  };

  const contactValid =
    fields.name.trim().length > 1 && fields.phone.replace(/\D/g, "").length >= 10 && /\S+@\S+\.\S+/.test(fields.email);

  const field = (name: keyof typeof fields) => ({
    value: fields[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((f) => ({ ...f, [name]: e.target.value })),
  });

  const contactFields = (
    <div className={s.fields}>
      <label className={s.field}>
        <span className={s.label}>{t.booking.name}</span>
        <input className={s.input} name="name" type="text" autoComplete="name" required {...field("name")} />
      </label>
      <label className={s.field}>
        <span className={s.label}>{t.booking.phone}</span>
        <input
          className={s.input}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(514) 000-0000"
          pattern="[0-9+()\-\s.]{10,}"
          title="10-digit mobile number"
          required
          {...field("phone")}
        />
      </label>
      <label className={s.field}>
        <span className={s.label}>{t.booking.email}</span>
        <input
          className={s.input}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          {...field("email")}
        />
      </label>
      <label className={s.field}>
        <span className={s.label}>{t.booking.notes}</span>
        <textarea className={s.textarea} name="notes" rows={2} placeholder={t.booking.notesPlaceholder} {...field("notes")} />
      </label>
    </div>
  );

  return (
    <div className={s.overlay} role="dialog" aria-modal="true" aria-label={t.booking.sheetLabel}>
      <div className={s.sheet}>
        {/* ---------- header ---------- */}
        <header className={s.head}>
          {!done && step !== "service" ? (
            <button type="button" className={s.iconBtn} onClick={goBack} aria-label={t.booking.back}>
              <Chevron size={18} className={s.backIcon} />
            </button>
          ) : (
            <span className={s.iconSpacer} />
          )}
          <div className={s.headMid}>
            {!done && (
              <>
                <span className={s.stepLabel}>
                  {t.booking.stepWord} {stepNumber} {t.booking.ofWord} {totalSteps}
                </span>
                <div className={s.progress} aria-hidden>
                  <div className={s.progressFill} style={{ width: `${(stepNumber / totalSteps) * 100}%` }} />
                </div>
              </>
            )}
          </div>
          <button type="button" className={s.iconBtn} onClick={onClose} aria-label={t.booking.close}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        {/* ---------- body ---------- */}
        <div className={s.body} ref={bodyRef}>
          {done ? (
            <div className={s.done}>
              <span className={s.doneMark} aria-hidden><Check size={28} /></span>
              <h2 className={s.doneTitle}>
                {done === "quote" ? t.booking.quoteDoneTitle : t.booking.doneTitle}
              </h2>
              <p className={s.doneCopy}>
                {done === "quote" ? t.booking.quoteDoneCopy : t.booking.doneCopy}
              </p>
              {done === "booking" && (
                <>
                  <p className={s.doneNext}>{t.booking.doneNext}</p>
                  <ol className={s.doneSteps}>
                    {[t.booking.doneStep1, t.booking.doneStep2, t.booking.doneStep3].map((x, i) => (
                      <li key={x}><span>{i + 1}</span>{x}</li>
                    ))}
                  </ol>
                </>
              )}
              {CONTACT.telHref && (
                <a className="btn btn--ghost btn--block" href={CONTACT.telHref}>{CONTACT.phoneLabel}</a>
              )}
            </div>
          ) : (
            <>
              <h2 className={s.title} ref={titleRef} tabIndex={-1}>{titles[step]}</h2>

              {/* ----- step 1: pairs + service + add-ons ----- */}
              {step === "service" && (
                <>
                  <p className={s.sectionLabel}>{t.booking.pairsLabel}</p>
                  <div className={s.pairsRow} role="group" aria-label={t.booking.pairsLabel}>
                    {PAIR_BUTTONS.map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={s.pairBtn}
                        data-on={pairs === n}
                        aria-pressed={pairs === n}
                        onClick={() => {
                          trackEvent("booking_pairs_selected", { pairs: n });
                          setPairs(n);
                        }}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      type="button"
                      className={s.pairBtn}
                      data-on={isQuote}
                      aria-pressed={isQuote}
                      onClick={() => {
                        trackEvent("booking_quote_started");
                        setPairs(7);
                      }}
                    >
                      {t.booking.moreThan6}
                    </button>
                  </div>

                  {isQuote ? (
                    <>
                      <p className={s.sectionLabel}>{t.booking.quoteCountLabel}</p>
                      <div className={s.stepper}>
                        <button
                          type="button"
                          className={s.stepperBtn}
                          aria-label={t.booking.quoteCountDecrease}
                          disabled={quotePairCount <= 7}
                          onClick={() => setQuotePairCount((n) => Math.max(7, n - 1))}
                        >
                          −
                        </button>
                        <span className={s.stepperValue}>{quotePairCount}</span>
                        <button
                          type="button"
                          className={s.stepperBtn}
                          aria-label={t.booking.quoteCountIncrease}
                          onClick={() => setQuotePairCount((n) => n + 1)}
                        >
                          +
                        </button>
                      </div>
                      <p className={s.note}>{t.booking.quoteCountNote}</p>
                    </>
                  ) : (
                    <>
                      <p className={s.sectionLabel}>{t.booking.serviceLabel}</p>
                      <div className={s.options} role="radiogroup" aria-label={t.booking.serviceLabel}>
                        {tiers.map((tr) => (
                          <button
                            key={tr.id}
                            type="button"
                            role="radio"
                            aria-checked={tier === tr.id}
                            className={s.option}
                            data-on={tier === tr.id}
                            onClick={() => {
                              trackEvent("booking_service_selected", { tier: tr.id });
                              setTier(tr.id);
                            }}
                          >
                            <span className={s.radio} aria-hidden><Check size={12} /></span>
                            <span className={s.optText}>
                              <span className={s.optName}>
                                {tr.name}
                                {tr.featured && <em className={s.badge}>{t.services.recommended}</em>}
                              </span>
                              <span className={s.optMeta}>{tr.tagline}</span>
                            </span>
                            <span className={s.optPrice}>{tr.priceLabel}</span>
                          </button>
                        ))}
                      </div>

                      <p className={s.sectionLabel}>
                        {t.booking.addonsLabel}
                        <span>{t.booking.addonsNote}</span>
                      </p>
                      <div className={s.chips}>
                        {addons.map((a) => {
                          const on = addOns.includes(a.id);
                          return (
                            <button
                              key={a.id}
                              type="button"
                              className={s.chip}
                              data-on={on}
                              aria-pressed={on}
                              onClick={() => {
                                trackEvent("booking_addon_toggled", { addon: a.id, on: !on });
                                toggleAddOn(a.id);
                              }}
                            >
                              {on && <Check size={12} />}
                              {a.name} <b>+${a.price}</b>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </>
              )}

              {/* ----- step 2: contact (lead is captured here) ----- */}
              {step === "contact" && (
                <form
                  id="contact-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!contactValid) return;
                    submitLead("booking");
                    setStep("schedule");
                  }}
                >
                  {contactFields}
                  <p className={s.note}>{t.booking.noPayment}</p>
                </form>
              )}

              {/* ----- quote path (7+) ----- */}
              {step === "quote" && (
                <form
                  id="quote-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!contactValid) return;
                    trackEvent("booking_quote_submitted", { pairs: quotePairCount, pickup: quotePickup });
                    submitLead("quote");
                    setDone("quote");
                  }}
                >
                  {contactFields}
                  <p className={s.sectionLabel}>{t.booking.pickupPreference}</p>
                  <div className={s.options}>
                    {(["pickup", "dropoff"] as const).map((k) => (
                      <button
                        key={k}
                        type="button"
                        role="radio"
                        aria-checked={quotePickup === k}
                        className={s.option}
                        data-on={quotePickup === k}
                        onClick={() => setQuotePickup(k)}
                      >
                        <span className={s.radio} aria-hidden><Check size={12} /></span>
                        <span className={s.optText}>
                          <span className={s.optName}>{k === "pickup" ? t.booking.pickup : t.booking.dropoff}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </form>
              )}

              {/* ----- step 3: date + time ----- */}
              {step === "schedule" && (
                <>
                  <Calendar
                    value={date}
                    onChange={(iso) => {
                      trackEvent("booking_date_selected");
                      setDate(iso);
                      setSlotTaken(false);
                    }}
                    locale={locale}
                  />

                  {slotTaken && <p className={s.error}>{t.booking.slotTaken}</p>}

                  <p className={s.sectionLabel}>{t.booking.time}</p>
                  {!date && <p className={s.note}>{t.booking.pickDateFirst}</p>}
                  {date && slotsLoading && <p className={s.note}>{t.booking.timeSlotsLoading}</p>}
                  {date && !slotsLoading && slotsError && <p className={s.error}>{t.booking.timeSlotsError}</p>}
                  {date && !slotsLoading && !slotsError && slots.length === 0 && (
                    <p className={s.note}>{t.booking.timeSlotsEmpty}</p>
                  )}
                  {date && !slotsLoading && !slotsError && slots.length > 0 && (
                    <div className={s.times}>
                      {slots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          className={s.time}
                          data-on={time === slot}
                          aria-pressed={time === slot}
                          onClick={() => {
                            trackEvent("booking_time_selected");
                            setTime(slot);
                            setSlotTaken(false);
                          }}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}

                  {submitError && <p className={s.error}>{t.booking.submitError}</p>}
                </>
              )}
            </>
          )}
        </div>

        {/* ---------- sticky footer: total + the one primary action ---------- */}
        <footer className={s.foot}>
          {done ? (
            <button type="button" className="btn btn--blue btn--lg btn--block" onClick={onClose}>
              {t.booking.doneClose}
            </button>
          ) : (
            <>
              {!isQuote && (
                <div className={s.total}>
                  <span>
                    {pairs} {pairs === 1 ? t.booking.pairWord : t.booking.pairsWord} · {chosenTier.name}
                  </span>
                  <b>${total} CAD</b>
                </div>
              )}

              {step === "service" && (
                <button
                  type="button"
                  className="btn btn--blue btn--lg btn--block"
                  onClick={() => {
                    if (!isQuote) {
                      trackMeta("InitiateCheckout", { value: total, currency: "CAD", num_items: pairs });
                      trackEvent("begin_checkout", { value: total, currency: "CAD", items: pairs });
                    }
                    setStep(isQuote ? "quote" : "contact");
                  }}
                >
                  {t.booking.continue}
                  <ArrowRight className="btn-arrow" size={16} />
                </button>
              )}

              {step === "contact" && (
                <button type="submit" form="contact-form" className="btn btn--blue btn--lg btn--block">
                  {t.booking.seeTimes}
                  <ArrowRight className="btn-arrow" size={16} />
                </button>
              )}

              {step === "quote" && (
                <button type="submit" form="quote-form" className="btn btn--blue btn--lg btn--block">
                  {t.booking.requestQuote}
                  <ArrowRight className="btn-arrow" size={16} />
                </button>
              )}

              {step === "schedule" && (
                <button
                  type="button"
                  className="btn btn--blue btn--lg btn--block"
                  disabled={!date || !time || submitting}
                  onClick={confirmBooking}
                >
                  {submitting ? t.booking.submitting : t.booking.confirm}
                  {!submitting && <ArrowRight className="btn-arrow" size={16} />}
                </button>
              )}
            </>
          )}
        </footer>
      </div>
    </div>
  );
}
