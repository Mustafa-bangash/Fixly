import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/authSlice.js';
import { ROUTES } from '../../utils/routes.js';

// Popular services list with simple icons and details
const POPULAR_SERVICES = [
  { id: 'ac', name: 'AC Repair', desc: 'Cooling, gas refill, servicing', icon: '❄️' },
  { id: 'electrician', name: 'Electrician', desc: 'Wiring, lights, power switches', icon: '⚡' },
  { id: 'plumber', name: 'Plumber', desc: 'Leakage, taps, pipes, drains', icon: '🔧' },
  { id: 'appliance', name: 'Appliance Repair', desc: 'Washing machine, fridge, oven', icon: '🔌' },
  { id: 'carpenter', name: 'Carpenter', desc: 'Doors, windows, cupboards, wood', icon: '🪚' },
  { id: 'cleaning', name: 'Cleaning', desc: 'Deep home cleaning, water tanks', icon: '🧹' },
];

export default function CustomerDashboardPage() {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Time ke mutabiq dynamic greeting (Good morning, afternoon, evening)
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = user?.fullName || 'Customer';

  // 2. Search filter - user jo type karega us k mutabiq services filter hon gi
  const filteredServices = POPULAR_SERVICES.filter((svc) =>
    svc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    svc.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Main 2-Column Layout matching Fixly Prototype */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
        
        {/* LEFT COLUMN: Hero banner, search, popular services, emergency */}
        <div className="space-y-7">
          
          {/* Dark Hero Card */}
          <div className="rounded-2xl bg-navy p-7 text-white shadow-md relative overflow-hidden">
            <div className="max-w-[520px]">
              <p className="text-sm font-medium text-blue-200">
                {getGreeting()}, <span className="font-semibold text-white">{displayName}</span>
              </p>
              <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
                What do you need help with?
              </h1>
              <p className="mt-2 text-sm sm:text-base text-blue-100/90 leading-relaxed">
                Post your repair problem, receive prices from verified local providers, and pick the best offer.
              </p>

              {/* Action Button */}
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.requests)}
                  className="rounded-xl bg-brand px-6 py-3 text-base font-semibold text-white shadow-xs hover:bg-[#1648a0] transition-colors cursor-pointer"
                >
                  Get a Service
                </button>
              </div>

              {/* Live Search Bar */}
              <div className="mt-6">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a service (e.g. AC, plumber, wiring)..."
                  className="w-full rounded-xl bg-white px-4 py-3 text-sm text-ink placeholder-muted shadow-xs outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>
          </div>

          {/* Popular Services Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-navy">Popular Services</h2>
              <span className="text-xs font-medium text-muted">Islamabad & Rawalpindi</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => navigate(ROUTES.requests)}
                  className="group flex flex-col items-center justify-center rounded-xl border border-line bg-white p-5 text-center shadow-2xs hover:border-brand hover:shadow-xs transition-all cursor-pointer"
                >
                  <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </span>
                  <h3 className="text-base font-bold text-navy group-hover:text-brand">
                    {service.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted leading-tight">
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="rounded-xl border border-dashed border-line bg-white p-6 text-center text-sm text-muted">
                No services found matching &ldquo;{searchQuery}&rdquo;.
              </div>
            )}
          </div>

          {/* Emergency Alert Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border-2 border-danger bg-red-50/50 p-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🚨</span>
                <h3 className="text-base font-bold text-danger">Having an Emergency?</h3>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-muted">
                Dangerous sparks, gas leak smell, or urgent water flooding? Get instant guidance and immediate help.
              </p>
            </div>
            <Link
              to={ROUTES.emergency}
              className="inline-block whitespace-nowrap rounded-lg border-2 border-danger bg-white px-4 py-2 text-sm font-bold text-danger hover:bg-danger hover:text-white transition-colors"
            >
              Get Emergency Help
            </Link>
          </div>
        </div>

        {/* RIGHT SIDEBAR: Active Request, Maintenance Reminder, Why Fixly */}
        <aside className="space-y-6">
          
          {/* Active Request Card */}
          <div className="rounded-xl border border-line bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="text-base font-bold text-navy">Active Request</h3>
              <span className="rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-semibold text-brand">
                In Progress
              </span>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-light text-xl">
                  ❄️
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy">AC Cooling & Gas Refill</h4>
                  <p className="text-xs text-muted">Request ID: #FX-2188</p>
                  <p className="text-xs font-medium text-brand mt-1">
                    3 service providers sent offers
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-line flex gap-2">
                <Link
                  to={ROUTES.requests}
                  className="flex-1 rounded-lg bg-brand py-2 text-center text-xs font-bold text-white hover:bg-[#1648a0] transition-colors"
                >
                  View Offers
                </Link>
                <Link
                  to={ROUTES.messages}
                  className="rounded-lg border border-line px-3 py-2 text-center text-xs font-semibold text-navy hover:bg-navy-light transition-colors"
                >
                  Chat
                </Link>
              </div>
            </div>
          </div>

          {/* Maintenance Reminder Card */}
          <div className="rounded-xl border border-line bg-white p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-navy">Seasonal Maintenance Tip</h3>
            <p className="mt-1.5 text-xs text-muted leading-relaxed">
              Before the hot summer peak in Rawalpindi & Islamabad, get your AC filters cleaned and gas pressure checked to avoid high electricity bills.
            </p>
            <div className="mt-3">
              <Link
                to={ROUTES.requests}
                className="text-xs font-bold text-brand hover:underline"
              >
                Schedule AC checkup →
              </Link>
            </div>
          </div>

          {/* Why Fixly Trust Guarantees */}
          <div className="rounded-xl border border-line bg-white p-5 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-navy">Why Fixly?</h3>
            <ul className="space-y-2.5 text-xs text-ink font-medium">
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Verified & CNIC checked service technicians</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Multiple transparent bids with no hidden costs</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Direct payment to provider after satisfaction</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Real reviews and job completion history</span>
              </li>
            </ul>
          </div>

        </aside>

      </div>
    </div>
  );
}
