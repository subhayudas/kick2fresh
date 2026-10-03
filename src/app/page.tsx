import { LocaleProvider } from "@/components/LocaleProvider";
import { BookingProvider } from "@/components/BookingProvider";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProofStrip from "@/components/ProofStrip";
import Gallery from "@/components/Gallery";
import ServiceSelection from "@/components/ServiceSelection";
import TrustStack from "@/components/TrustStack";
import Process from "@/components/Process";
import Faq from "@/components/Faq";
import FinalCta from "@/components/FinalCta";
import Booking from "@/components/Booking";
import Footer from "@/components/Footer";
import StickyMobileCta from "@/components/StickyMobileCta";

/* Order follows the ad-click decision path: promise + proof (hero, numbers,
   real results) -> price -> reviews -> how it works -> objections (FAQ) -> CTA.
   Every CTA opens the same booking sheet. */
export default function Page() {
  return (
    <LocaleProvider>
      <BookingProvider>
        <Navbar />
        <main id="main">
          <Hero />
          <ProofStrip />
          <Gallery />
          <ServiceSelection />
          <TrustStack />
          <Process />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
        <StickyMobileCta />
        <Booking />
      </BookingProvider>
    </LocaleProvider>
  );
}
