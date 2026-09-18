import { NextRequest, NextResponse } from "next/server";
import { isSquareConfigured, searchAvailability } from "@/lib/square";
import { BUSINESS_TIMEZONE, zonedHourToUtcIso, utcIsoToZonedHourLabel } from "@/lib/quebecTime";

const OPEN_HOUR = Number(process.env.BUSINESS_OPEN_HOUR ?? 9);
const CLOSE_HOUR = Number(process.env.BUSINESS_CLOSE_HOUR ?? 18);

function hourLabel(h: number) {
  return `${String(h).padStart(2, "0")}:00`;
}

function candidateHours() {
  const hours: number[] = [];
  for (let h = OPEN_HOUR; h < CLOSE_HOUR; h++) hours.push(h);
  return hours;
}

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid or missing date (expected YYYY-MM-DD)" }, { status: 400 });
  }

  const hours = candidateHours();

  if (!isSquareConfigured()) {
    // Square credentials not wired up yet — fall back to the full hourly range
    // so the form stays usable while setup finishes.
    return NextResponse.json({ configured: false, slots: hours.map(hourLabel) });
  }

  try {
    const dayStartUtc = zonedHourToUtcIso(date, 0, BUSINESS_TIMEZONE);
    const dayEndUtc = zonedHourToUtcIso(date, 24, BUSINESS_TIMEZONE);
    const availabilities = await searchAvailability(dayStartUtc, dayEndUtc);

    const availableLabels = new Set(
      availabilities.map((a) => utcIsoToZonedHourLabel(a.start_at, BUSINESS_TIMEZONE)),
    );
    const slots = hours.map(hourLabel).filter((label) => availableLabels.has(label));

    return NextResponse.json({ configured: true, slots });
  } catch (err) {
    console.error("Square availability lookup failed", err);
    return NextResponse.json({ error: "Could not load availability from Square" }, { status: 502 });
  }
}
