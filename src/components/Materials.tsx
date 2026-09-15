import Image from "next/image";
import s from "./Materials.module.css";
import { SPECIALTIES } from "@/lib/content";
import Reveal from "./Reveal";

export default function Materials() {
  return (
    <section className={s.sec}>
      <div className="shell">
        <div className={s.wrap}>
          <Reveal className={s.intro}>
            <span className="eyebrow">Material care</span>
            <h2 className={s.introTitle}>Different materials, different hands.</h2>
            <p className={s.introCopy}>
              A brush that&rsquo;s right for leather will ruin suede. We pick the
              chemistry and the pressure per panel, not per pair.
            </p>
          </Reveal>

          {SPECIALTIES.map((m, i) => (
            <Reveal key={m.id} className={s.card} delay={i * 80}>
              <Image
                src={m.image}
                alt={m.alt}
                width={1360}
                height={1360}
                sizes="(max-width: 520px) 92vw, (max-width: 940px) 46vw, 22vw"
                loading="lazy"
              />
              <span className={s.cardScrim} aria-hidden />
              <div className={s.cardBody}>
                <h3 className={s.cardLabel}>{m.label}</h3>
                <p className={s.cardCopy}>{m.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
