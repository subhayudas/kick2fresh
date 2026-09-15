"use client";

import { useEffect, useRef, useState } from "react";
import s from "./BookingModal.module.css";
import { TIERS, ADDONS } from "@/lib/content";
import { ArrowRight, Check, Plus, IconShield } from "./Icons";
import { useBooking } from "./BookingProvider";

/**
 * Two-step booking. Replaces the old four-step quote funnel: the price is
 * visible from the first screen and never hidden behind a form.
 *
 * NOTE: there is no backend, payment processor or calendar integration wired
 * up. `handleSubmit` deliberately does NOT claim a booking was made — it hands
 * back a request summary and says what still needs connecting.
 */
export default function BookingModal() {
  const { open, closeBooking, tier, setTier, addOns, toggleAddOn } = useBooking();
  const [step, setStep] = useState<1 | 2>(1);
  const [done, setDone] = useState(false);
  const [pairs, setPairs] = useState(1);
  const modalRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  const selected = TIERS.find((t) => t.id === tier) ?? TIERS[1];
  const extras = ADDONS.filter((a) => addOns.includes(a.id));
  const perPair = selected.price + extras.reduce((n, a) => n + a.price, 0);
  const total = perPair * pairs;

  useEffect(() => {
    if (open) {
      restoreFocus.current = document.activeElement as HTMLElement;
      setStep(1);
      setDone(false);
      document.body.classList.add("noscroll");
      window.setTimeout(() => modalRef.current?.focus(), 60);
    } else {
      document.body.classList.remove("noscroll");
      restoreFocus.current?.focus?.();
    }
    return () => document.body.classList.remove("noscroll");
  }, [open]);

  /* Escape to close, Tab trapped inside the dialog */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeBooking(); return; }
      if (e.key !== "Tab") return;
      const root = modalRef.current;
      if (!root) return;
      const items = root.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const list = Array.from(items).filter((el) => el.offsetParent !== null);
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeBooking]);

  return (
    <div
      className={s.overlay}
      data-open={open}
      onMouseDown={(e) => { if (e.target === e.currentTarget) closeBooking(); }}
      aria-hidden={!open}
    >
      <div
        className={s.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        ref={modalRef}
        tabIndex={-1}
      >
        {done ? (
          /* ---------------- Confirmation ---------------- */
          <div className={s.done}>
            <span className={s.doneMark} aria-hidden><Check size={26} /></span>
            <h2 className={s.doneTitle} id="booking-title">Request summary ready</h2>
            <p className={s.doneCopy}>
              {selected.name}
              {extras.length > 0 && ` + ${extras.map((e) => e.name).join(", ")}`} ·{" "}
              {pairs} pair{pairs > 1 ? "s" : ""} · ${total}
              {selected.from ? "+" : ""} CAD
            </p>

            <p className={s.doneBox}>
              <IconShield size={16} />
              <span>
                <b>Nothing has been booked yet.</b> This site has no booking backend,
                payment processor or calendar connected. Wire{" "}
                <code>handleSubmit</code> in <code>BookingModal.tsx</code> to your
                scheduling tool and this becomes a real confirmation.
              </span>
            </p>

            <div className={s.doneActions}>
              <button type="button" className="btn btn--solid" onClick={closeBooking}>
                Close
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => { setDone(false); setStep(1); }}
              >
                Change my selection
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ---------------- Header ---------------- */}
            <div className={s.head}>
              <div className={s.headText}>
                <h2 className={s.title} id="booking-title">Book your clean</h2>
                <p className={s.sub}>Two steps. The price is on screen the whole way.</p>
              </div>
              <button type="button" className={s.close} onClick={closeBooking} aria-label="Close booking">
                <span style={{ transform: "rotate(45deg)", display: "grid" }}><Plus size={16} /></span>
              </button>
            </div>

            <div className={s.rail}>
              <span className={s.railStep} data-on={step === 1}>
                <span className={s.railNum}>1</span> Choose service
              </span>
              <span className={s.railStep} data-on={step === 2}>
                <span className={s.railNum}>2</span> Your details
              </span>
            </div>

            {/* ---------------- Body ---------------- */}
            <div className={s.body}>
              {step === 1 ? (
                <>
                  <p className={s.sectionLabel}>Service</p>
                  <div className={s.options}>
                    {TIERS.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        className={s.option}
                        data-on={tier === t.id}
                        aria-pressed={tier === t.id}
                        onClick={() => setTier(t.id)}
                      >
                        <span className={s.tick} aria-hidden><Check size={12} /></span>
                        <span className={s.optText}>
                          <span className={s.optName}>{t.name}</span>
                          <span className={s.optMeta}>{t.tagline}</span>
                        </span>
                        <span className={s.optPrice}>
                          {t.priceLabel}{t.from ? "+" : ""}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className={s.gap}>
                    <p className={s.sectionLabel}>Add-ons (optional)</p>
                    <div className={s.addGrid}>
                      {ADDONS.map((a) => (
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
                </>
              ) : (
                <form
                  id="booking-form"
                  className={s.fields}
                  onSubmit={(e) => { e.preventDefault(); setDone(true); }}
                >
                  <div className={s.pair}>
                    <div className={s.field}>
                      <label className={s.label} htmlFor="b-name">Name</label>
                      <input className={s.input} id="b-name" name="name" type="text"
                             autoComplete="name" placeholder="Your name" required />
                    </div>
                    <div className={s.field}>
                      <label className={s.label} htmlFor="b-phone">Phone</label>
                      <input className={s.input} id="b-phone" name="phone" type="tel"
                             autoComplete="tel" placeholder="(514) 000-0000" required />
                    </div>
                  </div>

                  <div className={s.field}>
                    <label className={s.label} htmlFor="b-email">Email</label>
                    <input className={s.input} id="b-email" name="email" type="email"
                           autoComplete="email" placeholder="you@example.com" required />
                  </div>

                  <div className={s.pair}>
                    <div className={s.field}>
                      <label className={s.label} htmlFor="b-date">Preferred date &amp; time</label>
                      <input className={s.input} id="b-date" name="datetime" type="datetime-local" required />
                    </div>
                    <div className={s.field}>
                      <label className={s.label} htmlFor="b-pairs">Number of pairs</label>
                      <select
                        className={s.select}
                        id="b-pairs"
                        name="pairs"
                        value={pairs}
                        onChange={(e) => setPairs(Number(e.target.value))}
                      >
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>{n} pair{n > 1 ? "s" : ""}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={s.field}>
                    <label className={s.label} htmlFor="b-notes">Anything we should know?</label>
                    <textarea className={s.textarea} id="b-notes" name="notes"
                              placeholder="Material, damage, deadline, or a bundle you'd like to set up." />
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
                  <span className="micro">Estimated total</span>
                  <b>${total}{selected.from ? "+" : ""} CAD</b>
                </div>
              </div>
            </div>

            {/* ---------------- Footer ---------------- */}
            <div className={s.foot}>
              {step === 2 && (
                <button type="button" className="btn btn--ghost" onClick={() => setStep(1)}>
                  Back
                </button>
              )}
              <p className={s.footNote}>
                {selected.from
                  ? "Expert Restoration is quoted after assessment — this is the starting price."
                  : "Final price confirmed when we see the pair."}
              </p>
              {step === 1 ? (
                <button type="button" className="btn btn--amber btn--lg" onClick={() => setStep(2)}>
                  Continue to details
                  <ArrowRight className="btn-arrow" size={15} />
                </button>
              ) : (
                <button type="submit" form="booking-form" className="btn btn--amber btn--lg">
                  Confirm Booking
                  <ArrowRight className="btn-arrow" size={15} />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
