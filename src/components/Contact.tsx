"use client";

import { useState } from "react";
import s from "./Contact.module.css";
import MontrealMap from "./MontrealMap";
import { ArrowRight, IconPin, IconClock, IconGlobe, IconShield } from "./Icons";
import Reveal from "./Reveal";
import { CITY } from "@/lib/content";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section className={s.sec} id="contact">
      <div className="shell">
        <div className={s.grid}>
          {/* ---------- Left: the form ---------- */}
          <Reveal className={s.panel}>
            <span className="eyebrow">Contact us</span>
            <h2 className={`h2 ${s.title}`}>
              Have a question? <em>We&rsquo;re here.</em>
            </h2>
            <p className={`lede ${s.sub}`}>
              Not sure which service a pair needs? Send a photo and we&rsquo;ll
              tell you straight.
            </p>

            <form
              className={s.form}
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className={s.pair}>
                <div className={s.field}>
                  <label className={s.label} htmlFor="c-name">Name</label>
                  <input className={s.input} id="c-name" name="name" type="text"
                         autoComplete="name" placeholder="Your name" required />
                </div>
                <div className={s.field}>
                  <label className={s.label} htmlFor="c-phone">Phone</label>
                  <input className={s.input} id="c-phone" name="phone" type="tel"
                         autoComplete="tel" placeholder="(514) 000-0000" />
                </div>
              </div>

              <div className={s.field}>
                <label className={s.label} htmlFor="c-email">Email</label>
                <input className={s.input} id="c-email" name="email" type="email"
                       autoComplete="email" placeholder="you@example.com" required />
              </div>

              <div className={s.field}>
                <label className={s.label} htmlFor="c-message">Message</label>
                <textarea className={s.textarea} id="c-message" name="message"
                          placeholder="Tell us about the pair — material, what happened to it, how soon you need it back." />
              </div>

              <div className={s.submitRow}>
                <button type="submit" className="btn btn--solid btn--lg">
                  Contact Us
                  <ArrowRight className="btn-arrow" size={15} />
                </button>
                <p className={s.legal}>
                  We reply in English or French, usually within one business day.
                </p>
              </div>

              {sent && (
                <p className={s.sent} role="status">
                  <IconShield size={15} />
                  <span>
                    <b>Not sent yet.</b> This form has no backend wired up — connect
                    it to your inbox or CRM (the handler lives in{" "}
                    <code>Contact.tsx</code>) and this message becomes a real
                    submission.
                  </span>
                </p>
              )}
            </form>
          </Reveal>

          {/* ---------- Right: location ---------- */}
          <Reveal className={s.mapPlate} delay={90}>
            <div className={s.map}><MontrealMap /></div>
            <span className={s.mapScrim} aria-hidden />

            <div className={s.pin} aria-hidden>
              <span className={s.pinDot}>
                <span className={s.pinPulse} />
                <IconPin size={16} />
              </span>
              <span className={s.pinLabel}>Serving Montreal</span>
            </div>

            <div className={s.mapInner}>
              <h3 className={s.city}>{CITY}</h3>
              <p className={s.cityNote}>
                We work across the island. Drop-off details and the exact address
                are confirmed when you book.
              </p>

              <div className={s.details}>
                <span className={s.detail}>
                  <IconClock size={16} />
                  <span><b>Turnaround</b> · 3–5 days standard, rush available</span>
                </span>
                <span className={s.detail}>
                  <IconGlobe size={16} />
                  <span><b>Service</b> · English &amp; French</span>
                </span>
                <span className={s.detail}>
                  <IconPin size={16} />
                  <span><b>Coverage</b> · Greater Montreal</span>
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
