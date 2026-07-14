import HeroSection from "../../components/Home/HeroSection";
import LandingNavbar from "../../components/navbar/LandingNavbar";
import Footer from "../../components/Footer";
import Solutions from "../../components/Home/Solutions";
import HowItWorks from "../../components/Home/HowItWorks";
import WhyChooseUs from "../../components/Home/WhyChooseUs";
import FAQ from "../../components/Home/FAQ";
import Testimonials from "../../components/Home/Testimonials";
function Home() {
  return (
    <>
      <LandingNavbar />

      <HeroSection />

      <Solutions />

      <HowItWorks />

      <WhyChooseUs />

      <FAQ />

      <Testimonials />

      <Footer />
    </>
  );
}
export default Home;
