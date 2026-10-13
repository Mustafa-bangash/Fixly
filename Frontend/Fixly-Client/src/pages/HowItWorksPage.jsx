import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/routes.js';
import Button from '../components/common/Button.jsx';

const STEPS = [
  {
    num: 1,
    title: 'Tell us what you need',
    desc: 'Choose the service (AC, plumbing, electrician, etc.) and describe what is wrong. Add photos or short videos if you like.',
  },
  {
    num: 2,
    title: 'Get prices from providers',
    desc: 'Verified service providers in your sector see your request and send direct price bids. You decide how long they can reply.',
  },
  {
    num: 3,
    title: 'Choose the right person',
    desc: 'Compare offers, ratings, reviews, and arrival times. Message providers directly before you make your decision.',
  },
  {
    num: 4,
    title: 'Check who arrives',
    desc: 'When the technician arrives, Fixly prompts you to verify their photo and identity for your home safety.',
  },
  {
    num: 5,
    title: 'Pay and rate',
    desc: 'Pay the provider directly via Cash, JazzCash, or Easypaisa. Then leave a rating and review to help the community.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-[800px] py-8">
      <Link to={ROUTES.home} className="mb-4 inline-block text-sm font-semibold text-muted hover:text-navy">
        ← Back to Home
      </Link>

      <h1 className="text-[32px] font-bold text-navy">How Fixly Works</h1>
      <p className="mt-2 text-lg text-muted">
        Everything you need to know about getting home repairs done with trusted professionals.
      </p>

      <div className="mt-8 space-y-4">
        {STEPS.map((step) => (
          <div
            key={step.num}
            className="flex items-start gap-4 rounded-xl border border-line bg-white p-5 shadow-xs"
          >
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand-light font-bold text-brand">
              {step.num}
            </div>
            <div>
              <h2 className="text-lg font-bold text-navy">{step.title}</h2>
              <p className="mt-1 text-base text-muted leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button to={ROUTES.signup} className="px-10">
          Get Started as a Customer
        </Button>
      </div>
    </div>
  );
}
