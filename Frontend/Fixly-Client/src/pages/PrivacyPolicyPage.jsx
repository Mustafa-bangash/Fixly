import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/routes.js';

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      
      {/* Breadcrumb / Back button */}
      <div>
        <Link
          to={ROUTES.home}
          className="text-xs sm:text-sm font-semibold text-muted hover:text-navy"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Header */}
      <div>
        <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800 uppercase tracking-wider mb-2">
          Data Protection &amp; Security
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy">
          Privacy Policy
        </h1>
        <p className="mt-1 text-sm text-muted">
          Effective date: October 2026 · Fixly Technologies Pakistan
        </p>
      </div>

      {/* Main Content Card */}
      <div className="space-y-6 rounded-2xl border border-line bg-white p-6 sm:p-8 shadow-2xs text-ink leading-relaxed">
        
        {/* Intro Highlight */}
        <div className="rounded-xl bg-navy-light/40 p-4 border border-line text-sm text-navy font-medium">
          Fixly is dedicated to protecting the privacy of both customers and service providers in Islamabad and Rawalpindi. This policy outlines how your data is collected, handled, and kept safe.
        </div>

        {/* 1. Information Collected */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-navy">1. Information We Collect</h2>
          <p className="text-sm text-muted">
            When you register and use Fixly, we collect only the necessary information required to facilitate safe home and office repair services:
          </p>
          <ul className="list-disc list-inside text-sm text-muted space-y-1 pl-2">
            <li><strong>Identity &amp; Contact:</strong> Full name, verified mobile number, and email address.</li>
            <li><strong>Service Locations:</strong> Saved service addresses, area or sector names, and nearby landmarks.</li>
            <li><strong>Repair Descriptions:</strong> Details of the issue, optional photos, or video recordings uploaded to describe the fault.</li>
            <li><strong>Provider Credentials:</strong> Pakistani CNIC number, trade experience, and verified technical skills.</li>
          </ul>
        </section>

        {/* 2. Address Safeguard (Crucial Feature) */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-navy">2. Address Privacy &amp; Location Safeguard</h2>
          <div className="rounded-xl border border-brand/30 bg-brand-light/40 p-4 text-sm text-navy">
            <strong>Fixly Privacy Principle:</strong> When you post a service request, bidding technicians are only shown your <em>general neighborhood or sector</em> (for example: &ldquo;Satellite Town, Rawalpindi&rdquo; or &ldquo;Sector F-10, Islamabad&rdquo;).
            <p className="mt-1.5 text-xs text-muted">
              Your exact house number, street address, and contact number are never revealed publicly. They are exclusively revealed to the single provider you confirm and hire.
            </p>
          </div>
        </section>

        {/* 3. How We Use Data */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-navy">3. How Your Information Is Used</h2>
          <p className="text-sm text-muted">
            We utilize collected information strictly for service delivery purposes:
          </p>
          <ul className="list-disc list-inside text-sm text-muted space-y-1 pl-2">
            <li>To match customer repair requests with relevant qualified technicians in nearby sectors.</li>
            <li>To facilitate real-time chat and quote negotiation between matched parties.</li>
            <li>To track active repairs and record job completion history.</li>
            <li>To detect fraudulent accounts, prevent overcharging, and maintain platform security.</li>
          </ul>
        </section>

        {/* 4. Zero Selling Policy */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-navy">4. No Selling of Personal Information</h2>
          <p className="text-sm text-muted">
            Fixly strictly respects your personal privacy. We do not sell, rent, monetize, or disclose your contact information or address history to third-party marketing companies, advertisers, or lead generators.
          </p>
        </section>

        {/* 5. Cookies & Authentication Security */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-navy">5. Cookies &amp; Account Security</h2>
          <p className="text-sm text-muted">
            Fixly uses secure, encrypted HTTP-only session cookies (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">fixly_token</code>) to manage your authenticated sign-in state safely. These cookies protect your account credentials from unauthorized script access (XSS) and are not used for tracking across other websites.
          </p>
        </section>

        {/* 6. Your Rights & Data Deletion */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-navy">6. Your Data Rights</h2>
          <p className="text-sm text-muted">
            You may review, update, or remove your saved addresses at any time through your Profile page. If you wish to permanently delete your Fixly account and associated repair records, you can submit a deletion request to our administrative team at support@fixly.pk.
          </p>
        </section>

      </div>

      {/* Footer navigation */}
      <div className="flex items-center justify-between text-xs text-muted">
        <span>© Fixly · Islamabad &amp; Rawalpindi, Pakistan</span>
        <Link to={ROUTES.terms} className="text-brand font-semibold hover:underline">
          Read Terms &amp; Conditions →
        </Link>
      </div>

    </div>
  );
}
