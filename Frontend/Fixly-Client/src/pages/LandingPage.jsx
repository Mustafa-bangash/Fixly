import Hero from '../components/landing/Hero.jsx';
import HowItWorks from '../components/landing/HowItWorks.jsx';
import Services from '../components/landing/Services.jsx';
import TrustSection from '../components/landing/TrustSection.jsx';
import CallToAction from '../components/landing/CallToAction.jsx';
import ProviderLink from '../components/landing/ProviderLink.jsx';

// Order of the sections is the same as in the UI prototype.
export default function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Services />
      <TrustSection />
      <CallToAction />
      <ProviderLink />
    </>
  );
}
