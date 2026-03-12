import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { EVENTS } from '../constants/events';

// Desktop: hide Betrothal to save space (7 items shown)
const DESKTOP_EVENTS = EVENTS.filter(e => e.type !== 'betrothal');

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur border-b border-rose-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 shrink-0">
            <Sparkles className="h-5 w-5 text-[#C85C6C]" />
            <span className="text-xl font-serif italic font-semibold text-[#C85C6C]">
              BigDate
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {DESKTOP_EVENTS.map(event => (
              <Link
                key={event.slug}
                to={event.urlPath}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  isActive(event.urlPath)
                    ? 'bg-[#C85C6C] text-white'
                    : 'text-gray-600 hover:text-[#C85C6C] hover:bg-rose-50'
                }`}
              >
                {event.label}
              </Link>
            ))}
            <Link
              to="/pricing"
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                isActive('/pricing')
                  ? 'bg-[#C85C6C] text-white'
                  : 'text-gray-600 hover:text-[#C85C6C] hover:bg-rose-50'
              }`}
            >
              Pricing
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-[#C85C6C] transition-colors"
            >
              Login
            </Link>
            <Link
              to="/create-your-wedding-website"
              className="px-4 py-2 text-sm font-semibold text-white bg-[#C85C6C] rounded-full hover:bg-[#b34d5c] transition-colors"
            >
              Create
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-[#C85C6C]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden bg-white/95 backdrop-blur border-b border-rose-100"
          >
            <div className="px-4 py-4 space-y-1">
              {EVENTS.map(event => (
                <Link
                  key={event.slug}
                  to={event.urlPath}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive(event.urlPath)
                      ? 'bg-[#C85C6C] text-white'
                      : 'text-gray-700 hover:bg-rose-50 hover:text-[#C85C6C]'
                  }`}
                >
                  {event.label}
                </Link>
              ))}
              <Link
                to="/pricing"
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive('/pricing')
                    ? 'bg-[#C85C6C] text-white'
                    : 'text-gray-700 hover:bg-rose-50 hover:text-[#C85C6C]'
                }`}
              >
                Pricing
              </Link>

              <div className="pt-3 mt-3 border-t border-rose-100 flex items-center gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2.5 text-sm font-medium text-gray-600 hover:text-[#C85C6C] rounded-lg border border-gray-200"
                >
                  Login
                </Link>
                <Link
                  to="/create-your-wedding-website"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2.5 text-sm font-semibold text-white bg-[#C85C6C] rounded-lg hover:bg-[#b34d5c]"
                >
                  Create
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
