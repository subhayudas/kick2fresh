import type { Metadata } from "next";
import SalesLetter from "@/components/SalesLetter";

/* Paid-traffic collector letter. Kept out of the index so it doesn't compete
   with the homepage in search; canonical points home. */
export const metadata: Metadata = {
  title: "Private Sneaker Restoration for Collectors | Kicks2Fresh Montreal",
  description:
    "The private restoration atelier Montreal collectors trust with luxury pairs and full collections. White-glove pickup, a diagnostic on every pair, over $500K in collections preserved, zero pairs damaged.",
  alternates: { canonical: "https://kicks2fresh.ca/" },
  robots: { index: false, follow: true },
};

export default function LetterPage() {
  return <SalesLetter />;
}
