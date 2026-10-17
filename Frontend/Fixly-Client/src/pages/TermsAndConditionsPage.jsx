import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/routes.js';

export default function TermsAndConditionsPage() {
  // Toggle between Customer terms and Provider terms
  const [activeRole, setActiveRole] = useState('customer');

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
        <span className="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-bold text-brand uppercase tracking-wider mb-2">
          Fixly Legal Terms
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy">
          Terms &amp; Conditions
        </h1>
        <p className="mt-1 text-sm text-muted">
          Last updated: October 2026 · Serving Islamabad &amp; Rawalpindi, Pakistan
        </p>
      </div>

      {/* Role Switcher Tabs */}
      <div className="flex border-b border-line gap-2">
        <button
          type="button"
          onClick={() => setActiveRole('customer')}
          className={`pb-3 px-2 text-sm font-bold transition-all cursor-pointer ${
            activeRole === 'customer'
              ? 'border-b-2 border-brand text-brand'
              : 'text-muted hover:text-navy'
          }`}
        >
          Customer Terms
        </button>
        <button
          type="button"
          onClick={() => setActiveRole('provider')}
          className={`pb-3 px-2 text-sm font-bold transition-all cursor-pointer ${
            activeRole === 'provider'
              ? 'border-b-2 border-brand text-brand'
              : 'text-muted hover:text-navy'
          }`}
        >
          Service Provider Terms
        </button>
      </div>

      {/* ============================================================== */}
      {/* 1. CUSTOMER TERMS & CONDITIONS                                  */}
      {/* ============================================================== */}
      {activeRole === 'customer' ? (
        <div className="space-y-6 rounded-2xl border border-line bg-white p-6 sm:p-8 shadow-2xs text-ink leading-relaxed">
          
          <div className="rounded-xl bg-navy-light/40 p-4 border border-line text-sm text-navy font-medium">
            These terms apply to all individuals, households, and business clients hiring repair and maintenance services through the Fixly marketplace platform.
          </div>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-navy">1. Account Registration &amp; Accuracy</h2>
            <p className="text-sm text-muted">
              To request repair services, you must register a customer account using a valid Pakistani mobile number and accurate contact information. You are responsible for ensuring that all details related to your property address and repair descriptions are truthful and up to date.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-navy">2. Service Requests &amp; Provider Selection</h2>
            <p className="text-sm text-muted">
              When you post a repair request, verified service providers within Islamabad and Rawalpindi submit transparent bids specifying their proposed charges, arrival timing, and work warranty. As a customer, you have full freedom to evaluate providers based on customer reviews, pricing, and job completion history before choosing your preferred technician.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-navy">3. Safety &amp; Technician Verification</h2>
            <p className="text-sm text-muted">
              When the service technician arrives at your premises, you agree to confirm their identity (name and photo) against the details displayed in the Fixly application before granting entry. If the arriving individual does not match the assigned provider profile, do not permit entry and report the issue immediately to Fixly support.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-navy">4. Direct Payment Policy</h2>
            <p className="text-sm text-muted">
              Fixly operates on a transparent direct-payment model. Customers pay service providers directly via Cash, JazzCash, or Easypaisa upon satisfactory completion of the requested job. Fixly does not deduct hidden convenience charges from the customer. Any replacement parts or hardware materials purchased on behalf of the customer must be supported by an authentic merchant receipt.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-navy">5. Cancellation &amp; Site Visit Fees</h2>
            <p className="text-sm text-muted">
              You may cancel a service request without penalty before a technician has been dispatched. If a provider has agreed to an inspection site visit to diagnose an in-depth fault, a nominal site visit fee (standard PKR 500) may apply to cover travel costs if clearly stated in the accepted bid.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-navy">6. Honest Reviews &amp; Community Integrity</h2>
            <p className="text-sm text-muted">
              After a job is marked completed, customers are requested to rate the technician from 1 to 5 stars and submit honest feedback. Submitting defamatory, abusive, or fraudulent reviews is strictly prohibited and may result in account termination.
            </p>
          </section>

        </div>
      ) : (
        /* ============================================================== */
        /* 2. SERVICE PROVIDER TERMS & CONDITIONS                         */
        /* ============================================================== */
        <div className="space-y-6 rounded-2xl border border-line bg-white p-6 sm:p-8 shadow-2xs text-ink leading-relaxed">
          
          <div className="rounded-xl bg-navy-light/40 p-4 border border-line text-sm text-navy font-medium">
            These terms apply to all verified tradespeople, technicians, and specialized repair contractors offering services on the Fixly marketplace.
          </div>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-navy">1. Identity Verification &amp; CNIC Compliance</h2>
            <p className="text-sm text-muted">
              Every service provider must provide authentic national identity details (Pakistani CNIC), a working Pakistani phone number, and evidence of skill or trade background. Providing falsified identity documents or proxy registrations will result in immediate permanent banning and legal reporting.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-navy">2. Transparent Bidding &amp; Pricing Ethics</h2>
            <p className="text-sm text-muted">
              Quotes and bids submitted on customer requests represent binding price proposals for the stated scope of work. Service providers must not demand arbitrary surcharges or unauthorized price hikes once at the customer&apos;s residence. If additional undetected faults are discovered on site, the technician must clearly explain the fault and obtain customer approval before performing additional billable labor.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-navy">3. Punctuality &amp; Professional Conduct</h2>
            <p className="text-sm text-muted">
              Providers must arrive at the agreed time and maintain high standards of safety, respect, and cleanliness at the client&apos;s home or office. Harassment, unprofessional behavior, or damaging customer property is zero-tolerance on Fixly.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-navy">4. Workmanship Warranty &amp; Guarantee</h2>
            <p className="text-sm text-muted">
              If a provider specifies a warranty period (e.g. 14, 30, or 90 days) on a repair bid, the provider is legally and professionally obligated to honor warranty claims. In the event that the identical repair fails within the covered warranty duration, the technician must re-inspect and remediate the issue without charging secondary labor fees.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-navy">5. Non-Delegation Policy (No Subcontracting)</h2>
            <p className="text-sm text-muted">
              The verified provider who submits the bid and receives customer confirmation must personally perform or supervise the job. Sending unverified third parties or unregistered workers on your behalf is strictly forbidden for customer safety reasons.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-navy">6. Account Suspension &amp; Penalties</h2>
            <p className="text-sm text-muted">
              Fixly reserves the right to suspend or permanently deactivate provider accounts found guilty of repeated cancellations, overcharging, customer harassment, poor completion records, or attempts to bypass Fixly safety protocols.
            </p>
          </section>

        </div>
      )}

      {/* Need Help Box */}
      <div className="rounded-xl border border-line bg-page p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-navy">Have questions about our terms?</h3>
          <p className="text-xs text-muted">Our Islamabad/Rawalpindi support team is available to assist you.</p>
        </div>
        <Link
          to={ROUTES.how}
          className="rounded-lg bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-[#16406b] transition-colors"
        >
          How Fixly Works
        </Link>
      </div>

    </div>
  );
}
