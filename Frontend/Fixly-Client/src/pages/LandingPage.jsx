import Hero from '../components/landing/Hero.jsx';
import HowItWorks from '../components/landing/HowItWorks.jsx';
import Services from '../components/landing/Services.jsx';
import TrustSection from '../components/landing/TrustSection.jsx';
import JoinFixly from '../components/landing/JoinFixly.jsx';
import CallToAction from '../components/landing/CallToAction.jsx';

// Fixly customer landing page showcasing services, process, trust, and onboarding options
export default function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Services />
      <TrustSection />
      <JoinFixly />
      <CallToAction />
    </>
  );
}
