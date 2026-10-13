import technicianDoorImage from '../assets/images/Friendly Fixly Technician at the Door.png';
import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/routes.js';

// AuthLayout provides the split-screen design matching the Fixly prototype:
// Visual card on the left and form panel on the right
export default function AuthLayout({ children }) {
  return (
    <div className="mx-auto my-8 max-w-[1100px] px-4">
      <div className="grid min-h-[580px] items-center gap-8 tablet:grid-cols-2 tablet:gap-12">
        {/* Left Visual Side */}
        <div className="relative hidden h-full min-h-[500px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-line bg-navy p-8 text-white tablet:flex shadow-sm">
          <div className="relative z-10">
            <Link
              to={ROUTES.home}
              className="inline-block text-2xl font-bold tracking-wider text-white hover:opacity-90"
            >
              FIXLY
            </Link>
            <p className="mt-2 text-sm text-navy-light/80">
              Trusted home and office repairs in Islamabad &amp; Rawalpindi.
            </p>
          </div>

          <div className="relative z-10 rounded-xl bg-navy/85 p-5 backdrop-blur-xs border border-white/10">
            <p className="text-base font-medium text-white">
              “Compare verified technician prices, track who arrives at your doorstep, and pay safely.”
            </p>
            <p className="mt-2 text-xs font-semibold text-brand-light">
              ✓ 100% Fixly Verified Professionals
            </p>
          </div>

          {/* Background Illustration / Photo */}
          <img
            src={technicianDoorImage}
            alt="Technician helping customer"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
        </div>

        {/* Right Form Side */}
        <div className="mx-auto w-full max-w-[480px] rounded-2xl border border-line bg-white p-6 phone:p-8 shadow-xs">
          {children}
        </div>
      </div>
    </div>
  );
}
