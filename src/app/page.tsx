import { BookingProvider } from "@/components/BookingProvider";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import BeforeAfter from "@/components/BeforeAfter";
import Expertise from "@/components/Expertise";
import Services from "@/components/Services";
import Materials from "@/components/Materials";
import Pricing from "@/components/Pricing";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import BookingPromo from "@/components/BookingPromo";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

export default function Page() {
  return (
    <BookingProvider>
      <Navbar />
      <main id="main">
        <Hero />
        <TrustStrip />
        <BeforeAfter />
        <Expertise />
        <Services />
        <Materials />
        <Pricing />
        <Process />
        <Testimonials />
        <BookingPromo />
        <Contact />
      </main>
      <Footer />
      <BookingModal />
    </BookingProvider>
  );
}
