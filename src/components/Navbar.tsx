import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { EVENTS } from '../constants/events';
import { useAuth } from '../lib/auth';

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
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, signInWithGoogle, signOut, loading } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

          {/* Right actions — always visible */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            {user && (
              <Link
                to="/dashboard"
                aria-current={isActive('/dashboard') ? 'page' : undefined}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '5px 14px',
                  fontSize: 12.5,
                  fontWeight: 600,
                  borderRadius: 50,
                  transition: 'all 0.2s ease',
                  background: isActive('/dashboard') ? '#4A4744' : '#4A474414',
                  color: isActive('/dashboard') ? '#fff' : '#4A4744',
                  border: `1.5px solid ${isActive('/dashboard') ? '#4A4744' : '#4A474430'}`,
                  boxShadow: isActive('/dashboard') ? '0 4px 12px #4A474440' : 'none',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/dashboard')) {
                    e.currentTarget.style.background = '#4A4744';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.borderColor = '#4A4744';
                    e.currentTarget.style.boxShadow = '0 4px 12px #4A474440';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/dashboard')) {
                    e.currentTarget.style.background = '#4A474414';
                    e.currentTarget.style.color = '#4A4744';
                    e.currentTarget.style.borderColor = '#4A474430';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'none';
                  }
                }}
              >
                Dashboard
              </Link>
            )}
            {!loading && !user && (
              <button
                onClick={() => signInWithGoogle()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  borderRadius: 50,
                  border: '1.5px solid #4A474430',
                  background: 'transparent',
                  color: '#4A4744',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#4A4744';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.borderColor = '#4A4744';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#4A4744';
                  e.currentTarget.style.borderColor = '#4A474430';
                }}
              >
                Sign In
              </button>
            )}
            {user && (
              <button
                onClick={() => signOut()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 12px',
                  fontSize: 12,
                  fontWeight: 500,
                  borderRadius: 50,
                  border: '1px solid #E0D6CC',
                  background: 'transparent',
                  color: '#7A7470',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FEF2F2';
                  e.currentTarget.style.color = '#DC2626';
                  e.currentTarget.style.borderColor = '#FECACA';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#7A7470';
                  e.currentTarget.style.borderColor = '#E0D6CC';
                }}
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
