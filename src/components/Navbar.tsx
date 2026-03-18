import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { EVENTS } from '../constants/events';

const NAV_EVENTS = EVENTS.filter(e => e.type !== 'betrothal');

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileOpen]);

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 inset-x-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-sm' : ''} border-b border-gray-100`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">I</span>
            </div>
            <span className="text-lg font-bold text-gray-900">Invitation.AI</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_EVENTS.map(event => (
              <Link
                key={event.slug}
                to={event.urlPath}
                aria-current={isActive(event.urlPath) ? 'page' : undefined}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(event.urlPath)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {event.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Login
            </Link>
            <Link
              to="/events/wedding"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Create Website
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 -mr-2 text-gray-600 hover:text-gray-900"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden bg-white border-b border-gray-100"
          >
            <div className="px-4 py-3 space-y-1">
              {EVENTS.map(event => (
                <Link
                  key={event.slug}
                  to={event.urlPath}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive(event.urlPath) ? 'page' : undefined}
                  className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive(event.urlPath)
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {event.label}
                </Link>
              ))}
              <div className="pt-3 mt-2 border-t border-gray-100 space-y-2">
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                  className="block w-full py-2.5 text-sm font-medium text-gray-600 text-center hover:text-gray-900">
                  Login
                </Link>
                <Link to="/events/wedding" onClick={() => setMobileOpen(false)}
                  className="block w-full py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg text-center hover:bg-gray-800">
                  Create Website
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
