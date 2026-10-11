"use client";

import Image from "next/image";
import s from "./SalesLetter.module.css";
import { LocaleProvider, useLocale } from "./LocaleProvider";
import { BookingProvider, useBooking } from "./BookingProvider";
import Booking from "./Booking";
import StickyMobileCta from "./StickyMobileCta";
import ContactLinks from "./ContactLinks";
import Reveal from "./Reveal";
import { ArrowRight, Check, IconShield, Star } from "./Icons";
import { hasDirectContact } from "@/lib/contact";
import { LETTER } from "@/lib/letterCopy";
import { ALL_REVIEWS, GALLERY } from "@/lib/content";
import {
  useLocalizedAddons, useLocalizedGallery, useLocalizedProcess, useLocalizedTiers,
} from "@/lib/useLocalizedContent";

/* Long-form sales letter for paid traffic. One offer, one action: no site nav,
   every button opens the same booking sheet as the homepage, with its own
   `source` so GA4 can compare this page's CTAs against the homepage's.
   Read order: promise -> story -> problem -> mechanism -> proof -> offer ->
   risk reversal -> objections -> close -> P.S. */

const HERO_PAIR = GALLERY[0];
/** Picked for variety of shoe and damage; indexes into GALLERY. */
const PROOF_PAIRS = [1, 2, 3, 4, 5, 6];
/** Reviews that answer a specific doubt (ruined pair, big collection, quality). Indexes into ALL_REVIEWS. */
const PROOF_REVIEWS = [15, 28, 8, 9, 27, 7];

function Stars({ size = 13 }: { size?: number }) {
  return (
    <span className={s.stars} aria-hidden>
      {[0, 1, 2, 3, 4].map((n) => <Star key={n} size={size} />)}
    </span>
  );
}

function Cta({ label, source, tier, addOn, micro }: { label: string; source: string; tier?: string; addOn?: string; micro?: string }) {
  const { openBooking } = useBooking();
  return (
    <div className={s.ctaBlock}>
      <button
        type="button"
        className={`btn btn--blue btn--lg ${s.ctaBtn}`}
        onClick={() => openBooking({ source, tier, addOn })}
      >
        {label}
        <ArrowRight className="btn-arrow" size={16} />
      </button>
      {micro && <p className={s.ctaMicro}>{micro}</p>}
    </div>
  );
}

function Letter() {
  const { locale, toggleLocale } = useLocale();
  const { openBooking } = useBooking();
  const c = LETTER[locale];
  const tiers = useLocalizedTiers();
  const addons = useLocalizedAddons();
  const gallery = useLocalizedGallery();
  const steps = useLocalizedProcess();
  const reviews = PROOF_REVIEWS.map((i) => ALL_REVIEWS[i]).filter(Boolean);

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
            <button type="button" className={`btn btn--solid btn--sm ${s.topCta}`} onClick={() => openBooking({ source: "letter_top" })}>
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
                <Image src={HERO_PAIR.before} alt={gallery[0].alt} fill priority sizes="(max-width: 720px) 50vw, 380px" />
                <span className={s.tag}>{c.hero.before}</span>
              </div>
              <div className={s.pairImg}>
                <Image src={HERO_PAIR.after} alt={gallery[0].alt} fill priority sizes="(max-width: 720px) 50vw, 380px" />
                <span className={`${s.tag} ${s.tagAfter}`}>{c.hero.after}</span>
              </div>
            </div>
            <figcaption className={s.caption}>{c.hero.caption}</figcaption>
          </figure>
        </section>

        {/* ---------- Story ---------- */}
        <section className={s.prose}>
          <div className={s.col}>
            <p className={s.salute}>{c.open.salute}</p>
            {c.open.paras.map((p) => <p key={p}>{p}</p>)}
            <p className={s.turn}>{c.open.turn}</p>

            <Reveal as="blockquote" className={s.pull}>
              <Stars />
              <p>&ldquo;{c.proofQuote.quote}&rdquo;</p>
              <cite>{c.proofQuote.who}</cite>
            </Reveal>
          </div>
        </section>

        {/* ---------- Problem ---------- */}
        <section className={s.prose}>
          <div className={s.col}>
            <h2 className={s.h2}>{c.agitate.title}</h2>
            <p>{c.agitate.intro}</p>
            <ul className={s.mistakes}>
              {c.agitate.items.map((m) => (
                <li key={m.title}>
                  <span className={s.x} aria-hidden>✕</span>
                  <span><strong>{m.title}.</strong> {m.copy}</span>
                </li>
              ))}
            </ul>
            <p>{c.agitate.outro}</p>
          </div>
        </section>

        {/* ---------- Mechanism ---------- */}
        <section className={s.prose}>
          <div className={s.col}>
            <h2 className={s.h2}>{c.solution.title}</h2>
            {c.solution.paras.slice(0, 2).map((p) => <p key={p}>{p}</p>)}
            <p className={s.zero}>{c.solution.paras[2]}</p>
          </div>

          <div className={s.solutionMedia}>
            <Reveal as="figure" className={s.portrait}>
              <div className={s.portraitImg}>
                <Image
                  src="/nils devant une collection complete de sneakers.jpg"
                  alt={c.solution.photoAlt}
                  fill
                  sizes="(max-width: 720px) 100vw, 360px"
                  loading="lazy"
                />
              </div>
              <figcaption className={s.caption}>{c.solution.photoCaption}</figcaption>
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

        {/* ---------- Proof: results ---------- */}
        <section className={s.band}>
          <div className={s.colWide}>
            <h2 className={`${s.h2} ${s.center}`}>{c.results.title}</h2>
            <p className={`${s.bandSub} ${s.center}`}>{c.results.sub}</p>
            <div className={s.results}>
              {PROOF_PAIRS.map((i, n) => {
                const g = gallery[i];
                if (!g) return null;
                return (
                  <Reveal key={g.before} delay={(n % 3) * 60} className={s.result}>
                    <div className={s.pairImg}>
                      <Image src={g.before} alt={g.alt} fill sizes="(max-width: 720px) 50vw, 230px" loading="lazy" />
                      <span className={s.tag}>{c.hero.before}</span>
                    </div>
                    <div className={s.pairImg}>
                      <Image src={g.after} alt={g.alt} fill sizes="(max-width: 720px) 50vw, 230px" loading="lazy" />
                      <span className={`${s.tag} ${s.tagAfter}`}>{c.hero.after}</span>
                    </div>
                  </Reveal>
                );
              })}
            </div>
            <div className={s.center}>
              <Cta label={c.results.cta} source="letter_results" />
            </div>
          </div>
        </section>

        {/* ---------- Proof: reviews ---------- */}
        <section className={s.prose}>
          <div className={s.colWide}>
            <h2 className={`${s.h2} ${s.center}`}>{c.reviews.title}</h2>
            <p className={`${s.bandSub} ${s.center}`}>{c.reviews.sub}</p>
            <div className={s.reviews}>
              {reviews.map((r, n) => (
                <Reveal key={r.who.en} delay={(n % 3) * 60} className={`${s.review} card`}>
                  <Stars size={12} />
                  <p>&ldquo;{r.quote[locale]}&rdquo;</p>
                  <span className={s.reviewWho}>{r.who[locale]} · Google</span>
                </Reveal>
              ))}
            </div>
            <p className={s.center}>
              <a href="/reviews" className={s.textLink}>{c.reviews.seeAll} →</a>
            </p>
          </div>
        </section>

        {/* ---------- Offer ---------- */}
        <section className={s.band} id="offer">
          <div className={s.colWide}>
            <h2 className={`${s.h2} ${s.center}`}>{c.offer.title}</h2>
            <p className={`${s.bandSub} ${s.center}`}>{c.offer.sub}</p>
            <div className={s.tiers}>
              {tiers.map((t) => (
                <div key={t.id} className={`${s.tier} card`} data-featured={t.featured || undefined}>
                  {t.featured && <span className={s.badge}>{c.offer.recommended}</span>}
                  <h3 className={s.tierName}>{t.name}</h3>
                  <p className={s.tierFor}>{t.bestFor}</p>
                  <p className={s.price}>
                    {t.priceLabel}
                    <span>{c.offer.perPair}</span>
                  </p>
                  <ul className={s.includes}>
                    {t.includes.map((inc) => (
                      <li key={inc}><Check size={14} />{inc}</li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className={`btn ${t.featured ? "btn--blue" : "btn--ghost"} btn--block ${s.tierBtn}`}
                    onClick={() => openBooking({ tier: t.id, source: `letter_offer_${t.id}` })}
                  >
                    {t.cta}
                  </button>
                </div>
              ))}
            </div>

            <div className={s.addons}>
              <span className={s.addonsLabel}>{c.offer.addonsLabel}</span>
              <ul>
                {addons.map((a) => (
                  <li key={a.id}>{a.name} <strong>+${a.price}</strong></li>
                ))}
              </ul>
            </div>

            <div className={s.anchor}>
              <strong>{c.offer.anchorTitle}</strong> {c.offer.anchor}
            </div>
          </div>
        </section>

        {/* ---------- Risk reversal ---------- */}
        <section className={s.prose}>
          <div className={s.col}>
            <div className={`${s.guarantee} card--dark`}>
              <span className={s.seal} aria-hidden><IconShield size={26} /></span>
              <h2 className={s.h2}>{c.guarantee.title}</h2>
              <p className={s.gIntro}>{c.guarantee.intro}</p>
              <ol className={s.gList}>
                {c.guarantee.items.map((g, i) => (
                  <li key={g.title}>
                    <span className={s.gNum}>{i + 1}</span>
                    <span><strong>{g.title}.</strong> {g.copy}</span>
                  </li>
                ))}
              </ol>
              <Cta label={c.guarantee.cta} source="letter_guarantee" />
            </div>
          </div>
        </section>

        {/* ---------- How it works + objections ---------- */}
        <section className={s.prose}>
          <div className={s.col}>
            <h2 className={s.h2}>{c.steps.title}</h2>
            <ol className={s.steps}>
              {steps.map((st) => (
                <li key={st.n}>
                  <span className={s.stepN}>{st.n}</span>
                  <span><strong>{st.title}.</strong> {st.copy}</span>
                </li>
              ))}
            </ol>

            <h2 className={`${s.h2} ${s.spaced}`}>{c.objections.title}</h2>
            <div className={s.qa}>
              {c.objections.items.map((o) => (
                <div key={o.q}>
                  <h3>{o.q}</h3>
                  <p>{o.a}</p>
                </div>
              ))}
            </div>

            <div className={s.season}>
              <strong>{c.season.title}</strong> {c.season.copy}
            </div>
          </div>
        </section>

        {/* ---------- Close ---------- */}
        <section className={s.closeSec}>
          <div className={s.col}>
            <h2 className={`${s.h2} ${s.center}`}>{c.close.title}</h2>
            <p className={`${s.bandSub} ${s.center}`}>{c.close.copy}</p>
            <div className={s.center}>
              <Cta label={c.close.cta} source="letter_final" micro={c.close.micro} />
            </div>
            {hasDirectContact && (
              <div className={s.alt}>
                <span>{c.close.or}</span>
                <ContactLinks location="letter_final" />
              </div>
            )}

            <div className={s.signoff}>
              <p>{c.signoff.line}</p>
              <p className={s.signName}>{c.signoff.name}</p>
            </div>

            <div className={s.ps}>
              {c.ps.map((p) => <p key={p}>{p}</p>)}
              <button type="button" className={s.psLink} onClick={() => openBooking({ source: "letter_ps" })}>
                {c.hero.cta} →
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className={s.foot}>
        <span>© {new Date().getFullYear()} {c.footer.rights}</span>
        <span>{c.footer.cad}</span>
        <a href="/">{c.footer.site}</a>
      </footer>

      <StickyMobileCta />
      <Booking />
    </>
  );
}

export default function SalesLetter() {
  return (
    <LocaleProvider>
      <BookingProvider>
        <Letter />
      </BookingProvider>
    </LocaleProvider>
  );
}
