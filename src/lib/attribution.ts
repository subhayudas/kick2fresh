/* Ad attribution. Captures UTM params and ad-click ids (gclid / gbraid / wbraid /
   fbclid) from the landing URL, keeps them for the session so a booking made
   several pages or minutes later still carries them, and exposes the Meta
   browser cookies (_fbp / _fbc) so the server-side Conversions API can match
   the event to the ad click. */

const KEY = "k2f-attribution";
const PARAMS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
  "gclid", "gbraid", "wbraid", "fbclid",
] as const;

export type Attribution = Partial<Record<(typeof PARAMS)[number], string>> & {
  landing_page?: string;
  referrer?: string;
  fbp?: string;
  fbc?: string;
};

function readCookie(name: string) {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}

function load(): Attribution {
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Attribution;
  } catch {
    return {};
  }
}

/** Call once on every page load. A new ad click (any click id or utm_source in
 *  the URL) replaces what was stored; otherwise the earlier values are kept. */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const fresh: Attribution = {};
  for (const p of PARAMS) {
    const v = url.searchParams.get(p);
    if (v) fresh[p] = v.slice(0, 200);
  }
  const hasFreshClick = Object.keys(fresh).length > 0;
  const stored = load();
  if (hasFreshClick) {
    const next: Attribution = {
      ...fresh,
      landing_page: url.pathname,
      referrer: document.referrer ? document.referrer.slice(0, 200) : undefined,
    };
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  } else if (!stored.landing_page) {
    try {
      window.localStorage.setItem(
        KEY,
        JSON.stringify({
          ...stored,
          landing_page: url.pathname,
          referrer: document.referrer ? document.referrer.slice(0, 200) : undefined,
        }),
      );
    } catch {}
  }
}

/** Stored attribution plus the live Meta cookies. Safe to call from event handlers. */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const a = load();
  const fbp = readCookie("_fbp");
  let fbc = readCookie("_fbc");
  // The pixel may not have written _fbc yet (or is blocked): build it from fbclid in Meta's format.
  if (!fbc && a.fbclid) fbc = `fb.1.${Date.now()}.${a.fbclid}`;
  return { ...a, ...(fbp && { fbp }), ...(fbc && { fbc }) };
}

/** Compact one-line summary for Square notes / lead webhooks. */
export function attributionSummary(a: Attribution) {
  const parts = Object.entries(a)
    .filter(([k, v]) => v && k !== "fbp" && k !== "fbc")
    .map(([k, v]) => `${k}=${v}`);
  return parts.length ? `Source: ${parts.join(" ")}` : "";
}

export function newEventId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
