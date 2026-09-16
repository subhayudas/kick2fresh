"use client";

import s from "./StickyMobileCta.module.css";
import { ArrowRight } from "./Icons";
import { useBooking } from "./BookingProvider";
import { useLocale } from "./LocaleProvider";

export default function StickyMobileCta() {
  const { openBooking } = useBooking();
  const { t } = useLocale();

  return (
    <div className={s.bar}>
      <button type="button" className="btn btn--blue btn--lg" onClick={() => openBooking()}>
        {t.stickyCta.bookNow}
        <ArrowRight className="btn-arrow" size={15} />
      </button>
    </div>
  );
}
