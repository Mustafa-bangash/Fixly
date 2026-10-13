import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/routes.js';
import AuthLayout from '../../layouts/AuthLayout.jsx';

export default function ProviderSignupPage() {
  return (
    <AuthLayout>
      <div className="mb-6">
        <span className="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-bold text-brand uppercase tracking-wider mb-2">
          Service Providers
        </span>
        <h1 className="text-[26px] font-bold text-navy leading-tight">
          Join Fixly as a Service Provider
        </h1>
        <p className="mt-2 text-sm text-muted">
          Provider onboarding involves skill verification, CNIC check, and registration for electrician, plumbing, AC, or appliance repair jobs.
        </p>
      </div>

      <div className="rounded-xl border border-line bg-navy-light/40 p-4 text-sm text-navy space-y-2">
        <p className="font-semibold">Why join Fixly as a professional?</p>
        <ul className="list-disc pl-5 text-xs text-muted space-y-1">
          <li>Receive job requests in Islamabad &amp; Rawalpindi</li>
          <li>Submit direct price bids to customers</li>
          <li>Direct cash &amp; digital payment settlements</li>
          <li>Build verified work history and 5-star customer ratings</li>
        </ul>
      </div>

      <div className="mt-6 space-y-3">
        <Link
          to={ROUTES.signup}
          className="inline-flex w-full items-center justify-center rounded-lg bg-brand py-3 text-base font-semibold text-white transition-colors hover:bg-[#1648a0]"
        >
          Sign Up as a Customer Instead
        </Link>
        <Link
          to={ROUTES.home}
          className="inline-flex w-full items-center justify-center rounded-lg border border-line py-3 text-base font-semibold text-navy hover:bg-navy-light"
        >
          Back to Home
        </Link>
      </div>
    </AuthLayout>
  );
}
