"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/** Stores UTM params and ad click ids on landing so the booking can carry them. */
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
