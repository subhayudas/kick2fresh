#!/usr/bin/env node
/**
 * One-time setup: creates the bookable "Shoe Drop-off Appointment" service in
 * your Square Catalog. Run this once after SQUARE_ACCESS_TOKEN,
 * SQUARE_LOCATION_ID, SQUARE_TEAM_MEMBER_ID and SQUARE_ENVIRONMENT are set in
 * .env.local, then paste the printed variation ID into .env.local as
 * SQUARE_DROPOFF_SERVICE_VARIATION_ID.
 *
 * Usage: node scripts/setup-square-catalog.mjs
 */
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

function loadEnvLocal() {
  try {
    const text = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // No .env.local found, assume the variables are already in the environment.
  }
}
loadEnvLocal();

const accessToken = process.env.SQUARE_ACCESS_TOKEN;
const locationId = process.env.SQUARE_LOCATION_ID;
const teamMemberId = process.env.SQUARE_TEAM_MEMBER_ID;
const durationMinutes = Number(process.env.SQUARE_DROPOFF_DURATION_MINUTES || 20);
const version = process.env.SQUARE_API_VERSION || "2025-01-23";
const baseUrl =
  process.env.SQUARE_ENVIRONMENT === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";

if (!accessToken || !locationId || !teamMemberId) {
  console.error(
    "Missing SQUARE_ACCESS_TOKEN, SQUARE_LOCATION_ID or SQUARE_TEAM_MEMBER_ID.\n" +
      "Set them in .env.local (see .env.example) before running this script.",
  );
  process.exit(1);
}

async function main() {
  const res = await fetch(`${baseUrl}/v2/catalog/object`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Square-Version": version,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      idempotency_key: randomUUID(),
      object: {
        type: "ITEM",
        id: "#dropoff-service",
        item_data: {
          name: "Shoe Drop-off Appointment",
          description: "Scheduled drop-off slot. The cleaning price is added to the order separately, per pair.",
          product_type: "APPOINTMENTS_SERVICE",
          is_archived: false,
          variations: [
            {
              type: "ITEM_VARIATION",
              id: "#dropoff-service-variation",
              item_variation_data: {
                item_id: "#dropoff-service",
                name: "Drop-off",
                pricing_type: "FIXED_PRICING",
                price_money: { amount: 0, currency: "CAD" },
                service_duration: durationMinutes * 60 * 1000,
                available_for_booking: true,
                team_member_ids: [teamMemberId],
              },
            },
          ],
        },
      },
    }),
  });

  const body = await res.json();
  if (!res.ok) {
    console.error("Square rejected the catalog object:", JSON.stringify(body, null, 2));
    process.exit(1);
  }

  const variation = body.catalog_object.item_data.variations[0];
  console.log("Created the Square drop-off service.");
  console.log(`Item ID:      ${body.catalog_object.id}`);
  console.log(`Variation ID: ${variation.id}`);
  console.log("\nAdd this line to your .env.local:");
  console.log(`SQUARE_DROPOFF_SERVICE_VARIATION_ID=${variation.id}`);
  console.log(
    "\nLast step in the Square dashboard: Appointments → Settings → set the booking time-slot " +
      "increment to 60 minutes, so only on-the-hour times are ever offered.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
