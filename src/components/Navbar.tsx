import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { EVENTS } from '../constants/events';

const DESKTOP_EVENTS = EVENTS.filter(e => e.type !== 'betrothal');

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    if (!mobileOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileOpen]);

  return (
    <nav aria-label="Main navigation" className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 shrink-0">
            <Sparkles className="h-4 w-4 text-[var(--color-primary)]" />
            <span className="text-lg font-serif italic font-semibold text-[var(--color-primary)]">
              BigDate
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {DESKTOP_EVENTS.map(event => (
              <Link
                key={event.slug}
                to={event.urlPath}
                aria-current={isActive(event.urlPath) ? 'page' : undefined}
                className={`px-2.5 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  isActive(event.urlPath)
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {event.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center">
            <Link
              to="/events/wedding"
              className="px-5 py-1.5 text-sm font-semibold text-white bg-[var(--color-primary)] rounded-full hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              Create
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2.5 -mr-2 text-[var(--color-text-secondary)]"
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
                  aria-current={isActive(event.urlPath) ? 'page' : undefined}
                  className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive(event.urlPath)
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'text-[var(--color-text-secondary)] hover:bg-gray-50'
                  }`}
                >
                  {event.label}
                </Link>
              ))}
              <div className="pt-3 mt-2 border-t border-gray-100">
                <Link
                  to="/events/wedding"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full py-2.5 text-sm font-semibold text-white bg-[var(--color-primary)] rounded-lg text-center hover:bg-[var(--color-primary-hover)]"
                >
                  Create Invitation
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
