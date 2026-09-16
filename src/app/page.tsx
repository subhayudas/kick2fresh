import { LocaleProvider } from "@/components/LocaleProvider";
import { BookingProvider } from "@/components/BookingProvider";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProofStrip from "@/components/ProofStrip";
import ServiceSelection from "@/components/ServiceSelection";
import Gallery from "@/components/Gallery";
import TrustStack from "@/components/TrustStack";
import Process from "@/components/Process";
import Faq from "@/components/Faq";
import Guarantee from "@/components/Guarantee";
import Booking from "@/components/Booking";
import BundlesReminder from "@/components/BundlesReminder";
import Footer from "@/components/Footer";
import StickyMobileCta from "@/components/StickyMobileCta";

export default function Page() {
  return (
    <LocaleProvider>
      <BookingProvider>
        <Navbar />
        <main id="main">
          <Hero />
          <ProofStrip />
          <ServiceSelection />
          <Gallery />
          <TrustStack />
          <Process />
          <Faq />
          <Guarantee />
          <Booking />
          <BundlesReminder />
        </main>
        <Footer />
        <StickyMobileCta />
      </BookingProvider>
    </LocaleProvider>
  );
}
