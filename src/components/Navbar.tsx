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
  const [hoveredMobileCta, setHoveredMobileCta] = useState(false);
  const [hoveredHamburger, setHoveredHamburger] = useState(false);
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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255, 251, 248, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'box-shadow 0.2s',
        boxShadow: scrolled ? '0 1px 3px rgba(45,42,38,0.06)' : 'none',
        borderBottom: '1px solid #F0E6DC',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', height: 64, alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, textDecoration: 'none' }}>
            <div
              style={{
                width: 32,
                height: 32,
                backgroundColor: '#B8405E',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>I</span>
            </div>
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#1F1A1B',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
              }}
            >
              Invitation.AI
            </span>
          </Link>

          {/* Desktop nav pills — className kept for responsive display only */}
          <div className="hidden lg:flex" style={{ alignItems: 'center', gap: 6 }}>
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
                    background: active ? accent : `${accent}14`,
                    color: active ? '#fff' : accent,
                    border: `1.5px solid ${active ? accent : `${accent}30`}`,
                    boxShadow: active ? `0 4px 12px ${accent}40` : 'none',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = accent;
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.borderColor = accent;
                      e.currentTarget.style.boxShadow = `0 4px 12px ${accent}40`;
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
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

          {/* Desktop right actions — className kept for responsive display only */}
          <div className="hidden lg:flex" style={{ alignItems: 'center', gap: 12 }}>
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

          {/* Hamburger — className kept for lg:hidden responsive display only */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden"
            aria-label="Toggle menu"
            style={{
              padding: 8,
              marginRight: -8,
              color: hoveredHamburger ? '#B8405E' : '#4A4744',
              transition: 'color 0.2s',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={() => setHoveredHamburger(true)}
            onMouseLeave={() => setHoveredHamburger(false)}
          >
            {mobileOpen
              ? <X style={{ width: 24, height: 24 }} />
              : <Menu style={{ width: 24, height: 24 }} />
            }
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
            /* className kept for lg:hidden responsive display only */
            className="lg:hidden"
            style={{
              overflow: 'hidden',
              backgroundColor: '#FFFBF8',
              borderBottom: '1px solid #F0E6DC',
            }}
          >
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {EVENTS.map(event => (
                <Link
                  key={event.slug}
                  to={event.urlPath}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive(event.urlPath) ? 'page' : undefined}
                  style={{
                    display: 'block',
                    padding: '10px 12px',
                    fontSize: 14,
                    fontWeight: 500,
                    borderRadius: 8,
                    transition: 'background-color 0.15s, color 0.15s',
                    textDecoration: 'none',
                    ...(isActive(event.urlPath)
                      ? { backgroundColor: `${event.accentColor}1F`, color: event.accentColor }
                      : { color: '#4A4744' }
                    ),
                  }}
                >
                  {event.label}
                </Link>
              ))}
              <div
                style={{
                  paddingTop: 12,
                  marginTop: 8,
                  borderTop: '1px solid #F0E6DC',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <Link
                  to="/events/wedding"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px 0',
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#fff',
                    backgroundColor: hoveredMobileCta ? '#A03650' : '#B8405E',
                    borderRadius: 50,
                    textAlign: 'center',
                    textDecoration: 'none',
                    boxShadow: '0 6px 28px rgba(184,64,94,0.4)',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={() => setHoveredMobileCta(true)}
                  onMouseLeave={() => setHoveredMobileCta(false)}
                >
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
