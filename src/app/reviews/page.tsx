import type { Metadata } from "next";
import ReviewsView from "@/components/ReviewsView";

export const metadata: Metadata = {
  title: "Customer Reviews | Kicks2Fresh",
  description:
    "52 Google reviews, 5.0 average. Read what Kicks2Fresh customers in Montreal say about our sneaker cleaning and restoration service.",
  alternates: { canonical: "https://kicks2fresh.ca/reviews" },
  robots: { index: true, follow: true },
};

export default function ReviewsPage() {
  return <ReviewsView />;
}
