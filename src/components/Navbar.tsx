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
      className={`fixed top-0 inset-x-0 z-50 bg-[#FFFBF8]/95 backdrop-blur-md transition-shadow duration-200 ${scrolled ? 'shadow-[0_1px_3px_rgba(45,42,38,0.06)]' : ''} border-b border-[#F0E6DC]`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-[#B8405E] rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">I</span>
            </div>
            <span className="text-lg font-bold text-[#2D2A26]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>Invitation.AI</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1.5">
            {NAV_EVENTS.map(event => (
              <Link
                key={event.slug}
                to={event.urlPath}
                aria-current={isActive(event.urlPath) ? 'page' : undefined}
                className="px-2.5 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-200"
                style={
                  isActive(event.urlPath)
                    ? { backgroundColor: `${event.accentColor}1F`, color: event.accentColor, border: `1px solid ${event.accentColor}40` }
                    : { color: '#4A4744', border: '1px solid transparent' }
                }
                onMouseEnter={(e) => {
                  if (!isActive(event.urlPath)) {
                    e.currentTarget.style.backgroundColor = `${event.accentColor}12`;
                    e.currentTarget.style.color = event.accentColor;
                    e.currentTarget.style.border = `1px solid ${event.accentColor}25`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(event.urlPath)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#4A4744';
                    e.currentTarget.style.border = '1px solid transparent';
                  }
                }}
              >
                {event.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/dashboard" className="text-[13px] font-medium text-[#4A4744] hover:text-[#B8405E] transition-colors">
              Login
            </Link>
            <Link
              to="/events/wedding"
              className="px-5 py-2.5 text-[13px] font-bold text-white bg-[#B8405E] rounded-full hover:bg-[#A03650] transition-all shadow-[0_6px_28px_rgba(184,64,94,0.4)] hover:shadow-[0_8px_32px_rgba(184,64,94,0.5)]"
            >
              Create Website
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 -mr-2 text-[#4A4744] hover:text-[#B8405E]"
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
            className="lg:hidden overflow-hidden bg-[#FFFBF8] border-b border-[#F0E6DC]"
          >
            <div className="px-4 py-3 space-y-1">
              {EVENTS.map(event => (
                <Link
                  key={event.slug}
                  to={event.urlPath}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive(event.urlPath) ? 'page' : undefined}
                  className="block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
                  style={
                    isActive(event.urlPath)
                      ? { backgroundColor: `${event.accentColor}1F`, color: event.accentColor }
                      : { color: '#4A4744' }
                  }
                >
                  {event.label}
                </Link>
              ))}
              <div className="pt-3 mt-2 border-t border-[#F0E6DC] space-y-2">
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                  className="block w-full py-2.5 text-sm font-medium text-[#4A4744] text-center hover:text-[#B8405E]">
                  Login
                </Link>
                <Link to="/events/wedding" onClick={() => setMobileOpen(false)}
                  className="block w-full py-2.5 text-sm font-bold text-white bg-[#B8405E] rounded-full text-center hover:bg-[#A03650] shadow-[0_6px_28px_rgba(184,64,94,0.4)]">
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
