import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const SITE = "https://kicks2fresh.ca";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Kicks2Fresh | Premium Sneaker Cleaning & Restoration in Montreal",
  description:
    "Professional sneaker cleaning and restoration in Montreal. Expert care for everyday, designer and collectible sneakers. Book your clean starting at $65 CAD.",
  keywords: [
    "sneaker cleaning Montreal",
    "shoe restoration Montreal",
    "sneaker restoration",
    "suede cleaning",
    "sole whitening",
    "nettoyage de sneakers Montréal",
  ],
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: SITE,
    siteName: "Kicks2Fresh",
    title: "Kicks2Fresh | Premium Sneaker Cleaning & Restoration in Montreal",
    description:
      "Professional sneaker cleaning and restoration in Montreal. Expert care for everyday, designer and collectible sneakers. Book your clean starting at $65 CAD.",
    images: [{ url: "/media/hero-sneaker.webp", width: 1344, height: 1680, alt: "A pristine cream leather sneaker on a warm ivory backdrop" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kicks2Fresh | Premium Sneaker Cleaning & Restoration in Montreal",
    description:
      "Professional sneaker cleaning and restoration in Montreal. Book your clean starting at $65 CAD.",
    images: ["/media/hero-sneaker.webp"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE },
};

export const viewport: Viewport = {
  themeColor: "#F4EFE7",
  width: "device-width",
  initialScale: 1,
};

/* Structured data. Only facts the business has actually established:
   the city, the services and their prices. No address, no rating, no reviews. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Kicks2Fresh",
  description:
    "Premium sneaker cleaning and restoration in Montreal, Quebec. Specialised care for leather, suede, nubuck and mesh.",
  url: SITE,
  areaServed: { "@type": "City", name: "Montreal", addressRegion: "QC", addressCountry: "CA" },
  address: { "@type": "PostalAddress", addressLocality: "Montreal", addressRegion: "QC", addressCountry: "CA" },
  priceRange: "$65–$150+ CAD",
  availableLanguage: ["English", "French"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Sneaker care services",
    itemListElement: [
      { "@type": "Offer", name: "Essential Clean", price: "65", priceCurrency: "CAD" },
      { "@type": "Offer", name: "Premium Restoration", price: "95", priceCurrency: "CAD" },
      { "@type": "Offer", name: "Expert Restoration", price: "150", priceCurrency: "CAD" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={sans.variable}>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
