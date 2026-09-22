import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { GOOGLE_ADS_ID } from "@/lib/googleAds";
import { META_PIXEL_ID } from "@/lib/metaPixel";
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
  themeColor: "#EEF2FA",
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
        {GOOGLE_ADS_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-ads-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');`}
            </Script>
          </>
        )}
        {META_PIXEL_ID && (
          <>
            <Script id="meta-pixel-init" strategy="afterInteractive">
              {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
            </Script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
