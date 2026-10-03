"use client";

import s from "./Process.module.css";
import { useLocalizedProcess, useLocalizedTiming } from "@/lib/useLocalizedContent";
import { IconClock } from "./Icons";
import { useLocale } from "./LocaleProvider";

/* Three static steps - the page's "what happens after I tap Book" answer.
   (The old auto-rotating stage and video are gone: nothing moves on a phone.) */
export default function Process() {
  const { t } = useLocale();
  const process = useLocalizedProcess();
  const timing = useLocalizedTiming();

  return (
    <section className={s.sec} id="process">
      <div className="shell">
        <div className={s.head}>
          <span className="eyebrow">{t.process.eyebrow}</span>
          <h2 className={`h2 ${s.title}`}>{t.process.title}</h2>
        </div>

        <ol className={s.steps}>
          {process.map((p) => (
            <li key={p.n} className={`${s.step} card`}>
              <span className={s.num}>{p.n}</span>
              <div>
                <h3 className={s.stepTitle}>{p.title}</h3>
                <p className={s.stepCopy}>{p.copy}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className={s.timing}>
          <IconClock size={15} />
          {timing.standard} · {timing.priority}
        </p>
      </div>
    </section>
  );
}
