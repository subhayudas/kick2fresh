import { LocaleProvider } from "@/components/LocaleProvider";
import { BookingProvider } from "@/components/BookingProvider";
import LanguagePicker from "@/components/LanguagePicker";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProofStrip from "@/components/ProofStrip";
import ServiceSelection from "@/components/ServiceSelection";
import Gallery from "@/components/Gallery";
import TrustStack from "@/components/TrustStack";
import Process from "@/components/Process";
import Faq from "@/components/Faq";
import Booking from "@/components/Booking";
import Footer from "@/components/Footer";
import StickyMobileCta from "@/components/StickyMobileCta";

export default function Page() {
  return (
    <LocaleProvider>
      <LanguagePicker />
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
          <Booking />
        </main>
        <Footer />
        <StickyMobileCta />
      </BookingProvider>
    </LocaleProvider>
  );
}
