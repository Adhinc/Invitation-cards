import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { EVENTS } from '../constants/events';

const NAV_EVENTS = EVENTS.filter(e => e.type !== 'betrothal');

// Vibrant accent colors per event for navbar pills
const NAV_ACCENTS: Record<string, string> = {
  wedding: '#B8405E',
  birthday: '#9B59B6',
  baptism: '#5D9BCC',
  'holy-communion': '#C9A227',
  'naming-ceremony': '#E8A87C',
  'baby-shower': '#E87A90',
  housewarming: '#6B8E6B',
};

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
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-[#B8405E] rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">I</span>
            </div>
            <span className="text-lg font-bold text-[#1F1A1B]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Invitation.AI</span>
          </Link>

          <div className="hidden lg:flex items-center" style={{ gap: 6 }}>
            {NAV_EVENTS.map(event => {
              const accent = NAV_ACCENTS[event.slug] || '#4A4744';
              const active = isActive(event.urlPath);
              return (
                <Link
                  key={event.slug}
                  to={event.urlPath}
                  aria-current={active ? 'page' : undefined}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '5px 14px',
                    fontSize: 12.5,
                    fontWeight: 600,
                    borderRadius: 50,
                    transition: 'all 0.2s ease',
                    background: `${accent}14`,
                    color: accent,
                    border: `1.5px solid ${accent}30`,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = accent;
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.borderColor = accent;
                    e.currentTarget.style.boxShadow = `0 4px 12px ${accent}40`;
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = `${accent}14`;
                      e.currentTarget.style.color = accent;
                      e.currentTarget.style.borderColor = `${accent}30`;
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'none';
                    }
                  }}
                >
                  {event.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center" style={{ gap: 12 }}>
            <Link to="/dashboard" style={{ fontSize: 13, fontWeight: 500, color: '#4A4744', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#B8405E'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#4A4744'; }}
            >
              Login
            </Link>
            <Link
              to="/events/wedding"
              style={{
                padding: '10px 22px',
                fontSize: 13,
                fontWeight: 700,
                color: '#fff',
                background: '#B8405E',
                borderRadius: 50,
                textDecoration: 'none',
                transition: 'all 0.2s',
                boxShadow: '0 6px 28px rgba(184,64,94,0.4)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#A03650';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(184,64,94,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#B8405E';
                e.currentTarget.style.boxShadow = '0 6px 28px rgba(184,64,94,0.4)';
              }}
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
