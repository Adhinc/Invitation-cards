import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { EVENTS } from '../constants/events';

const DESKTOP_EVENTS = EVENTS.filter(e => e.type !== 'betrothal');

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 shrink-0">
            <Sparkles className="h-4 w-4 text-[#C85C6C]" />
            <span className="text-lg font-serif italic font-semibold text-[#C85C6C]">
              BigDate
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {DESKTOP_EVENTS.map(event => (
              <Link
                key={event.slug}
                to={event.urlPath}
                className={`px-2.5 py-1.5 text-[13px] font-medium rounded-full transition-colors ${
                  isActive(event.urlPath)
                    ? 'bg-[#C85C6C] text-white'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {event.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-3">
            <button className="text-[13px] font-medium text-gray-400 cursor-not-allowed">
              Login
            </button>
            <Link
              to="/events/wedding"
              className="px-4 py-1.5 text-[13px] font-semibold text-white bg-[#C85C6C] rounded-full hover:bg-[#b34d5c] transition-colors"
            >
              Create
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-1.5 text-gray-500"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden bg-white border-b border-gray-100"
          >
            <div className="px-5 py-3 space-y-0.5">
              {EVENTS.map(event => (
                <Link
                  key={event.slug}
                  to={event.urlPath}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 text-[13px] font-medium rounded-lg transition-colors ${
                    isActive(event.urlPath)
                      ? 'bg-[#C85C6C] text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {event.label}
                </Link>
              ))}
              <div className="pt-3 mt-2 border-t border-gray-100 flex gap-2">
                <button className="flex-1 py-2 text-[13px] font-medium text-gray-400 border border-gray-200 rounded-lg cursor-not-allowed">
                  Login
                </button>
                <Link
                  to="/events/wedding"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 py-2 text-[13px] font-semibold text-white bg-[#C85C6C] rounded-lg text-center hover:bg-[#b34d5c]"
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
