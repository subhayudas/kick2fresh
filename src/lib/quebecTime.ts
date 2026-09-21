/**
 * Wall-clock <-> UTC conversion for a single IANA time zone, DST-safe.
 * No dependency needed, Intl.DateTimeFormat already knows the zone's rules.
 */

export const BUSINESS_TIMEZONE = process.env.SQUARE_TIMEZONE || "America/Toronto";

/** Minutes to ADD to a UTC instant to get its local wall-clock reading in `timeZone`. */
function getTimeZoneOffsetMinutes(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);

  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;

  const localFieldsAsUtc = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second),
  );
  return (localFieldsAsUtc - date.getTime()) / 60_000;
}

/** Converts a wall-clock `date` (YYYY-MM-DD) + `hour` (0-24, local) in `timeZone` to a UTC ISO string. */
export function zonedHourToUtcIso(date: string, hour: number, timeZone: string = BUSINESS_TIMEZONE): string {
  const [y, m, d] = date.split("-").map(Number);
  const guess = new Date(Date.UTC(y, m - 1, d, hour, 0, 0));
  const offsetMinutes = getTimeZoneOffsetMinutes(guess, timeZone);
  return new Date(guess.getTime() - offsetMinutes * 60_000).toISOString();
}

/** Formats a UTC ISO timestamp as "HH:MM" local wall-clock time in `timeZone`. */
export function utcIsoToZonedHourLabel(isoUtc: string, timeZone: string = BUSINESS_TIMEZONE): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoUtc));
}
