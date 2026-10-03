"use client";

import s from "./ContactLinks.module.css";
import { CONTACT } from "@/lib/contact";
import { trackEvent } from "@/lib/analytics";
import { trackMeta } from "@/lib/metaPixel";
import { useLocale } from "./LocaleProvider";

function track(channel: string, location: string) {
  trackEvent("contact_click", { channel, location });
  trackMeta("Contact", { channel, location });
}

const Phone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  </svg>
);
const Msg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
  </svg>
);

/** Call / Text (and WhatsApp when configured). Renders nothing if no number is set. */
export default function ContactLinks({ location, className = "" }: { location: string; className?: string }) {
  const { t } = useLocale();
  if (!CONTACT.telHref && !CONTACT.whatsappHref) return null;
  return (
    <div className={`${s.row} ${className}`}>
      {CONTACT.telHref && (
        <a className={`btn btn--ghost ${s.link}`} href={CONTACT.telHref} onClick={() => track("call", location)}>
          <Phone />
          {t.nav.call}
        </a>
      )}
      {CONTACT.smsHref && (
        <a className={`btn btn--ghost ${s.link}`} href={CONTACT.smsHref} onClick={() => track("sms", location)}>
          <Msg />
          {t.nav.text}
        </a>
      )}
      {CONTACT.whatsappHref && (
        <a
          className={`btn btn--ghost ${s.link}`}
          href={CONTACT.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp", location)}
        >
          <Msg />
          WhatsApp
        </a>
      )}
    </div>
  );
}

export { Phone as PhoneIcon };
