/* Direct-contact channels. Set in the hosting env (build-time, NEXT_PUBLIC_).
   Digits only with country code, e.g. 15145551234. A channel with no value is
   simply not rendered - the site never shows a placeholder number. */
const raw = (v?: string) => (v ?? "").replace(/\D/g, "");

const PHONE = raw(process.env.NEXT_PUBLIC_CONTACT_PHONE);
const WHATSAPP = raw(process.env.NEXT_PUBLIC_CONTACT_WHATSAPP);

function pretty(d: string) {
  const n = d.length === 11 && d.startsWith("1") ? d.slice(1) : d;
  return n.length === 10 ? `(${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6)}` : `+${d}`;
}

export const CONTACT = {
  phone: PHONE || null,
  phoneLabel: PHONE ? pretty(PHONE) : null,
  telHref: PHONE ? `tel:+${PHONE}` : null,
  smsHref: PHONE ? `sms:+${PHONE}` : null,
  whatsappHref: WHATSAPP ? `https://wa.me/${WHATSAPP}` : null,
};

export const hasDirectContact = Boolean(CONTACT.telHref || CONTACT.whatsappHref);
