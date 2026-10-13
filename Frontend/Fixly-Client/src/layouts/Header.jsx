import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/routes.js';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white shadow-xs">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-3 px-5 py-3">
        {/* Brand Logo */}
        <Link
          to={ROUTES.home}
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

        {/* Desktop Navigation Links */}
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
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-line bg-white px-5 py-4 phone:hidden flex flex-col gap-2">
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
        </div>
      )}
    </header>
  );
}
