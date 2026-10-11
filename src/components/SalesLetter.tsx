"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import s from "./SalesLetter.module.css";
import { LocaleProvider, useLocale } from "./LocaleProvider";
import ContactLinks from "./ContactLinks";
import Reveal from "./Reveal";
import { ArrowRight, Check, IconShield, Star } from "./Icons";
import { hasDirectContact } from "@/lib/contact";
import { LETTER } from "@/lib/letterCopy";
import { ALL_REVIEWS, GALLERY } from "@/lib/content";
import { trackEvent } from "@/lib/analytics";
import { trackMeta } from "@/lib/metaPixel";
import { trackLeadConversion } from "@/lib/googleAds";
import { getAttribution, newEventId } from "@/lib/attribution";

/* Collector sales letter for paid traffic. High-ticket, so: no prices, no
   self-serve checkout. Every CTA leads to one short application (a private
   assessment request) that posts to /api/lead as a "quote", which also texts
   the owner. Read order: promise -> story -> cost of inaction -> trust ->
   mechanism -> proof -> fit -> why no price -> standard -> application -> P.S. */

/** Luxury and collector pairs from GALLERY, with a short label for the caption. */
const PORTFOLIO: { i: number; label: string }[] = [
  { i: 0, label: "Louis Vuitton Trainer" },
  { i: 8, label: "Rick Owens" },
  { i: 11, label: "Christian Louboutin" },
  { i: 10, label: "Louis Vuitton Trainer" },
  { i: 1, label: "Air Jordan 4" },
  { i: 6, label: "Air Jordan 1 Patent" },
];
const HERO = GALLERY[7];
/** Reviews about collections, volume, high stakes. Indexes into ALL_REVIEWS. */
const VOICES = [8, 7, 0, 15, 28, 18];

const ASSESS_ID = "assessment";

function goToForm(source: string) {
  trackEvent("cta_click", { source });
  trackMeta("ViewContent", { content_name: "collector_assessment", source });
  document.getElementById(ASSESS_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Stars({ size = 13 }: { size?: number }) {
  return (
    <span className={s.stars} aria-hidden>
      {[0, 1, 2, 3, 4].map((n) => <Star key={n} size={size} />)}
    </span>
  );
}

function Cta({ label, source, micro }: { label: string; source: string; micro?: string }) {
  return (
    <div className={s.ctaBlock}>
      <button type="button" className={`btn btn--blue btn--lg ${s.ctaBtn}`} onClick={() => goToForm(source)}>
        {label}
        <ArrowRight className="btn-arrow" size={16} />
      </button>
      {micro && <p className={s.ctaMicro}>{micro}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Assessment application: 3 short steps, easy questions first, contact last. */

function Choice({ text, on, onPick, multi }: { text: string; on: boolean; onPick: () => void; multi?: boolean }) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={on}
      className={s.choice}
      data-on={on || undefined}
      onClick={onPick}
    >
      <span className={s.choiceDot} data-multi={multi || undefined} aria-hidden>{on && <Check size={12} />}</span>
      {text}
    </button>
  );
}

function AssessmentForm() {
  const { locale } = useLocale();
  const f = LETTER[locale].form;
  const [step, setStep] = useState(0);
  const [size, setSize] = useState("");
  const [kinds, setKinds] = useState<string[]>([]);
  const [goal, setGoal] = useState("");
  const [timing, setTiming] = useState("");
  const [handoff, setHandoff] = useState("pickup");
  const [fields, setFields] = useState({ name: "", phone: "", email: "", notes: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    trackEvent("assessment_step_view", { step: step + 1 });
  }, [step]);

  const label = (opts: { id: string; label: string }[], id: string) => opts.find((o) => o.id === id)?.label ?? id;
  const canNext = step === 0 ? Boolean(size && kinds.length) : step === 1 ? Boolean(goal && timing) : true;
  const phoneOk = fields.phone.replace(/\D/g, "").length >= 10;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!fields.name || !fields.email || !phoneOk) return;
    setSending(true);
    setError(false);
    const eventId = newEventId();
    const pairs = size === "7-15" ? 7 : size === "16-30" ? 16 : size === "30+" ? 30 : 1;
    // Written in English for the shop, whatever language the visitor used.
    const en = LETTER.en.form;
    const summary = [
      "COLLECTOR ASSESSMENT (/letter)",
      `Size: ${label(en.sizes, size)}`,
      `Contains: ${kinds.map((k) => label(en.kinds, k)).join(", ")}`,
      `Wants: ${label(en.goals, goal)}`,
      `Timing: ${label(en.timing, timing)}`,
      `Handoff: ${label(en.handoff, handoff)}`,
    ].join(" | ");

    trackMeta("Lead", { content_name: "collector_assessment" }, eventId);
    trackLeadConversion({ transactionId: eventId, user: { email: fields.email, phone: fields.phone } });
    trackEvent("generate_lead", { kind: "collector_assessment", size, goal, timing });

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "quote",
          name: fields.name,
          email: fields.email,
          phone: fields.phone,
          notes: fields.notes,
          summary,
          pairs,
          eventId,
          attribution: getAttribution(),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setDone(true);
    } catch {
      setError(true);
      trackEvent("assessment_submit_error");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className={`${s.formCard} card`}>
        <span className={s.doneMark} aria-hidden><Check size={22} /></span>
        <h3 className={s.formTitle}>{f.doneTitle}</h3>
        <p className={s.formSub}>{f.doneCopy}</p>
        <ol className={s.doneSteps}>
          {f.doneSteps.map((d, i) => (
            <li key={d}><span>{i + 1}</span>{d}</li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <form className={`${s.formCard} card`} onSubmit={submit} noValidate>
      <div className={s.progress} aria-hidden>
        {[0, 1, 2].map((n) => <span key={n} data-on={n <= step || undefined} />)}
      </div>
      <p className={s.stepLabel}>{step + 1} {f.stepOf} 3</p>

      {step === 0 && (
        <>
          <fieldset className={s.q}>
            <legend>{f.q1}</legend>
            <div className={s.choices} role="radiogroup">
              {f.sizes.map((o) => <Choice key={o.id} text={o.label} on={size === o.id} onPick={() => setSize(o.id)} />)}
            </div>
          </fieldset>
          <fieldset className={s.q}>
            <legend>{f.q2} <span>{f.q2Note}</span></legend>
            <div className={`${s.choices} ${s.choicesWrap}`}>
              {f.kinds.map((o) => (
                <Choice
                  key={o.id}
                  multi
                  text={o.label}
                  on={kinds.includes(o.id)}
                  onPick={() => setKinds((k) => (k.includes(o.id) ? k.filter((x) => x !== o.id) : [...k, o.id]))}
                />
              ))}
            </div>
          </fieldset>
        </>
      )}

      {step === 1 && (
        <>
          <fieldset className={s.q}>
            <legend>{f.q3}</legend>
            <div className={s.choices} role="radiogroup">
              {f.goals.map((o) => <Choice key={o.id} text={o.label} on={goal === o.id} onPick={() => setGoal(o.id)} />)}
            </div>
          </fieldset>
          <fieldset className={s.q}>
            <legend>{f.q4}</legend>
            <div className={`${s.choices} ${s.choicesWrap}`} role="radiogroup">
              {f.timing.map((o) => <Choice key={o.id} text={o.label} on={timing === o.id} onPick={() => setTiming(o.id)} />)}
            </div>
          </fieldset>
        </>
      )}

      {step === 2 && (
        <>
          <fieldset className={s.q}>
            <legend>{f.q5}</legend>
            <div className={`${s.choices} ${s.choicesWrap}`} role="radiogroup">
              {f.handoff.map((o) => <Choice key={o.id} text={o.label} on={handoff === o.id} onPick={() => setHandoff(o.id)} />)}
            </div>
          </fieldset>
          <div className={s.fields}>
            <label>
              <span>{f.name}</span>
              <input required autoComplete="name" value={fields.name} onChange={(e) => setFields({ ...fields, name: e.target.value })} />
            </label>
            <label>
              <span>{f.phone}</span>
              <input required type="tel" inputMode="tel" autoComplete="tel" value={fields.phone} onChange={(e) => setFields({ ...fields, phone: e.target.value })} />
            </label>
            <label className={s.full}>
              <span>{f.email}</span>
              <input required type="email" autoComplete="email" value={fields.email} onChange={(e) => setFields({ ...fields, email: e.target.value })} />
            </label>
            <label className={s.full}>
              <span>{f.notes}</span>
              <textarea rows={3} placeholder={f.notesPlaceholder} value={fields.notes} onChange={(e) => setFields({ ...fields, notes: e.target.value })} />
            </label>
          </div>
        </>
      )}

      {error && <p className={s.formError} role="alert">{f.error}</p>}

      <div className={s.formNav}>
        {step > 0 && (
          <button type="button" className="btn btn--ghost btn--lg" onClick={() => setStep(step - 1)}>{f.back}</button>
        )}
        {step < 2 ? (
          <button type="button" className={`btn btn--blue btn--lg ${s.formBtn}`} disabled={!canNext} onClick={() => setStep(step + 1)}>
            {f.next}
            <ArrowRight className="btn-arrow" size={16} />
          </button>
        ) : (
          <button
            type="submit"
            className={`btn btn--blue btn--lg ${s.formBtn}`}
            disabled={sending || !fields.name || !fields.email || !phoneOk}
          >
            {sending ? f.submitting : f.submit}
            {!sending && <ArrowRight className="btn-arrow" size={16} />}
          </button>
        )}
      </div>
      {step === 2 && <p className={s.privacy}>{f.privacy}</p>}
    </form>
  );
}

/* ------------------------------------------------------------------------- */

function Letter() {
  const { locale, toggleLocale } = useLocale();
  const c = LETTER[locale];
  const [past, setPast] = useState(false);
  const [formInView, setFormInView] = useState(false);

  // Mobile sticky CTA: held back until the hero button scrolls away, hidden while the form is on screen.
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > 380);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const el = document.getElementById(ASSESS_ID);
    const io = el ? new IntersectionObserver(([e]) => setFormInView(e.isIntersecting), { threshold: 0.1 }) : null;
    if (el && io) io.observe(el);
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  return (
    <>
      <header className={s.top}>
        <div className={s.topInner}>
          {/* Not a link: on a paid landing page the logo shouldn't be an exit. */}
          <img src="/LOGO-Kicks2Fresh.png" alt="Kicks2Fresh" className={s.logo} />
          <div className={s.topRight}>
            <span className={s.topRating}>
              <Stars size={11} />
              <span>{c.hero.rating}</span>
            </span>
            <button type="button" className={s.lang} onClick={toggleLocale} aria-label="English / Français">
              <span data-on={locale === "en"}>EN</span>
              <span aria-hidden>/</span>
              <span data-on={locale === "fr"}>FR</span>
            </button>
            <button type="button" className={`btn btn--solid btn--sm ${s.topCta}`} onClick={() => goToForm("letter_top")}>
              {c.topCta}
            </button>
          </div>
        </div>
      </header>

      <main id="main">
        {/* ---------- Promise ---------- */}
        <section className={s.hero}>
          <div className={s.col}>
            <p className={s.eyebrow}>{c.hero.eyebrow}</p>
            <h1 className={s.headline}>{c.hero.headline}</h1>
            <p className={s.sub}>{c.hero.sub}</p>
            <Cta label={c.hero.cta} source="letter_hero" micro={c.hero.micro} />
          </div>

          <figure className={s.heroPair}>
            <div className={s.pairGrid}>
              <div className={s.pairImg}>
                <Image src={HERO.before} alt={HERO.alt[locale]} fill priority sizes="(max-width: 720px) 50vw, 380px" />
                <span className={s.tag}>{c.hero.before}</span>
              </div>
              <div className={s.pairImg}>
                <Image src={HERO.after} alt={HERO.alt[locale]} fill priority sizes="(max-width: 720px) 50vw, 380px" />
                <span className={`${s.tag} ${s.tagAfter}`}>{c.hero.after}</span>
              </div>
            </div>
            <figcaption className={s.caption}>Louis Vuitton Trainer · {c.hero.caption}</figcaption>
          </figure>
        </section>

        {/* ---------- Story ---------- */}
        <section className={s.prose}>
          <div className={s.col}>
            <p className={s.salute}>{c.open.salute}</p>
            {c.open.paras.map((p) => <p key={p}>{p}</p>)}
            <Reveal as="blockquote" className={s.pull}>
              <p>{c.open.pull}</p>
            </Reveal>
          </div>
        </section>

        {/* ---------- Cost of inaction ---------- */}
        <section className={s.prose}>
          <div className={s.col}>
            <h2 className={s.h2}>{c.decay.title}</h2>
            <p>{c.decay.intro}</p>
            <ul className={s.mistakes}>
              {c.decay.items.map((m, i) => (
                <li key={m.title}>
                  <span className={s.x} aria-hidden>{i + 1}</span>
                  <span><strong>{m.title}.</strong> {m.copy}</span>
                </li>
              ))}
            </ul>
            <p className={s.turn}>{c.decay.outro}</p>
          </div>
        </section>

        {/* ---------- Trust ---------- */}
        <section className={s.prose}>
          <div className={s.col}>
            <h2 className={s.h2}>{c.trust.title}</h2>
            {c.trust.paras.slice(0, 2).map((p) => <p key={p}>{p}</p>)}
            <p className={s.zero}>{c.trust.paras[2]}</p>
          </div>

          <div className={s.solutionMedia}>
            <Reveal as="figure" className={s.portrait}>
              <div className={s.portraitImg}>
                <Image
                  src="/nils devant une collection complete de sneakers.jpg"
                  alt={locale === "fr" ? "Une collection complète de sneakers alignés au sol, prête pour l'atelier" : "A full sneaker collection laid out on the ground, ready for the workshop"}
                  fill
                  sizes="(max-width: 720px) 100vw, 360px"
                  loading="lazy"
                />
              </div>
            </Reveal>
            <dl className={s.stats}>
              {c.stats.map((st) => (
                <div key={st.label} className={`${s.stat} card`}>
                  <dt>{st.value}</dt>
                  <dd>{st.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------- Mechanism ---------- */}
        <section className={s.band}>
          <div className={s.colWide}>
            <p className={`${s.eyebrow}`}>{c.protocol.eyebrow}</p>
            <h2 className={`${s.h2} ${s.center}`}>{c.protocol.title}</h2>
            <p className={`${s.bandSub} ${s.center}`}>{c.protocol.intro}</p>
            <ol className={s.protocol}>
              {c.protocol.steps.map((st, i) => (
                <Reveal as="li" key={st.title} delay={(i % 3) * 60} className={`${s.protoStep} card`}>
                  <span className={s.stepN}>0{i + 1}</span>
                  <h3>{st.title}</h3>
                  <p>{st.copy}</p>
                </Reveal>
              ))}
            </ol>
            <div className={s.center}>
              <Cta label={c.hero.cta} source="letter_protocol" />
            </div>
          </div>
        </section>

        {/* ---------- Proof: portfolio ---------- */}
        <section className={s.prose}>
          <div className={s.colWide}>
            <h2 className={`${s.h2} ${s.center}`}>{c.portfolio.title}</h2>
            <p className={`${s.bandSub} ${s.center}`}>{c.portfolio.sub}</p>
            <div className={s.results}>
              {PORTFOLIO.map(({ i, label }, n) => {
                const g = GALLERY[i];
                if (!g) return null;
                return (
                  <Reveal as="figure" key={g.before} delay={(n % 2) * 60} className={s.work}>
                    <div className={s.result}>
                      <div className={s.pairImg}>
                        <Image src={g.before} alt={`${label}, ${c.hero.before.toLowerCase()}`} fill sizes="(max-width: 720px) 50vw, 230px" loading="lazy" />
                        <span className={s.tag}>{c.hero.before}</span>
                      </div>
                      <div className={s.pairImg}>
                        <Image src={g.after} alt={`${label}, ${c.hero.after.toLowerCase()}`} fill sizes="(max-width: 720px) 50vw, 230px" loading="lazy" />
                        <span className={`${s.tag} ${s.tagAfter}`}>{c.hero.after}</span>
                      </div>
                    </div>
                    <figcaption>{label}</figcaption>
                  </Reveal>
                );
              })}
            </div>
            <p className={s.disclaimer}>{c.portfolio.disclaimer}</p>
          </div>
        </section>

        {/* ---------- Proof: reviews ---------- */}
        <section className={s.prose}>
          <div className={s.colWide}>
            <h2 className={`${s.h2} ${s.center}`}>{c.voices.title}</h2>
            <p className={`${s.bandSub} ${s.center}`}>{c.voices.sub}</p>
            <div className={s.reviews}>
              {VOICES.map((i, n) => {
                const r = ALL_REVIEWS[i];
                if (!r) return null;
                return (
                  <Reveal key={r.who.en} delay={(n % 3) * 60} className={`${s.review} card`}>
                    <Stars size={12} />
                    <p>&ldquo;{r.quote[locale]}&rdquo;</p>
                    <span className={s.reviewWho}>{r.who[locale]} · Google</span>
                  </Reveal>
                );
              })}
            </div>
            <p className={s.center}>
              <a href="/reviews" className={s.textLink}>{c.voices.seeAll} →</a>
            </p>
          </div>
        </section>

        {/* ---------- Fit + why no price ---------- */}
        <section className={s.prose}>
          <div className={s.col}>
            <h2 className={s.h2}>{c.fit.title}</h2>
            <div className={s.fit}>
              <div className={`${s.fitCard} card`}>
                <h3>{c.fit.forTitle}</h3>
                <ul className={s.includes}>
                  {c.fit.forItems.map((x) => <li key={x}><Check size={14} />{x}</li>)}
                </ul>
              </div>
              <div className={`${s.fitCard} card`}>
                <h3>{c.fit.notTitle}</h3>
                <ul className={s.notList}>
                  {c.fit.notItems.map((x) => <li key={x}><span aria-hidden>✕</span>{x}</li>)}
                </ul>
              </div>
            </div>

            <h2 className={`${s.h2} ${s.spaced}`}>{c.pricing.title}</h2>
            {c.pricing.paras.map((p) => <p key={p}>{p}</p>)}
          </div>
        </section>

        {/* ---------- Risk reversal ---------- */}
        <section className={s.prose}>
          <div className={s.col}>
            <div className={`${s.guarantee} card--dark`}>
              <span className={s.seal} aria-hidden><IconShield size={26} /></span>
              <h2 className={s.h2}>{c.guarantee.title}</h2>
              <ol className={s.gList}>
                {c.guarantee.items.map((g, i) => (
                  <li key={g.title}>
                    <span className={s.gNum}>{i + 1}</span>
                    <span><strong>{g.title}.</strong> {g.copy}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ---------- Application ---------- */}
        <section className={s.band} id={ASSESS_ID}>
          <div className={s.applyGrid}>
            <div className={s.applyText}>
              <p className={s.eyebrowLeft}>{c.form.eyebrow}</p>
              <h2 className={s.h2}>{c.form.title}</h2>
              <p className={s.applySub}>{c.form.sub}</p>
              <ul className={s.includes}>
                {c.form.doneSteps.map((d) => <li key={d}><Check size={14} />{d}</li>)}
              </ul>
              {hasDirectContact && (
                <div className={s.alt}>
                  <span>{c.close.or}</span>
                  <ContactLinks location="letter_assessment" />
                </div>
              )}
            </div>
            <AssessmentForm />
          </div>
        </section>

        {/* ---------- Close ---------- */}
        <section className={s.closeSec}>
          <div className={s.col}>
            <h2 className={`${s.h2} ${s.center}`}>{c.close.title}</h2>
            <p className={`${s.bandSub} ${s.center}`}>{c.close.copy}</p>
            <div className={s.center}>
              <Cta label={c.close.cta} source="letter_final" />
            </div>

            <div className={s.signoff}>
              <p>{c.signoff.line}</p>
              <p className={s.signName}>{c.signoff.name}</p>
            </div>

            <div className={s.ps}>
              {c.ps.map((p) => <p key={p}>{p}</p>)}
              <button type="button" className={s.psLink} onClick={() => goToForm("letter_ps")}>
                {c.hero.cta} →
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className={s.foot}>
        <span>© {new Date().getFullYear()} {c.footer.rights}</span>
        <a href="/">{c.footer.site}</a>
        <span className={s.footNote}>{c.footer.brands}</span>
      </footer>

      <div className={s.sticky} data-show={(past && !formInView) || undefined}>
        <button type="button" className={`btn btn--blue btn--lg ${s.stickyBtn}`} onClick={() => goToForm("sticky")}>
          {c.hero.cta}
          <ArrowRight className="btn-arrow" size={16} />
        </button>
      </div>
    </>
  );
}

export default function SalesLetter() {
  return (
    <LocaleProvider>
      <Letter />
    </LocaleProvider>
  );
}
