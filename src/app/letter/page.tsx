import type { Metadata } from "next";
import SalesLetter from "@/components/SalesLetter";

/* Paid-traffic sales letter. Kept out of the index so it doesn't compete with
   the homepage for "sneaker cleaning Montreal"; canonical points home. */
export const metadata: Metadata = {
  title: "Don't Replace Your Sneakers. Restore Them. | Kicks2Fresh Montreal",
  description:
    "Hand-cleaned and restored in Montreal from $65 a pair. 1000+ pairs, 5.0 on Google from 52 reviews, nothing to pay until you approve your quote, and a free redo if you're not happy.",
  alternates: { canonical: "https://kicks2fresh.ca/" },
  robots: { index: false, follow: true },
};

export default function LetterPage() {
  return <SalesLetter />;
}
