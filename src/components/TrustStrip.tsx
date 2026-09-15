import s from "./TrustStrip.module.css";
import { TRUST } from "@/lib/content";
import { IconPin, IconGlobe, IconSparkle, IconBrush, IconShield, IconTool } from "./Icons";

/**
 * Trust strip. No invented partner logos — these are claims about how
 * Kicks2Fresh actually operates. Swap for real partner marks when they exist.
 */
const GLYPHS = [IconPin, IconGlobe, IconSparkle, IconBrush, IconShield, IconTool];

function Row({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className={s.row} aria-hidden={ariaHidden || undefined}>
      {TRUST.map((t, i) => {
        const G = GLYPHS[i % GLYPHS.length];
        return (
          <span className={s.item} key={`${t}-${i}`}>
            <G size={15} />
            {t}
            <span className={s.sep} aria-hidden />
          </span>
        );
      })}
    </div>
  );
}

export default function TrustStrip() {
  return (
    <section className={s.strip} aria-label="How we work">
      <div className={s.track}>
        <Row />
        <Row ariaHidden />
      </div>
    </section>
  );
}
