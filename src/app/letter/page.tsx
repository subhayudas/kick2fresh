import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import SalesLetter from "@/components/SalesLetter";

/* Display serif for the collector letter only; the rest of the site stays Inter. */
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  weight: ["500", "600"],
  style: ["normal", "italic"],
});

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
  return (
    <div className={serif.variable}>
      <SalesLetter />
    </div>
  );
}
