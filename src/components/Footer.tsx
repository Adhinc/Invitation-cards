import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail } from 'lucide-react';
import { EVENTS } from '../constants/events';

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      aria-label={label}
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        background: hovered ? '#B8405E' : '#3D3A36',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.2s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </a>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={to}
      style={{
        fontSize: 14,
        fontFamily: "'Nunito Sans', sans-serif",
        color: hovered ? '#D4687C' : '#A8A4A0',
        transition: 'color 0.2s',
        textDecoration: 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  const [ctaHovered, setCtaHovered] = useState(false);

  return (
    <footer>
      {/* Let's Get In Touch CTA Section */}
      <div style={{ background: 'linear-gradient(to bottom, #FFFBF8, #FFF0F4)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 36, lineHeight: 1.2, marginBottom: 16, color: '#1F1A1B' }}>
            Let's Get In Touch
          </h2>
          <p style={{ fontFamily: "'Nunito Sans', sans-serif", color: '#4A4044', fontSize: 16, lineHeight: 1.6, maxWidth: 420, margin: '0 auto', marginBottom: 32 }}>
            Ready to create something beautiful? We'd love to help you celebrate.
          </p>
          <Link
            to="/events/wedding"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: '#fff',
              background: '#B8405E',
              padding: '14px 32px',
              borderRadius: 28,
              fontSize: 15,
              fontWeight: 600,
              fontFamily: "'Nunito Sans', sans-serif",
              boxShadow: ctaHovered ? '0 8px 32px rgba(184,64,94,0.5)' : '0 6px 28px rgba(184,64,94,0.4)',
              transform: ctaHovered ? 'translateY(-2px)' : 'translateY(0)',
              transition: 'all 0.2s',
              textDecoration: 'none',
            }}
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
          >
            Create Your Invitation
          </Link>
        </div>
      </div>

      {/* Footer Links */}
      <div style={{ background: '#1F1A1B', color: '#A8A4A0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px' }}>
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 32 }}>
            <div className="col-span-2 md:col-span-1">
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, textDecoration: 'none' }}>
                <div style={{ width: 28, height: 28, background: '#B8405E', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontSize: 12, fontWeight: 700, fontFamily: "'Nunito Sans', sans-serif" }}>I</span>
                </div>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Invitation.AI</span>
              </Link>
              <p style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 16, maxWidth: 240, fontFamily: "'Nunito Sans', sans-serif", color: 'rgba(255,255,255,0.6)' }}>
                Create beautiful digital invitation websites for every celebration.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <SocialIcon href="#" label="Instagram">
                  <Instagram style={{ width: 16, height: 16, color: '#A8A4A0' }} />
                </SocialIcon>
                <SocialIcon href="#" label="WhatsApp">
                  <MessageCircle style={{ width: 16, height: 16, color: '#A8A4A0' }} />
                </SocialIcon>
                <SocialIcon href="#" label="Email">
                  <Mail style={{ width: 16, height: 16, color: '#A8A4A0' }} />
                </SocialIcon>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 16, fontFamily: "'Nunito Sans', sans-serif" }}>Events</h4>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {EVENTS.slice(0, 5).map(ev => (
                  <li key={ev.slug}>
                    <FooterLink to={ev.urlPath}>{ev.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 16, fontFamily: "'Nunito Sans', sans-serif" }}>More</h4>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {EVENTS.slice(5).map(ev => (
                  <li key={ev.slug}>
                    <FooterLink to={ev.urlPath}>{ev.label}</FooterLink>
                  </li>
                ))}
                <li>
                  <FooterLink to="/pricing">Pricing</FooterLink>
                </li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 16, fontFamily: "'Nunito Sans', sans-serif" }}>Company</h4>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Contact Us'].map(label => (
                  <li key={label}>
                    <span style={{ fontSize: 14, cursor: 'not-allowed', fontFamily: "'Nunito Sans', sans-serif", color: '#A8A4A0' }}>{label}</span>
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 24, lineHeight: 1.5, fontFamily: "'Nunito Sans', sans-serif" }}>
                INVITATION.AI SOFTWARES<br />
                Kerala, India
              </p>
            </div>
          </div>

          <div className="flex-col sm:flex-row" style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #3D3A36', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <p style={{ fontSize: 14, color: '#8D8A86', fontFamily: "'Nunito Sans', sans-serif", margin: 0 }}>
              &copy; {new Date().getFullYear()} Invitation.AI. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: 24 }}>
              <span style={{ fontSize: 12, color: '#8D8A86', cursor: 'not-allowed', fontFamily: "'Nunito Sans', sans-serif" }}>Privacy</span>
              <span style={{ fontSize: 12, color: '#8D8A86', cursor: 'not-allowed', fontFamily: "'Nunito Sans', sans-serif" }}>Terms</span>
              <span style={{ fontSize: 12, color: '#8D8A86', cursor: 'not-allowed', fontFamily: "'Nunito Sans', sans-serif" }}>Refund</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
