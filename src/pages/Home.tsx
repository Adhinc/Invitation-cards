import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import {
  Star,
  ArrowRight,
  Check,
  Lock,
  Zap,
  MessageCircle,
  Image,
  Share2,
  QrCode,
} from 'lucide-react';
import { EVENTS, PRICING_PLANS } from '../constants/events';
import { fadeUp, stagger } from '../utils/animations';
import { Button, Badge, Card } from '../components/ui';
import { cn } from '../utils/cn';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const CATEGORY_CARDS = [
  { label: 'Wedding', tagline: 'Two hearts, one journey', accent: '#B8405E', bg: '#FFF0F4', slug: 'wedding', thumb: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=80&h=80&fit=crop' },
  { label: 'Birthday', tagline: 'Another year of happy memories', accent: '#9B59B6', bg: '#F5EDFF', slug: 'birthday', thumb: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=80&h=80&fit=crop' },
  { label: 'Baptism', tagline: 'Blessed beginnings', accent: '#5D9BCC', bg: '#F0F7FC', slug: 'baptism', thumb: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=80&h=80&fit=crop' },
  { label: 'Holy Communion', tagline: 'A moment of faith and grace', accent: '#C9A227', bg: '#FFFBF0', slug: 'holy-communion', thumb: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=80&h=80&fit=crop' },
  { label: 'Naming Ceremony', tagline: 'A name given with love', accent: '#E8A87C', bg: '#FFF8F2', slug: 'naming-ceremony', thumb: 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=80&h=80&fit=crop' },
  { label: 'Baby Shower', tagline: 'Awaiting a little miracle', accent: '#E87A90', bg: '#FFF5F8', slug: 'baby-shower', thumb: 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=80&h=80&fit=crop' },
  { label: 'Housewarming', tagline: 'Beginning life in a new home', accent: '#6B8E6B', bg: '#F0F7F0', slug: 'housewarming', thumb: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=80&h=80&fit=crop' },
  { label: 'Other Events', tagline: 'Moments worth sharing', accent: '#0D9488', bg: '#E6F7F6', slug: null, thumb: null },
];

const showcaseCards = [
  { label: 'Wedding', accent: '#E8A5A5', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=200&h=350&fit=crop' },
  { label: 'Wedding', accent: '#E8A5A5', image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=200&h=350&fit=crop' },
  { label: 'Birthday', accent: '#FFB366', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=200&h=350&fit=crop' },
  { label: 'Baptism', accent: '#5D9BCC', image: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=200&h=350&fit=crop' },
  { label: 'Birthday', accent: '#FFB366', image: 'https://images.unsplash.com/photo-1464349153459-f0199f5d0ab1?w=200&h=350&fit=crop' },
  { label: 'Wedding', accent: '#E8A5A5', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=200&h=350&fit=crop' },
  { label: 'Naming Ceremony', accent: '#E8A5C8', image: 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=200&h=350&fit=crop' },
  { label: 'Housewarming', accent: '#C4A574', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&h=350&fit=crop' },
  { label: 'Wedding', accent: '#E8A5A5', image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=200&h=350&fit=crop' },
  { label: 'Birthday', accent: '#FFB366', image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=200&h=350&fit=crop' },
];

const steps = [
  {
    num: '1',
    title: 'Start with a Chat',
    desc: 'Simply tell our AI Chatbot about your celebration',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    num: '2',
    title: 'Choose Your Style',
    desc: 'Pick a design that feels like you.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    num: '3',
    title: 'Share Instantly',
    desc: 'Share your invitation website on social media',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    ),
  },
];

const benefits = [
  { title: 'More Than a Card or PDF', desc: 'A full website that your guests can revisit anytime — not a disposable piece of paper.' },
  { title: 'Everything in One Link', desc: 'Event details, venue map, photos, RSVP — all in one beautiful, shareable link.' },
  { title: 'Easy for Everyone', desc: 'No app downloads needed. Works on any phone. Even grandparents can open it.' },
  { title: 'Feels Personal, Not Generic', desc: 'Beautiful designs crafted for Indian celebrations. Feels like you, not a template.' },
  { title: 'Always With Your Guests', desc: 'Lives on their phone — no more "where was the venue again?" messages.' },
  { title: 'Trusted by Thousands', desc: '10,000+ families across India trust us for their most important moments.' },
];

const testimonials = [
  { initials: 'SM', name: 'Sneha M.', event: 'Family Celebration', quote: 'The website was perfect! All our guests loved the digital invite.' },
  { initials: 'RK', name: 'Rajesh K.', event: 'Special Occasion', quote: 'Created a beautiful theme in just 2 minutes. So easy!' },
  { initials: 'PS', name: 'Priya S.', event: 'Milestone Event', quote: 'Made our event extra special with a gorgeous website.' },
];

const stats = [
  { value: '10,000+', label: 'Happy families' },
  { value: '50,000+', label: 'Websites created' },
  { value: '4.9/5', label: 'User rating' },
];

/** Show only 1M, 3M, 1Y plans */
const visiblePlans = PRICING_PLANS.filter(
  (p) => p.id === '1month' || p.id === '3months' || p.id === '1year',
);

/* ------------------------------------------------------------------ */
/*  SVG Arrow Connector (between steps)                                */
/* ------------------------------------------------------------------ */

function StepConnector() {
  return (
    <div className="hidden md:flex" style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 28, flexShrink: 0 }}>
      <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
        <path d="M0 12h42M36 6l6 6-6 6" stroke="#D9D5D0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Floating Invitation Card (Hero)                                    */
/* ------------------------------------------------------------------ */

function FloatingInvitationCard() {
  return (
    <div className="relative" style={{ maxWidth: 380, width: '100%' }}>
      {/* Main floating card */}
      <div
        className="animate-[float_6s_ease-in-out_infinite]"
        style={{
          background: 'linear-gradient(135deg, #FFFBF8 0%, #FFF0F4 50%, #FFE8F0 100%)',
          borderRadius: 20,
          padding: '36px 32px',
          boxShadow: '0 20px 60px rgba(184,64,94,0.15), 0 8px 24px rgba(0,0,0,0.06)',
          border: '1px solid rgba(184,64,94,0.12)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gold corner ornaments */}
        <div style={{ position: 'absolute', top: 12, left: 12, width: 24, height: 24, borderTop: '2px solid #C9A227', borderLeft: '2px solid #C9A227', borderRadius: '4px 0 0 0', opacity: 0.5 }} />
        <div style={{ position: 'absolute', top: 12, right: 12, width: 24, height: 24, borderTop: '2px solid #C9A227', borderRight: '2px solid #C9A227', borderRadius: '0 4px 0 0', opacity: 0.5 }} />
        <div style={{ position: 'absolute', bottom: 12, left: 12, width: 24, height: 24, borderBottom: '2px solid #C9A227', borderLeft: '2px solid #C9A227', borderRadius: '0 0 0 4px', opacity: 0.5 }} />
        <div style={{ position: 'absolute', bottom: 12, right: 12, width: 24, height: 24, borderBottom: '2px solid #C9A227', borderRight: '2px solid #C9A227', borderRadius: '0 0 4px 0', opacity: 0.5 }} />

        {/* Subtle pattern overlay */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'radial-gradient(circle at 1px 1px, #B8405E 1px, transparent 0)', backgroundSize: '20px 20px' }} />

        <p style={{ fontSize: 10, letterSpacing: 4, color: '#B8405E', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>You're Invited</p>

        {/* Decorative divider */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 40, height: 1, background: 'linear-gradient(to right, transparent, #C9A227)' }} />
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#C9A227"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
          <div style={{ width: 40, height: 1, background: 'linear-gradient(to left, transparent, #C9A227)' }} />
        </div>

        <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 600, color: '#1F1A1B', marginBottom: 4, lineHeight: '34px' }}>
          Priya <span style={{ color: '#B8405E' }}>&</span> Arjun
        </h3>
        <p style={{ fontSize: 12, color: '#8D8A86', marginBottom: 16 }}>are getting married</p>

        {/* Photo */}
        <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=220&fit=crop"
            alt="Wedding"
            style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 12 }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: '#8D8A86', marginBottom: 2 }}>Date</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#1F1A1B' }}>March 15, 2026</p>
          </div>
          <div style={{ width: 1, height: 28, background: '#E8E4E0' }} />
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: '#8D8A86', marginBottom: 2 }}>Venue</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#1F1A1B' }}>Kochi, Kerala</p>
          </div>
        </div>

        <button style={{ marginTop: 8, padding: '10px 32px', background: 'linear-gradient(135deg, #B8405E 0%, #D4548F 100%)', color: '#fff', fontSize: 12, fontWeight: 700, borderRadius: 50, border: 'none', letterSpacing: 1, boxShadow: '0 4px 16px rgba(184,64,94,0.3)' }}>
          RSVP Now
        </button>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute animate-[float_3s_ease-in-out_infinite]" style={{ top: -16, right: -20 }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path d="M12 3C12 3 14 7 18 8C14 9 12 13 12 13C12 13 10 9 6 8C10 7 12 3 12 3Z" fill="#FFD700" opacity="0.7" />
        </svg>
      </div>
      <div className="absolute animate-[float_4s_ease-in-out_infinite_0.5s]" style={{ top: '35%', left: -28 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#E8A5A5" opacity="0.6">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
      <div className="absolute animate-[float_5s_ease-in-out_infinite_1s]" style={{ bottom: -8, right: -12 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 3C12 3 14 7 18 8C14 9 12 13 12 13C12 13 10 9 6 8C10 7 12 3 12 3Z" fill="#C9A227" opacity="0.5" />
        </svg>
      </div>
      <div className="absolute animate-[float_3.5s_ease-in-out_infinite_1.5s]" style={{ bottom: '30%', left: -16 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4" fill="#F5C6D0" opacity="0.6" />
        </svg>
      </div>

      {/* Second card peeking behind — gives depth */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          right: -12,
          bottom: -12,
          background: 'linear-gradient(135deg, #FFF5EE, #FFE8F0)',
          borderRadius: 20,
          border: '1px solid rgba(184,64,94,0.08)',
          boxShadow: '0 12px 40px rgba(184,64,94,0.08)',
          zIndex: -1,
          transform: 'rotate(3deg)',
        }}
      />
      {/* Third card — more depth */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          right: -20,
          bottom: -20,
          background: '#FFF8F5',
          borderRadius: 20,
          border: '1px solid rgba(184,64,94,0.04)',
          boxShadow: '0 8px 32px rgba(184,64,94,0.04)',
          zIndex: -2,
          transform: 'rotate(6deg)',
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  WhatsApp Share Card                                                */
/* ------------------------------------------------------------------ */

function WhatsAppShareCard() {
  return (
    <div className="relative" style={{ maxWidth: 340, width: '100%' }}>
      {/* WhatsApp chat bubble */}
      <div
        className="animate-[float_5s_ease-in-out_infinite]"
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 16px 48px rgba(37,211,102,0.12), 0 4px 16px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          border: '1px solid rgba(37,211,102,0.15)',
        }}
      >
        {/* WhatsApp header bar */}
        <div style={{ background: '#075E54', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageCircle size={16} color="#fff" />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Family Group</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>Mom, Dad, Sneha, +12 others</p>
          </div>
        </div>

        {/* Chat messages */}
        <div style={{ background: '#ECE5DD', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Sent message with link preview */}
          <div style={{ alignSelf: 'flex-end', maxWidth: '85%' }}>
            <div style={{ background: '#DCF8C6', borderRadius: '12px 4px 12px 12px', overflow: 'hidden' }}>
              {/* Link preview card */}
              <div style={{ borderLeft: '3px solid #25D366' }}>
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=140&fit=crop"
                  alt="Wedding invitation preview"
                  style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }}
                />
                <div style={{ padding: '8px 10px' }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: '#1F1A1B', marginBottom: 2 }}>Priya & Arjun's Wedding</p>
                  <p style={{ fontSize: 10, color: '#8D8A86', lineHeight: '14px' }}>You're invited to celebrate our special day — March 15, 2026</p>
                  <p style={{ fontSize: 9, color: '#25D366', marginTop: 4 }}>invitation.ai/priya-arjun</p>
                </div>
              </div>
              <p style={{ padding: '4px 10px 6px', fontSize: 12, color: '#303030' }}>
                We're getting married! 💍✨ Open the invitation link 🥰
              </p>
              <p style={{ textAlign: 'right', padding: '0 8px 4px', fontSize: 9, color: '#8D8A86' }}>10:32 AM ✓✓</p>
            </div>
          </div>

          {/* Reply */}
          <div style={{ alignSelf: 'flex-start', maxWidth: '70%' }}>
            <div style={{ background: '#fff', borderRadius: '4px 12px 12px 12px', padding: '8px 10px' }}>
              <p style={{ fontSize: 12, color: '#303030' }}>Omg this is so beautiful! 😍🎉 We'll be there!</p>
              <p style={{ textAlign: 'right', fontSize: 9, color: '#8D8A86', marginTop: 2 }}>10:33 AM</p>
            </div>
          </div>

          {/* Another reply */}
          <div style={{ alignSelf: 'flex-start', maxWidth: '60%' }}>
            <div style={{ background: '#fff', borderRadius: '4px 12px 12px 12px', padding: '8px 10px' }}>
              <p style={{ fontSize: 12, color: '#303030' }}>Love the invitation! ❤️🙌</p>
              <p style={{ textAlign: 'right', fontSize: 9, color: '#8D8A86', marginTop: 2 }}>10:34 AM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating notification badges */}
      <div className="absolute animate-[float_3s_ease-in-out_infinite]" style={{ top: -12, right: -8 }}>
        <div style={{ background: '#25D366', color: '#fff', fontSize: 11, fontWeight: 700, width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(37,211,102,0.4)' }}>
          3
        </div>
      </div>
      <div className="absolute animate-[float_4s_ease-in-out_infinite_1s]" style={{ bottom: 20, left: -16 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366" opacity="0.4">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  QR Paper Card + Digital Card                                       */
/* ------------------------------------------------------------------ */

function QRSection() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, maxWidth: 900, margin: '0 auto', flexWrap: 'wrap' }}>
      {/* Paper Card with QR */}
      <div className="relative animate-[float_6s_ease-in-out_infinite]">
        <div style={{ width: 240, background: '#fff', borderRadius: 16, boxShadow: '0 16px 48px rgba(0,0,0,0.08)', border: '1px solid #F0E6DC', padding: 24 }}>
          <div style={{ border: '2px solid #F0E6DC', borderRadius: 10, padding: 20, textAlign: 'center', position: 'relative' }}>
            {/* Corner ornaments */}
            <div style={{ position: 'absolute', top: 4, left: 4, width: 16, height: 16, borderTop: '2px solid rgba(184,64,94,0.3)', borderLeft: '2px solid rgba(184,64,94,0.3)', borderRadius: '4px 0 0 0' }} />
            <div style={{ position: 'absolute', top: 4, right: 4, width: 16, height: 16, borderTop: '2px solid rgba(184,64,94,0.3)', borderRight: '2px solid rgba(184,64,94,0.3)', borderRadius: '0 4px 0 0' }} />
            <div style={{ position: 'absolute', bottom: 4, left: 4, width: 16, height: 16, borderBottom: '2px solid rgba(184,64,94,0.3)', borderLeft: '2px solid rgba(184,64,94,0.3)', borderRadius: '0 0 0 4px' }} />
            <div style={{ position: 'absolute', bottom: 4, right: 4, width: 16, height: 16, borderBottom: '2px solid rgba(184,64,94,0.3)', borderRight: '2px solid rgba(184,64,94,0.3)', borderRadius: '0 0 4px 0' }} />

            <p style={{ fontSize: 11, color: '#B8405E', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>You're Invited</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, marginTop: 8, color: '#1F1A1B' }}>
              Priya <span style={{ color: '#B8405E' }}>&</span> Arjun
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10, fontSize: 11, color: '#8D8A86' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>15 Mar 2026</span>
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ width: 80, height: 80, margin: '0 auto', background: '#FFF0F4', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <QrCode size={40} style={{ color: '#B8405E' }} />
              </div>
              <p style={{ fontSize: 9, color: '#8D8A86', textTransform: 'uppercase', letterSpacing: 3, marginTop: 8, fontWeight: 600 }}>Scan for E-Invite</p>
            </div>
          </div>
        </div>
      </div>

      {/* Flow Connector */}
      <div className="hidden md:flex" style={{ alignItems: 'center', flexShrink: 0 }}>
        <svg viewBox="0 0 120 40" fill="none" width="96" height="40">
          <path d="M0 20 Q30 20 40 10 T80 20 T120 20" stroke="url(#wave_grad)" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" fill="none" />
          <circle r="5" fill="#B8405E">
            <animateMotion dur="1.5s" repeatCount="indefinite" path="M0 20 Q30 20 40 10 T80 20 T120 20" />
          </circle>
          <defs>
            <linearGradient id="wave_grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B8405E" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#B8405E" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#B8405E" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
        <svg viewBox="0 0 24 24" fill="none" width="20" height="20" style={{ marginLeft: -8 }}>
          <path d="M4 12h12M12 5l7 7-7 7" stroke="#B8405E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Digital invitation card */}
      <div className="relative animate-[float_6s_ease-in-out_infinite_0.5s]">
        <div style={{
          width: 240,
          background: 'linear-gradient(135deg, #FFFBF8 0%, #FFF0F4 100%)',
          borderRadius: 16,
          boxShadow: '0 16px 48px rgba(184,64,94,0.12), 0 4px 16px rgba(0,0,0,0.04)',
          border: '1px solid rgba(184,64,94,0.1)',
          overflow: 'hidden',
        }}>
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=140&fit=crop"
            alt="Wedding"
            style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }}
          />
          <div style={{ padding: '16px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 9, letterSpacing: 3, color: '#B8405E', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>You're Invited</p>
            <h4 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, fontWeight: 600, color: '#1F1A1B', marginBottom: 4 }}>
              Priya & Arjun
            </h4>
            <p style={{ fontSize: 11, color: '#8D8A86', marginBottom: 4 }}>March 15, 2026</p>
            <p style={{ fontSize: 10, color: '#8D8A86' }}>Kochi, Kerala</p>
            <div style={{ marginTop: 12, padding: '8px 20px', background: 'linear-gradient(135deg, #B8405E, #D4548F)', borderRadius: 50, display: 'inline-block' }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>View Invitation</span>
            </div>
          </div>
        </div>
        {/* Glow effect */}
        <div style={{ position: 'absolute', inset: -4, borderRadius: 20, background: 'radial-gradient(ellipse at center, rgba(184,64,94,0.08) 0%, transparent 70%)', zIndex: -1 }} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function Component() {
  return (
    <div>

      {/* ══════════════════════════════════════════════════════════════
          1. HERO — gradient bg, two-column, star badge
          bg: linear-gradient(#FFFBF8, #FFF5EE)
          padding: 126px 72px 40px
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(rgb(255, 251, 248) 0%, rgb(255, 245, 238) 100%)',
          padding: '126px 20px 40px',
        }}
      >
        <div className="flex flex-col md:flex-row items-center justify-center" style={{ gap: 48, maxWidth: 1100, margin: '0 auto' }}>
          {/* Text — left */}
          <div className="text-center md:text-left flex-1" style={{ maxWidth: 540 }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Hero badge — star icon + text like BigDates */}
              <span className="inline-flex items-center gap-2 bg-white/80 border border-[#F0E6DC] rounded-full text-[#4A4044]" style={{ padding: '6px 12px', fontSize: '12.8px', marginBottom: 16, borderRadius: 50 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                <span>Loved by 10,000+ families</span>
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="tracking-tight text-[#1F1A1B]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 44, lineHeight: '55px', marginBottom: 16 }}
            >
              Create beautiful invitations for your{' '}
              <span className="text-[#B8405E]">special moments</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[#4A4044]"
              style={{ fontFamily: "'Nunito Sans', -apple-system, sans-serif", fontSize: 16, lineHeight: '25.6px', marginBottom: 24 }}
            >
              Weddings, birthdays, and celebrations deserve to be remembered.
              Create your invitation website in minutes — no design skills needed.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* CTA button — gradient like BigDates: linear-gradient(135deg, #B8405E, #D4548F) */}
              <Link to={EVENTS[0].urlPath}>
                <button
                  className="inline-flex items-center gap-2 text-white shadow-[0_6px_28px_rgba(184,64,94,0.4)] transition-all hover:shadow-[0_8px_36px_rgba(184,64,94,0.5)] hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #9A3350, #B8405E)', padding: '14px 28px', borderRadius: 28, fontSize: 15, fontWeight: 700 }}
                >
                  <span>Create Website</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </Link>
              <p className="text-[#8D8A86]" style={{ fontSize: 13.6, marginTop: 12 }}>No credit card required &bull; Ready in minutes</p>
            </motion.div>
          </div>

          {/* Phone Mockup — right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center flex-shrink-0"
          >
            <FloatingInvitationCard />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          2. SHOWCASE (Trusted Worldwide) — scrolling card carousel
          bg: linear-gradient(#FFF5EE, #FFFBF8)
          padding: 60px 0 80px
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(rgb(255, 245, 238) 0%, rgb(255, 251, 248) 100%)',
          padding: '60px 0 80px',
        }}
      >
        {/* Header */}
        <div className="text-center" style={{ maxWidth: 600, margin: '0 auto', marginBottom: 48, padding: '0 20px' }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2"
            style={{ marginBottom: 20, padding: '10px 20px', borderRadius: 50 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8405E" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <span style={{ fontSize: 16, fontWeight: 700 }} className="text-[#B8405E]">49,799</span>
          </motion.div>
          <h2
            className="text-[#1F1A1B]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 40, lineHeight: '44px', marginBottom: 12 }}
          >
            Trusted Worldwide
          </h2>
          <p style={{ color: '#8D8A86', fontSize: 16.8, lineHeight: '25.2px', maxWidth: 480, margin: '0 auto' }}>
            Join thousands who created beautiful digital invitations for their special occasions
          </p>
        </div>

        {/* Carousel — infinite scroll */}
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          spaceBetween={16}
          loop
          breakpoints={{
            0: { slidesPerView: 2, spaceBetween: 10 },
            480: { slidesPerView: 3, spaceBetween: 12 },
            768: { slidesPerView: 4, spaceBetween: 14 },
            1024: { slidesPerView: 5, spaceBetween: 16 },
            1280: { slidesPerView: 6, spaceBetween: 16 },
          }}
          className="px-4"
        >
          {showcaseCards.map((card, i) => (
            <SwiperSlide key={i}>
              <div className="rounded-xl overflow-hidden relative group cursor-pointer">
                <div className="aspect-[9/16] bg-[#f5f5f5]">
                  <img
                    src={card.image}
                    alt={`${card.label} invitation`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div
                  className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-white text-xs font-medium"
                  style={{ background: card.accent }}
                >
                  {card.label}
                </div>
                {/* Card reflection effect */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/10 to-transparent" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          3. CATEGORIES — "What Are You Celebrating?"
          bg: linear-gradient(#FFFBF8, #FFF5EE 50%, #FFFBF8)
          padding: 60px 72px 50px
          4-column grid of compact row cards
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: 'linear-gradient(rgb(255, 251, 248) 0%, rgb(255, 245, 238) 50%, rgb(255, 251, 248) 100%)',
          padding: '60px 20px 50px',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Section header */}
        <div className="text-center" style={{ maxWidth: 600, margin: '0 auto', marginBottom: 24 }}>
          <h2
            className="text-[#1F1A1B]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 32, lineHeight: '38.4px', marginBottom: 8 }}
          >
            What Are You <span className="text-[#B8405E]">Celebrating?</span>
          </h2>
          <p style={{ color: '#4A4044', fontSize: 14.4, lineHeight: '20.16px' }}>
            Every moment deserves its own beautiful invitation website.
          </p>
        </div>

        {/* Compact grid — 4 columns on desktop like BigDates */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 16 }}
        >
          {CATEGORY_CARDS.map((cat, i) => {
            const isComingSoon = cat.slug === null;
            const eventConfig = !isComingSoon ? EVENTS.find(e => e.slug === cat.slug) : null;
            const Wrapper = isComingSoon ? 'div' : Link;
            const wrapperProps = isComingSoon
              ? {}
              : { to: eventConfig?.urlPath || '/' };

            return (
              <motion.div key={cat.label} variants={fadeUp}>
                <Wrapper
                  {...(wrapperProps as any)}
                  className={cn(
                    'flex items-center gap-3 border transition-all duration-200',
                    !isComingSoon && 'hover:shadow-md hover:-translate-y-px cursor-pointer',
                    isComingSoon && 'opacity-80',
                  )}
                  style={{
                    background: cat.bg,
                    borderColor: `${cat.accent}40`,
                    animationDelay: `${i * 0.05}s`,
                    padding: '14px 16px',
                    borderRadius: 12,
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    className="w-12 h-12 rounded-lg bg-cover bg-center flex-shrink-0"
                    style={{
                      backgroundColor: `${cat.accent}20`,
                      backgroundImage: cat.thumb ? `url(${cat.thumb})` : undefined,
                    }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#1F1A1B]" style={{ fontWeight: 600, fontSize: 14 }}>{cat.label}</h3>
                    <p className="truncate" style={{ fontSize: 12, color: '#6B6863', lineHeight: '15px' }}>{cat.tagline}</p>
                  </div>

                  {/* Arrow or Coming Soon badge */}
                  {isComingSoon ? (
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-[#0D9488] bg-[#0D9488]/10 px-2 py-1 rounded-full whitespace-nowrap">
                      Coming Soon
                    </span>
                  ) : (
                    <span className="flex-shrink-0" style={{ color: cat.accent }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  )}
                </Wrapper>
              </motion.div>
            );
          })}
        </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          4. HOW IT WORKS — step number + icon + h3 + p, SVG connectors
          bg: #FFFBF8
          padding: 50px 72px
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: 'rgb(255, 251, 248)',
          padding: '50px 20px',
        }}
      >
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Section header */}
        <div className="text-center" style={{ maxWidth: 600, margin: '0 auto', marginBottom: 24 }}>
          <h2
            className="text-[#1F1A1B]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 32, lineHeight: '38.4px', marginBottom: 8 }}
          >
            From Idea to Invitation in Minutes
          </h2>
          <p style={{ color: '#8D8A86', fontSize: 14.4, lineHeight: '20.16px' }}>
            No stress. No learning. Just simple steps.
          </p>
        </div>

        {/* Steps row with connectors */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 0 }}
          className="flex-col md:flex-row"
        >
          {steps.map((s, i) => (
            <div key={s.num} className="contents">
              <motion.div variants={fadeUp} style={{ textAlign: 'center', flex: 1, maxWidth: 280, padding: '0 16px' }}>
                {/* Step number + icon combined */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#B8405E', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
                    {s.num}
                  </div>
                  <div style={{ color: '#B8405E' }}>
                    {s.icon}
                  </div>
                </div>
                <h3 style={{ fontWeight: 600, fontSize: 16, color: '#1F1A1B', marginBottom: 6 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#8D8A86', lineHeight: '21px' }}>{s.desc}</p>
              </motion.div>
              {i < steps.length - 1 && <StepConnector />}
            </div>
          ))}
        </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          5. WHATSAPP — GREEN gradient background, two-column
          bg: linear-gradient(#F0FFF4, #E8F5E9 50%, #F1F8E9)
          padding: 80px 40px
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="overflow-hidden"
        style={{
          background: 'linear-gradient(rgb(240, 255, 244) 0%, rgb(232, 245, 233) 50%, rgb(241, 248, 233) 100%)',
          padding: '80px 20px',
        }}
      >
        <div className="flex flex-col md:flex-row items-center justify-center" style={{ gap: 100, maxWidth: 1100, margin: '0 auto' }}>
          {/* Content — left */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center md:text-left flex-1" style={{ maxWidth: 480 }}
          >
            {/* WhatsApp badge */}
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 bg-[#25D366]/10 text-[#128C7E] rounded-full px-4 py-1.5 text-sm font-medium mb-4"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Share via WhatsApp
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="text-[#1F1A1B]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: 44, lineHeight: '55px', marginBottom: 14 }}
            >
              Invite Guests <span className="text-[#25D366]">Instantly</span>
            </motion.h2>

            <motion.p variants={fadeUp} style={{ color: '#4A4044', fontSize: 16, lineHeight: '25.6px', marginBottom: 24 }}>
              Just send a link. Guests open your invitation website instantly.
            </motion.p>

            {/* Benefits */}
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center md:justify-start gap-4">
              {['One-Tap Access', 'Share to Groups', 'No App Needed'].map((benefit) => (
                <div key={benefit} className="flex items-center gap-2">
                  <Check size={18} className="text-[#25D366] flex-shrink-0" />
                  <span className="text-sm text-[#1F1A1B] font-medium">{benefit}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Phone Mockup — right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-shrink-0"
          >
            <WhatsAppShareCard />
          </motion.div>
        </div>

        {/* Mobile benefits row */}
        <div className="flex md:hidden justify-center mt-8" style={{ gap: 16, maxWidth: 1100, margin: '32px auto 0' }}>
          {['One-Tap Access', 'Share to Groups', 'No App Needed'].map((b) => (
            <div key={b} className="flex items-center" style={{ gap: 6 }}>
              <Check size={14} className="text-[#25D366]" />
              <span style={{ fontSize: 12, color: '#1F1A1B' }}>{b}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          6. QR BRIDGE — "Tradition on Paper. Magic on Phone."
          bg: linear-gradient(#FFFCF9, #FFF8F5 50%, #FFF4F0)
          padding: 70px 20px
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="overflow-hidden"
        style={{
          background: 'linear-gradient(rgb(255, 252, 249) 0%, rgb(255, 248, 245) 50%, rgb(255, 244, 240) 100%)',
          padding: '70px 20px',
        }}
      >
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {/* Section header */}
          <div className="text-center" style={{ marginBottom: 48 }}>
            <span className="inline-flex items-center gap-2 bg-[#B8405E]/10 text-[#B8405E] rounded-full font-medium" style={{ padding: '10px 20px', fontSize: 14, marginBottom: 20, borderRadius: 50 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Paper + Digital
            </span>
            <h2
              className="text-[#1F1A1B]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: 40, lineHeight: '50px', marginBottom: 14 }}
            >
              Tradition on Paper. <span className="text-[#B8405E]">Magic on Phone.</span>
            </h2>
            <p style={{ color: '#8D8A86', fontSize: 16, lineHeight: '25.6px', maxWidth: 520, margin: '0 auto' }}>
              Print a QR code on your card. Guests scan to see your beautiful digital e-invite instantly!
            </p>
          </div>

          <QRSection />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          7. WHY CHOOSE — warm brown/mauve gradient with glass cards
          bg: linear-gradient(145deg, #D4B8B8, #C9A8A8 20%, #BFA0A0 40%, #B89898 60%, #C4A8A8 80%, #D0B8B8)
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: 'linear-gradient(145deg, rgb(212, 184, 184) 0%, rgb(201, 168, 168) 20%, rgb(191, 160, 160) 40%, rgb(184, 152, 152) 60%, rgb(196, 168, 168) 80%, rgb(208, 184, 184) 100%)',
          padding: '80px 20px',
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          style={{ maxWidth: 1100, margin: '0 auto' }}
        >
          <div className="text-center" style={{ marginBottom: 40 }}>
            <h2
              className="text-white"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: 44, lineHeight: '52.8px', marginBottom: 16 }}
            >
              Why Choose Invitation.AI?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: '25.6px', maxWidth: 480, margin: '0 auto' }}>
              Everything a paper invitation does, but better.
            </p>
          </div>

          <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 16 }}>
            {benefits.map((b) => (
              <motion.div key={b.title} variants={fadeUp}>
                <div className="h-full transition-all hover:bg-white/20"
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 12,
                    padding: 24,
                  }}
                >
                  <h3 style={{ fontWeight: 600, fontSize: 14, color: '#fff', marginBottom: 6 }}>{b.title}</h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: '21px' }}>{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>


      {/* ══════════════════════════════════════════════════════════════
          9. FINAL CTA — "Your celebration deserves to be special"
          bg: #FFFBF8
          padding: 60px 72px
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="text-center"
        style={{
          background: 'rgb(255, 251, 248)',
          padding: '60px 20px',
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          style={{ maxWidth: 600, margin: '0 auto' }}
        >
          <motion.h2
            variants={fadeUp}
            className="text-[#1F1A1B]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 35.2, lineHeight: '45.76px', marginBottom: 12 }}
          >
            Your celebration deserves to be special
          </motion.h2>

          <motion.p variants={fadeUp} style={{ color: '#4A4044', fontSize: 16, lineHeight: '25.6px', marginBottom: 32 }}>
            Start creating your beautiful invitation website right now.
          </motion.p>

          <motion.div variants={fadeUp}>
            <Link to={EVENTS[0].urlPath}>
              <button
                className="inline-flex items-center gap-2 text-white shadow-[0_6px_28px_rgba(184,64,94,0.4)] transition-all hover:shadow-[0_8px_36px_rgba(184,64,94,0.5)] hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #9A3350, #B8405E)', padding: '14px 32px', borderRadius: 8, fontSize: 15, fontWeight: 600 }}
              >
                Create Your Invitation
              </button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={fadeUp} className="flex items-center justify-center" style={{ gap: 24, marginTop: 24 }}>
            <div className="flex items-center" style={{ gap: 6, fontSize: 14, color: '#8D8A86' }}>
              <Lock size={14} />
              <span>Safe & secure</span>
            </div>
            <div className="flex items-center" style={{ gap: 6, fontSize: 14, color: '#8D8A86' }}>
              <Zap size={14} />
              <span>Fast & easy</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          10. PRICING — kept from original, styled to match
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: 'linear-gradient(rgb(255, 251, 248) 0%, rgb(255, 245, 238) 100%)',
          padding: '60px 20px',
        }}
      >
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="text-center" style={{ marginBottom: 32 }}>
            <h2
              className="text-[#1F1A1B]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 32, lineHeight: '38.4px', marginBottom: 8 }}
            >
              Simple Pricing
            </h2>
            <p style={{ color: '#8D8A86', fontSize: 14.4, lineHeight: '20.16px' }}>
              Preview free. Pay only to activate your shareable link.
            </p>
            <p style={{ color: '#8D8A86', fontSize: 12, marginTop: 8 }}>
              Secure payment &middot; Instant activation &middot; No hidden fees
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {visiblePlans.map((plan) => (
              <motion.div key={plan.id} variants={fadeUp}>
                <div
                  className="text-center relative transition-shadow hover:shadow-md"
                  style={{
                    background: '#fff',
                    borderRadius: 16,
                    padding: '32px 28px',
                    border: plan.preferred ? '2px solid #B8405E' : '1px solid #F0E6DC',
                    boxShadow: plan.preferred ? '0 8px 24px rgba(184,64,94,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
                    transform: plan.preferred ? 'scale(1.03)' : undefined,
                  }}
                >
                  {plan.preferred && (
                    <span style={{
                      position: 'absolute',
                      top: -10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#B8405E',
                      color: '#fff',
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      padding: '4px 12px',
                      borderRadius: 50,
                      whiteSpace: 'nowrap',
                    }}>
                      Most Popular
                    </span>
                  )}
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#8D8A86', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{plan.label}</p>
                  <p style={{ fontSize: 40, fontWeight: 700, color: '#1F1A1B', lineHeight: '48px', marginBottom: 4 }}>
                    <span style={{ fontSize: 16, verticalAlign: 'top', marginRight: 2 }}>&#8377;</span>{plan.price}
                  </p>
                  <p style={{ fontSize: 13, color: '#8D8A86', marginBottom: 24 }}>{plan.duration} days</p>
                  <Link to={EVENTS[0].urlPath}>
                    <button
                      className="transition-all"
                      style={{
                        width: '100%',
                        padding: '12px 0',
                        borderRadius: 50,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: plan.preferred ? 'none' : '1.5px solid #B8405E',
                        background: plan.preferred ? 'linear-gradient(135deg, #9A3350, #B8405E)' : 'transparent',
                        color: plan.preferred ? '#fff' : '#B8405E',
                        boxShadow: plan.preferred ? '0 4px 16px rgba(184,64,94,0.3)' : 'none',
                      }}
                    >
                      Get Started
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}
