import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated, clearUser } from '../store/authSlice.js';
import { logoutUser } from '../api/authApi.js';
import { ROUTES } from '../utils/routes.js';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Redux state se current logged-in user check kar rahe hain
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Mobile menu aur alerts/profile dropdown toggles
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Sample alerts/notifications matching prototype
  const [notifications] = useState([
    'Bilal Ahmed sent a bid of PKR 2,500 on your AC request.',
    'Your request #FX-2188 is now active and receiving quotes.',
  ]);

  // Logout function
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore network errors on logout
    }
    dispatch(clearUser());
    setProfileDropdownOpen(false);
    navigate(ROUTES.home);
  };

  // Helper function to check active nav link
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white shadow-xs">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-3 px-5 py-3">
        
        {/* Brand Logo - Links to Dashboard if logged in, otherwise Home */}
        <Link
          to={isAuthenticated ? ROUTES.dashboard : ROUTES.home}
          className="text-[22px] font-bold tracking-[1px] text-navy hover:opacity-90"
        >
          FIXLY
        </Link>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="phone:hidden rounded-md border border-line px-3 py-2 text-sm font-semibold text-navy hover:bg-navy-light"
          aria-label="Toggle navigation menu"
        >
          ☰ Menu
        </button>

        {/* ============================================================== */}
        {/* 1. LOGGED-IN CUSTOMER NAVIGATION                                */}
        {/* ============================================================== */}
        {isAuthenticated ? (
          <div className="hidden phone:flex items-center gap-2">
            
            {/* Main Tabs matching prototype hdr() */}
            <nav className="flex items-center gap-1 mr-2">
              <Link
                to={ROUTES.dashboard}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(ROUTES.dashboard) || isActive(ROUTES.home)
                    ? 'bg-page text-navy font-bold'
                    : 'text-muted hover:text-navy hover:bg-navy-light/60'
                }`}
              >
                Home
              </Link>
              <Link
                to={ROUTES.requests}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(ROUTES.requests)
                    ? 'bg-page text-navy font-bold'
                    : 'text-muted hover:text-navy hover:bg-navy-light/60'
                }`}
              >
                My Requests
              </Link>
              <Link
                to={ROUTES.messages}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors relative ${
                  isActive(ROUTES.messages)
                    ? 'bg-page text-navy font-bold'
                    : 'text-muted hover:text-navy hover:bg-navy-light/60'
                }`}
              >
                Messages
                <span className="inline-block w-2 h-2 rounded-full bg-brand ml-1"></span>
              </Link>
              <Link
                to={ROUTES.history}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(ROUTES.history)
                    ? 'bg-page text-navy font-bold'
                    : 'text-muted hover:text-navy hover:bg-navy-light/60'
                }`}
              >
                Repair History
              </Link>
            </nav>

            {/* Emergency Action Button (Red outline) */}
            <Link
              to={ROUTES.emergency}
              className="rounded-lg border-2 border-danger bg-white px-3 py-1.5 text-xs font-bold text-danger hover:bg-danger hover:text-white transition-colors"
            >
              Emergency
            </Link>

            {/* Alerts Dropdown Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setAlertsOpen(!alertsOpen);
                  setProfileDropdownOpen(false);
                }}
                className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-navy hover:bg-navy-light transition-colors cursor-pointer"
              >
                Alerts ({notifications.length})
              </button>

              {alertsOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl border border-line bg-white p-3 shadow-lg z-30">
                  <div className="flex items-center justify-between border-b border-line pb-2 mb-2">
                    <span className="text-xs font-bold text-navy uppercase">Recent Alerts</span>
                    <button
                      type="button"
                      onClick={() => setAlertsOpen(false)}
                      className="text-xs text-muted hover:text-navy font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-2 text-xs text-ink">
                    {notifications.map((note, i) => (
                      <div key={i} className="p-2 rounded-lg bg-page border border-line/60">
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setAlertsOpen(false);
                }}
                className="flex items-center gap-2 rounded-lg border border-line px-2.5 py-1 text-xs font-bold text-navy hover:bg-navy-light transition-colors cursor-pointer"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy text-[11px] text-white">
                  {user?.fullName?.charAt(0) || 'U'}
                </span>
                <span>{user?.fullName?.split(' ')[0] || 'Profile'}</span>
                <span>▾</span>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-line bg-white py-1.5 shadow-lg z-30">
                  <div className="px-3 py-2 border-b border-line">
                    <p className="text-xs font-bold text-navy truncate">{user?.fullName || 'Customer'}</p>
                    <p className="text-[11px] text-muted truncate">{user?.email || 'customer@fixly.pk'}</p>
                  </div>
                  <Link
                    to={ROUTES.profile}
                    onClick={() => setProfileDropdownOpen(false)}
                    className="block px-3 py-2 text-xs font-semibold text-ink hover:bg-navy-light"
                  >
                    View & Edit Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-danger hover:bg-red-50 cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>

          </div>
        ) : (
          /* ============================================================== */
          /* 2. PUBLIC / LOGGED-OUT NAVIGATION                              */
          /* ============================================================== */
          <nav className="hidden phone:flex items-center gap-2">
            <Link
              to={ROUTES.how}
              className="rounded-lg px-3.5 py-2 text-base text-muted hover:text-navy hover:bg-navy-light/60 transition-colors"
            >
              How Fixly Works
            </Link>
            <Link
              to={ROUTES.login}
              className="rounded-lg px-3.5 py-2 text-base font-medium text-navy hover:bg-navy-light transition-colors"
            >
              Sign In
            </Link>
            <Link
              to={ROUTES.signup}
              className="rounded-lg bg-brand px-4 py-2 text-base font-semibold text-white hover:bg-[#1648a0] transition-colors"
            >
              Join as a Customer
            </Link>
            <Link
              to={ROUTES.providerSignup}
              className="rounded-lg border border-line px-3.5 py-2 text-base font-medium text-navy hover:bg-navy-light transition-colors"
            >
              Join as a Provider
            </Link>
          </nav>
        )}

      </div>

      {/* ============================================================== */}
      {/* MOBILE MENU DROPDOWN                                           */}
      {/* ============================================================== */}
      {mobileMenuOpen && (
        <div className="border-t border-line bg-white px-5 py-4 phone:hidden flex flex-col gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to={ROUTES.dashboard}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-semibold text-navy hover:bg-navy-light"
              >
                Home
              </Link>
              <Link
                to={ROUTES.requests}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-semibold text-navy hover:bg-navy-light"
              >
                My Requests
              </Link>
              <Link
                to={ROUTES.messages}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-semibold text-navy hover:bg-navy-light"
              >
                Messages
              </Link>
              <Link
                to={ROUTES.history}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-semibold text-navy hover:bg-navy-light"
              >
                Repair History
              </Link>
              <Link
                to={ROUTES.emergency}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md border border-danger px-3 py-2 text-sm font-bold text-danger text-center"
              >
                🚨 Emergency Guidance
              </Link>
              <Link
                to={ROUTES.profile}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-semibold text-navy hover:bg-navy-light"
              >
                Profile Settings
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left rounded-md px-3 py-2 text-sm font-bold text-danger hover:bg-red-50"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to={ROUTES.how}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-base text-muted hover:bg-navy-light"
              >
                How Fixly Works
              </Link>
              <Link
                to={ROUTES.login}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-base font-semibold text-navy hover:bg-navy-light"
              >
                Sign In
              </Link>
              <Link
                to={ROUTES.signup}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md bg-brand px-3 py-2 text-base font-semibold text-white text-center"
              >
                Join as a Customer
              </Link>
              <Link
                to={ROUTES.providerSignup}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md border border-line px-3 py-2 text-base font-semibold text-navy text-center"
              >
                Join as a Provider
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
