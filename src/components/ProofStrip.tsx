"use client";

import s from "./ProofStrip.module.css";
import { useLocalizedStats } from "@/lib/useLocalizedContent";
import Reveal from "./Reveal";

export default function ProofStrip() {
  const stats = useLocalizedStats();

  return (
    <section className={s.strip} aria-label="Kicks2Fresh in numbers">
      <div className="shell">
        <Reveal className={s.row}>
          {stats.map((st) => (
            <div className={s.stat} key={st.label}>
              <div className={s.value}>{st.value}</div>
              <div className={s.label}>{st.label}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
