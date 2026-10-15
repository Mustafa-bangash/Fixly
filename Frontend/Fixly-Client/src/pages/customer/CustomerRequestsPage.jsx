import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/routes.js';

export default function CustomerRequestsPage() {
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'completed'

  const mockRequests = [
    {
      id: 'FX-2188',
      service: 'AC Repair & Gas Refilling',
      problem: 'AC running but not cooling properly',
      area: 'Satellite Town, Rawalpindi',
      status: 'Waiting for prices',
      offersCount: 3,
      time: 'Posted 2 hours ago',
      urgent: false,
    },
    {
      id: 'FX-2140',
      service: 'Plumber',
      problem: 'Bathroom water leakage under sink',
      area: 'F-10/2, Islamabad',
      status: 'Provider on the way',
      offersCount: 4,
      time: 'Posted Today, 10:30 AM',
      urgent: true,
    },
  ];

  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      
      {/* Title Bar with New Request CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy">My Service Requests</h1>
          <p className="mt-1 text-sm text-muted">Track your active repair jobs and compare provider bids.</p>
        </div>
        <Link
          to={ROUTES.dashboard}
          className="inline-block rounded-xl bg-brand px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-[#1648a0] transition-colors"
        >
          + Request New Service
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-line gap-4">
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          className={`pb-3 text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'active'
              ? 'border-b-2 border-brand text-brand'
              : 'text-muted hover:text-navy'
          }`}
        >
          Active Requests ({mockRequests.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('completed')}
          className={`pb-3 text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'completed'
              ? 'border-b-2 border-brand text-brand'
              : 'text-muted hover:text-navy'
          }`}
        >
          Completed / Closed
        </button>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {activeTab === 'active' ? (
          mockRequests.map((req) => (
            <div
              key={req.id}
              className="rounded-xl border border-line bg-white p-5 shadow-2xs hover:border-brand transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-navy text-sm">{req.id}</span>
                  {req.urgent && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-danger">
                      Emergency
                    </span>
                  )}
                </div>
                <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
                  {req.status}
                </span>
              </div>

              <div className="mt-3.5 space-y-1">
                <h3 className="text-base font-bold text-navy">{req.service}</h3>
                <p className="text-sm text-muted">{req.problem}</p>
                <p className="text-xs text-muted">📍 Location: {req.area} · {req.time}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-line flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
                  {req.offersCount} Providers sent bids
                </span>
                <div className="flex gap-2">
                  <Link
                    to={ROUTES.messages}
                    className="rounded-lg border border-line px-3.5 py-1.5 text-xs font-semibold text-navy hover:bg-navy-light"
                  >
                    Chat
                  </Link>
                  <button
                    type="button"
                    onClick={() => alert(`Showing bids for ${req.id}`)}
                    className="rounded-lg bg-brand px-4 py-1.5 text-xs font-bold text-white hover:bg-[#1648a0]"
                  >
                    View Offers
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-line bg-white p-8 text-center text-sm text-muted">
            <p>No completed requests yet in this session.</p>
            <Link to={ROUTES.history} className="mt-2 inline-block font-semibold text-brand hover:underline">
              Check your past Repair History →
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
