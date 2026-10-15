import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/routes.js';

export default function CustomerHistoryPage() {
  const [selectedJob, setSelectedJob] = useState(null);

  const pastRepairs = [
    {
      id: 'FX-2188',
      service: 'Appliance Repair',
      problem: 'Washing machine drum not spinning',
      provider: 'Bilal Ahmed',
      providerRating: 4.6,
      date: '12 days ago',
      price: 'PKR 2,500',
      paymentMethod: 'JazzCash',
      paymentStatus: 'Paid',
      warranty: '30-day warranty (18 days remaining)',
      warrantyActive: true,
      userRating: 4,
      comment: 'Very professional, arrived on time.',
    },
    {
      id: 'FX-2031',
      service: 'AC Repair',
      problem: 'AC running but room stays warm',
      provider: 'Usman Tariq',
      providerRating: 4.8,
      date: '6 months ago',
      price: 'PKR 3,200',
      paymentMethod: 'Cash',
      paymentStatus: 'Paid',
      warranty: '90-day warranty (Expired)',
      warrantyActive: false,
      userRating: 5,
      comment: 'Fixed cooling leak quickly. Good behavior.',
    },
  ];

  return (
    <div className="mx-auto max-w-[960px] space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy">Repair History</h1>
          <p className="mt-1 text-sm text-muted">View records of your completed jobs, receipts, and warranties.</p>
        </div>
        <Link
          to={ROUTES.dashboard}
          className="inline-block rounded-xl bg-brand px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-[#1648a0] transition-colors"
        >
          Book Another Service
        </Link>
      </div>

      {/* Repairs Table / Cards */}
      <div className="rounded-xl border border-line bg-white shadow-2xs overflow-hidden">
        
        {/* Table Header for desktop */}
        <div className="hidden sm:grid grid-cols-[1.5fr_1.2fr_1fr_1fr_1fr_auto] gap-4 p-4 border-b border-line bg-page/50 text-xs font-bold text-muted uppercase">
          <span>Job Details</span>
          <span>Provider</span>
          <span>Date</span>
          <span>Price</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {/* List items */}
        <div className="divide-y divide-line">
          {pastRepairs.map((job) => (
            <div
              key={job.id}
              className="p-4 sm:p-5 flex flex-col sm:grid sm:grid-cols-[1.5fr_1.2fr_1fr_1fr_1fr_auto] gap-3 sm:gap-4 items-start sm:items-center hover:bg-slate-50 transition-colors"
            >
              <div>
                <span className="text-xs font-bold text-muted">{job.id}</span>
                <h3 className="text-sm font-bold text-navy">{job.service}</h3>
                <p className="text-xs text-muted truncate">{job.problem}</p>
              </div>

              <div>
                <span className="text-sm font-semibold text-navy">{job.provider}</span>
                <p className="text-xs text-amber-600 font-medium">★ {job.providerRating}</p>
              </div>

              <div className="text-xs text-muted sm:text-sm">
                {job.date}
              </div>

              <div>
                <span className="text-sm font-bold text-navy">{job.price}</span>
                <p className="text-[11px] text-muted">{job.paymentMethod}</p>
              </div>

              <div>
                <span className="inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-800">
                  ✓ {job.paymentStatus}
                </span>
                <p className="mt-1 text-[11px] text-muted">
                  {job.warrantyActive ? '🛡️ Warranty Active' : 'Warranty Expired'}
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setSelectedJob(job)}
                  className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand-light transition-colors cursor-pointer"
                >
                  View Receipt
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal for Receipt / Details */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-[500px] rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h2 className="text-lg font-bold text-navy">Repair Receipt #{selectedJob.id}</h2>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="text-muted hover:text-navy font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Service:</span>
                <span className="font-semibold text-navy">{selectedJob.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Issue:</span>
                <span className="font-semibold text-navy text-right">{selectedJob.problem}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Technician:</span>
                <span className="font-semibold text-navy">{selectedJob.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Date Completed:</span>
                <span className="font-semibold text-navy">{selectedJob.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Total Paid:</span>
                <span className="font-bold text-brand text-base">{selectedJob.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Payment Mode:</span>
                <span className="font-semibold text-navy">{selectedJob.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Warranty:</span>
                <span className="font-semibold text-green-700">{selectedJob.warranty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Your Rating:</span>
                <span className="font-bold text-amber-500">{'★'.repeat(selectedJob.userRating)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-line flex justify-end gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-lg border border-line px-4 py-2 text-xs font-semibold text-navy hover:bg-navy-light"
              >
                Print Receipt
              </button>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="rounded-lg bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-[#16406b]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
