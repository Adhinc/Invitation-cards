import { useState, useRef } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, MessageCircle, MapPin, Camera, ClipboardList, Music,
  Clock, Smartphone, ArrowRight, Check, X,
  QrCode, Send, Sparkles, Star, Heart, Leaf, Zap,
} from 'lucide-react';
import { getEventBySlug, type EventConfig } from '../constants/events';
import { fadeUp, stagger } from '../utils/animations';


/* ------------------------------------------------------------------ */
/*  Shared constants                                                   */
/* ------------------------------------------------------------------ */

const HEADING_FONT: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const CTA_GRADIENT = 'linear-gradient(135deg, #9A3350, #B8405E)';
const CTA_SHADOW = '0 6px 28px rgba(184,64,94,0.35)';

/* ------------------------------------------------------------------ */
/*  Templates constant                                                 */
/* ------------------------------------------------------------------ */

const TEMPLATES = [
  { id: 'midnight', name: 'Midnight Constellation', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400', tier: 'Basic' },
  { id: 'lavender', name: 'Lavender Fields', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400', tier: 'Standard' },
  { id: 'blossom', name: 'Simple Blossom', image: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=400', tier: 'Basic' },
  { id: 'golden', name: 'Golden Hour', image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400', tier: 'Premium' },
  { id: 'royal', name: 'Royal Elegance', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', tier: 'Premium' },
  { id: 'minimal', name: 'Modern Minimal', image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400', tier: 'Standard' },
];

type Template = typeof TEMPLATES[number];

/* ------------------------------------------------------------------ */
/*  Dynamic text helpers                                               */
/* ------------------------------------------------------------------ */

function seasonBadge(event: EventConfig) {
  const map: Record<string, string> = {
    wedding: 'Wedding Season 2026',
    betrothal: 'Engagement Season 2026',
    birthday: 'Birthday Season 2026',
    baptism: 'Baptism Season 2026',
    holy_communion: 'Communion Season 2026',
    naming_ceremony: 'Naming Ceremony Season 2026',
    baby_shower: 'Baby Shower Season 2026',
    housewarming: 'Housewarming Season 2026',
  };
  return map[event.type] || `${event.label} Season 2026`;
}

function dynamicNoun(event: EventConfig) {
  if (event.isCoupleEvent) return 'Couples';
  if (event.type === 'birthday') return 'Families';
  if (event.type === 'housewarming') return 'Homeowners';
  return 'Families';
}

/* ------------------------------------------------------------------ */
/*  1. Hero Section                                                    */
/* ------------------------------------------------------------------ */

function HeroSection({ event, onCreateClick }: { event: EventConfig; onCreateClick: () => void }) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(#FEF6F7, #FFFAF8)', padding: '128px 24px 80px' }}
    >
      <div className="flex flex-col md:flex-row" style={{ alignItems: 'center', justifyContent: 'center', gap: 48, maxWidth: 1100, margin: '0 auto' }}>
        {/* Hero content — left side */}
        <div className="text-center md:text-left" style={{ flex: 1, maxWidth: 540 }}>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-[#F0E6DC] rounded-full"
            style={{ fontSize: 13, fontWeight: 500, padding: '6px 16px', marginBottom: 16, color: '#8D8A86' }}
          >
            <Sparkles className="w-4 h-4 text-[#B8405E]" />
            {seasonBadge(event)}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ ...HEADING_FONT, fontSize: 48, fontWeight: 600, lineHeight: 1.2 }}
          >
            Create Your Dream{' '}
            <span style={{ color: '#B8405E' }}>{event.label}</span>{' '}
            Website
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ fontSize: 16, lineHeight: 1.6, color: '#4A4044', marginTop: 20, maxWidth: 576 }}
          >
            {event.heroSubtitle}
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-6 flex flex-wrap justify-center md:justify-start gap-3"
          >
            {[
              { text: 'Start Now', icon: <Zap className="w-3.5 h-3.5" /> },
              { text: '5 Min Setup', icon: <Clock className="w-3.5 h-3.5" /> },
              { text: 'Mobile Ready', icon: <Smartphone className="w-3.5 h-3.5" /> },
            ].map((pill) => (
              <span
                key={pill.text}
                className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur rounded-full border border-[#F0E6DC]"
                style={{ fontSize: 14, lineHeight: 1.5, color: '#4A4044', padding: '6px 16px' }}
              >
                {pill.icon} {pill.text}
              </span>
            ))}
          </motion.div>

          {/* CTA button */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
            <button
              onClick={onCreateClick}
              className="inline-flex items-center gap-2 text-white cursor-pointer transition-transform hover:scale-[1.03]"
              style={{
                marginTop: 32,
                padding: '14px 32px',
                fontSize: 15,
                fontWeight: 600,
                background: CTA_GRADIENT,
                borderRadius: 28,
                boxShadow: CTA_SHADOW,
                border: 'none',
              }}
            >
              Create Your {event.label} Website <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ marginTop: 16, fontSize: 14, lineHeight: 1.5, color: '#8D8A86' }}
          >
            Free to try. No credit card needed.
          </motion.p>
        </div>

        {/* Invitation card — right side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ display: 'flex', justifyContent: 'center', flexShrink: 0 }}
        >
          {/* Floating invitation card */}
          <div className="relative animate-[float_6s_ease-in-out_infinite]" style={{ maxWidth: 320 }}>
            <div style={{
              background: 'linear-gradient(135deg, #FFFBF8 0%, #FFF0F4 50%, #FFE8F0 100%)',
              borderRadius: 20, padding: '32px 28px', textAlign: 'center', position: 'relative', overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(184,64,94,0.15), 0 8px 24px rgba(0,0,0,0.06)',
              border: '1px solid rgba(184,64,94,0.12)',
            }}>
              {/* Gold corners */}
              <div style={{ position: 'absolute', top: 10, left: 10, width: 20, height: 20, borderTop: '2px solid #C9A227', borderLeft: '2px solid #C9A227', opacity: 0.5 }} />
              <div style={{ position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderTop: '2px solid #C9A227', borderRight: '2px solid #C9A227', opacity: 0.5 }} />
              <div style={{ position: 'absolute', bottom: 10, left: 10, width: 20, height: 20, borderBottom: '2px solid #C9A227', borderLeft: '2px solid #C9A227', opacity: 0.5 }} />
              <div style={{ position: 'absolute', bottom: 10, right: 10, width: 20, height: 20, borderBottom: '2px solid #C9A227', borderRight: '2px solid #C9A227', opacity: 0.5 }} />

              <p style={{ fontSize: 10, letterSpacing: 4, color: '#B8405E', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>{event.tagline}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 36, height: 1, background: 'linear-gradient(to right, transparent, #C9A227)' }} />
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#C9A227"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                <div style={{ width: 36, height: 1, background: 'linear-gradient(to left, transparent, #C9A227)' }} />
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, fontWeight: 600, color: '#1F1A1B', marginBottom: 4 }}>
                Your <span style={{ color: '#B8405E' }}>{event.label}</span>
              </h3>
              <p style={{ fontSize: 12, color: '#8D8A86', marginBottom: 14 }}>{event.subtitle}</p>
              <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 14, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
                <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=180&fit=crop" alt={event.label} style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 10 }}>
                <div><p style={{ fontSize: 10, color: '#8D8A86' }}>Date</p><p style={{ fontSize: 13, fontWeight: 600, color: '#1F1A1B' }}>March 15, 2026</p></div>
                <div style={{ width: 1, height: 24, background: '#E8E4E0' }} />
                <div><p style={{ fontSize: 10, color: '#8D8A86' }}>Venue</p><p style={{ fontSize: 13, fontWeight: 600, color: '#1F1A1B' }}>Kochi, Kerala</p></div>
              </div>
              <button style={{ padding: '8px 28px', background: 'linear-gradient(135deg, #B8405E, #D4548F)', color: '#fff', fontSize: 12, fontWeight: 700, borderRadius: 50, border: 'none', letterSpacing: 0.5 }}>RSVP Now</button>
            </div>
            {/* Stacked cards behind */}
            <div style={{ position: 'absolute', top: 10, left: 10, right: -10, bottom: -10, background: 'linear-gradient(135deg, #FFF5EE, #FFE8F0)', borderRadius: 20, border: '1px solid rgba(184,64,94,0.08)', zIndex: -1, transform: 'rotate(3deg)' }} />
            <div style={{ position: 'absolute', top: 18, left: 18, right: -18, bottom: -18, background: '#FFF8F5', borderRadius: 20, border: '1px solid rgba(184,64,94,0.04)', zIndex: -2, transform: 'rotate(6deg)' }} />
          </div>
          {/* Floating decorations */}
          <div className="absolute animate-[float_3s_ease-in-out_infinite]" style={{ top: -12, right: -16 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 3C12 3 14 7 18 8C14 9 12 13 12 13C12 13 10 9 6 8C10 7 12 3 12 3Z" fill="#FFD700" opacity="0.7" /></svg>
          </div>
          <div className="absolute animate-[float_4s_ease-in-out_infinite_0.5s]" style={{ top: '35%', left: -24 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#E8A5A5" opacity="0.6"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  2. QR Paper + Digital Section                                      */
/* ------------------------------------------------------------------ */

function QRPaperDigitalSection({ event }: { event: EventConfig }) {
  return (
    <section style={{ background: 'linear-gradient(#FFFCF9, #FFF8F5 50%, #FFF4F0)', padding: '80px 24px' }}>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center" style={{ maxWidth: 1000, margin: "0 auto" }}
      >
        {/* Badge */}
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-2 bg-white/80 border border-[#F0E6DC] rounded-full"
          style={{ fontSize: 13, fontWeight: 500, padding: '6px 16px', marginBottom: 16, color: '#8D8A86' }}
        >
          <QrCode className="w-4 h-4 text-[#B8405E]" /> Paper + Digital
        </motion.span>

        <motion.h2 variants={fadeUp} style={{ ...HEADING_FONT, fontSize: 36, fontWeight: 600, lineHeight: 1.2, marginBottom: 16 }}>
          Tradition on Paper. <span style={{ color: '#B8405E' }}>Magic on Phone.</span>
        </motion.h2>

        <motion.p variants={fadeUp} style={{ fontSize: 16, lineHeight: 1.6, color: '#4A4044', maxWidth: 560, margin: '0 auto', marginBottom: 32 }}>
          Print a QR code on your traditional paper card. When guests scan it, they see your beautiful digital invitation with music, photos, maps, and RSVP.
        </motion.p>

        {/* Mockup row: Paper card → wave connector → Phone */}
        <motion.div variants={fadeUp} className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Paper card mockup */}
          <div className="w-56 bg-white rounded-2xl shadow-xl border border-[#F0E6DC] text-center" style={{ padding: 24 }}>
            <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#8D8A86', marginBottom: 8 }}>{event.tagline}</p>
            <h3 style={{ ...HEADING_FONT, fontSize: 20, fontWeight: 600, lineHeight: 1.3 }}>Your {event.label}</h3>
            <div className="my-4 mx-auto w-20 h-20 rounded-xl flex items-center justify-center bg-[#FEF6F7]">
              <QrCode className="w-12 h-12 text-[#B8405E]" />
            </div>
            <p style={{ fontSize: 12, color: '#8D8A86' }}>Scan to view invitation</p>
          </div>

          {/* Animated wave connector */}
          <div className="hidden md:block relative w-32 h-8">
            <svg width="128" height="32" viewBox="0 0 128 32" fill="none" className="w-full h-full">
              <path
                d="M0 16 C32 0, 64 32, 96 16 S128 16, 128 16"
                stroke="#B8405E"
                strokeWidth="2"
                strokeDasharray="6 4"
                fill="none"
              />
              <motion.circle
                r="4"
                fill="#B8405E"
                animate={{ cx: [0, 128], cy: [16, 16] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              >
                <animateMotion
                  dur="2s"
                  repeatCount="indefinite"
                  path="M0 16 C32 0, 64 32, 96 16 S128 16, 128 16"
                />
              </motion.circle>
            </svg>
          </div>
          <div className="block md:hidden">
            <ArrowRight className="w-6 h-6 text-[#B8405E]" />
          </div>

          {/* Digital invitation card */}
          <div className="animate-[float_6s_ease-in-out_infinite_0.5s]" style={{
            width: 200, background: 'linear-gradient(135deg, #FFFBF8, #FFF0F4)', borderRadius: 16,
            boxShadow: '0 16px 48px rgba(184,64,94,0.12)', border: '1px solid rgba(184,64,94,0.1)',
            overflow: 'hidden',
          }}>
            <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=120&fit=crop" alt={event.label} style={{ width: '100%', height: 90, objectFit: 'cover', display: 'block' }} />
            <div style={{ padding: '12px 16px', textAlign: 'center' }}>
              <p style={{ fontSize: 9, letterSpacing: 2, color: '#B8405E', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>You're Invited</p>
              <h4 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontWeight: 600, color: '#1F1A1B', marginBottom: 2 }}>Your {event.label}</h4>
              <p style={{ fontSize: 10, color: '#8D8A86' }}>Music, Photos, Maps, RSVP</p>
              <div style={{ marginTop: 8, padding: '6px 16px', background: 'linear-gradient(135deg, #B8405E, #D4548F)', borderRadius: 50, display: 'inline-block' }}>
                <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>View Invitation</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  3. WhatsApp Section                                                */
/* ------------------------------------------------------------------ */

function WhatsAppSection({ event }: { event: EventConfig }) {
  const benefits = [
    { icon: <Zap className="w-5 h-5" />, title: 'One-Tap Access', desc: 'Guests open your invitation instantly from WhatsApp.' },
    { icon: <MessageCircle className="w-5 h-5" />, title: 'Share to Groups', desc: 'Send to family groups and reach everyone at once.' },
    { icon: <Smartphone className="w-5 h-5" />, title: 'No App Needed', desc: 'Works in any browser. No downloads required.' },
  ];

  return (
    <section style={{ background: 'linear-gradient(#F0FFF4, #E8F5E9 50%, #F1F8E9)', padding: '80px 24px' }}>
      <div className="flex flex-col items-center gap-12 text-center" style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Content — centered */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ maxWidth: 580 }}
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 bg-white/80 border border-green-200 rounded-full"
            style={{ fontSize: 13, fontWeight: 500, padding: '6px 16px', marginBottom: 16, color: '#15803d' }}
          >
            <MessageCircle className="w-4 h-4 text-green-600" /> WhatsApp
          </motion.span>

          <motion.h2 variants={fadeUp} style={{ ...HEADING_FONT, fontSize: 36, fontWeight: 600, lineHeight: 1.2, marginBottom: 16 }}>
            Invite Guests <span style={{ color: '#16a34a' }}>Instantly</span>
          </motion.h2>

          <motion.div variants={stagger} className="flex flex-wrap justify-center gap-6">
            {benefits.map((b) => (
              <motion.div key={b.title} variants={fadeUp} className="flex flex-col items-center gap-2 max-w-[160px]">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0 text-green-600">
                  {b.icon}
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{b.title}</h3>
                <p style={{ fontSize: 12, lineHeight: 1.5, color: '#4A4044' }}>{b.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Phone mockup — centered below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex justify-center"
        >
          {/* WhatsApp chat card */}
          <div className="animate-[float_5s_ease-in-out_infinite]" style={{
            maxWidth: 280, background: '#fff', borderRadius: 16, overflow: 'hidden',
            boxShadow: '0 16px 48px rgba(37,211,102,0.12), 0 4px 16px rgba(0,0,0,0.06)',
            border: '1px solid rgba(37,211,102,0.15)',
          }}>
            <div style={{ background: '#075E54', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageCircle size={14} color="#fff" />
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>Family Group</p>
                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)' }}>Mom, Dad, +8 others</p>
              </div>
            </div>
            <div style={{ background: '#ECE5DD', padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ alignSelf: 'flex-end', maxWidth: '85%' }}>
                <div style={{ background: '#DCF8C6', borderRadius: '10px 4px 10px 10px', padding: '6px 8px' }}>
                  <p style={{ fontSize: 11, color: '#303030' }}>Check out our {event.label.toLowerCase()} invitation! ✨</p>
                  <p style={{ textAlign: 'right', fontSize: 8, color: '#8D8A86', marginTop: 2 }}>10:32 AM ✓✓</p>
                </div>
              </div>
              <div style={{ alignSelf: 'flex-start', maxWidth: '70%' }}>
                <div style={{ background: '#fff', borderRadius: '4px 10px 10px 10px', padding: '6px 8px' }}>
                  <p style={{ fontSize: 11, color: '#303030' }}>So beautiful! We'll be there! 😍</p>
                  <p style={{ textAlign: 'right', fontSize: 8, color: '#8D8A86', marginTop: 2 }}>10:33 AM</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  4. Stats Section                                                   */
/* ------------------------------------------------------------------ */

function StatsSection() {
  const stats = [
    { value: '5 Minutes', label: 'Average creation time' },
    { value: '₹49', label: 'Starting price' },
    { value: '15+', label: 'Templates available' },
  ];

  return (
    <section style={{ background: 'white', padding: '80px 24px' }}>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{ maxWidth: 700, margin: '0 auto', display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeUp} className="text-center">
            <p style={{ ...HEADING_FONT, fontSize: 30, fontWeight: 600, color: '#1F1A1B' }}>{s.value}</p>
            <p style={{ fontSize: 14, lineHeight: 1.5, color: '#8D8A86', marginTop: 4 }}>{s.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  5. Why Choose (Paper vs Digital comparison cards)                   */
/* ------------------------------------------------------------------ */

function WhyChooseSection({ event }: { event: EventConfig }) {
  const paperCons = [
    'Expensive printing and postage costs',
    'Takes days or weeks to deliver',
    'Cannot update details after printing',
    'No RSVP tracking capability',
    'Harmful to the environment',
  ];
  const digitalPros = [
    'Starting at just ₹49',
    'Instant delivery via WhatsApp',
    'Update details anytime, anywhere',
    'Real-time RSVP tracking',
    'Eco-friendly and paperless',
    'Beautiful music, photos & maps included',
  ];

  return (
    <section style={{ background: 'linear-gradient(#FFFBF8, #FFF9F5 50%, #FFFDFB)', padding: '80px 24px' }}>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center" style={{ maxWidth: 1000, margin: "0 auto" }}
      >
        {/* Eyebrow */}
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-2 bg-green-50 rounded-full"
          style={{ fontSize: 13, fontWeight: 500, padding: '6px 16px', marginBottom: 16, color: '#16a34a' }}
        >
          <Leaf className="w-4 h-4" /> Go Paperless &middot; Save Trees &middot; Protect Nature
        </motion.span>

        <motion.h2 variants={fadeUp} style={{ ...HEADING_FONT, fontSize: 36, fontWeight: 600, lineHeight: 1.2, marginBottom: 16 }}>
          Why Modern {dynamicNoun(event)} Choose{' '}
          <span style={{ color: '#B8405E' }}>{event.label} Websites</span>
        </motion.h2>

        {/* Two comparison cards */}
        <div className="grid md:grid-cols-2" style={{ gap: 32, alignItems: 'stretch' }}>
          {/* Old way */}
          <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-[#F0E6DC] shadow-sm" style={{ padding: 32, display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
            <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#8D8A86', marginBottom: 8 }}>The traditional way</p>
            <h3 style={{ ...HEADING_FONT, fontSize: 20, fontWeight: 600, lineHeight: 1.3, marginBottom: 20 }}>Paper Invitations</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
              {paperCons.map((item) => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14, lineHeight: 1.5, color: '#4A4044' }}>
                  <X className="w-4 h-4 text-red-400 shrink-0" style={{ marginTop: 2 }} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* New way */}
          <motion.div
            variants={fadeUp}
            className="relative bg-white rounded-2xl border-2 border-[#B8405E] shadow-lg" style={{ padding: 32, display: 'flex', flexDirection: 'column', textAlign: 'center' }}
          >
            <span style={{ position: 'absolute', top: -12, right: 24, background: '#B8405E', color: '#fff', borderRadius: 50, fontSize: 12, fontWeight: 600, padding: '4px 12px' }}>
              Recommended
            </span>
            <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#8D8A86', marginBottom: 8 }}>The modern, eco-friendly choice</p>
            <h3 style={{ ...HEADING_FONT, fontSize: 20, fontWeight: 600, lineHeight: 1.3, marginBottom: 20 }}>
              Invitation.AI <span style={{ color: '#B8405E' }}>{event.label}</span> Website
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
              {digitalPros.map((item) => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14, lineHeight: 1.5, color: '#4A4044' }}>
                  <Check className="w-4 h-4 text-green-500 shrink-0" style={{ marginTop: 2 }} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Closing text */}
        <motion.p variants={fadeUp} style={{ fontSize: 16, lineHeight: 1.6, color: '#4A4044', fontStyle: 'italic', maxWidth: 480, margin: '0 auto', marginTop: 40 }}>
          Your love marks a new beginning. Let your invitation reflect the same — modern, beautiful, and unforgettable.
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  6. Benefits / Features Section                                     */
/* ------------------------------------------------------------------ */

const BENEFIT_CARDS = [
  { icon: Mail, title: 'Digital Invitations', desc: 'Beautifully designed templates you can personalize in minutes.' },
  { icon: MessageCircle, title: 'WhatsApp Sharing', desc: 'Share your invitation via WhatsApp with a single tap.' },
  { icon: MapPin, title: 'Google Maps', desc: 'Help your guests find the venue effortlessly with embedded maps.' },
  { icon: Camera, title: 'Photo Gallery', desc: 'Let guests upload and view event photos in one beautiful place.' },
  { icon: ClipboardList, title: 'RSVP Tracking', desc: 'Track guest responses and meal preferences in real-time.' },
  { icon: Music, title: 'Background Music', desc: 'Set the mood with your favourite song playing on the invite.' },
];

function BenefitsSection({ event }: { event: EventConfig }) {
  return (
    <section style={{ background: 'linear-gradient(#FFF, #FEF6F7)', padding: '80px 24px' }}>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center" style={{ maxWidth: 1000, margin: "0 auto" }}
      >
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-2 bg-white/80 border border-[#F0E6DC] rounded-full"
          style={{ fontSize: 13, fontWeight: 500, padding: '6px 16px', marginBottom: 16, color: '#8D8A86' }}
        >
          <Sparkles className="w-4 h-4 text-[#B8405E]" /> Features
        </motion.span>

        <motion.h2 variants={fadeUp} style={{ ...HEADING_FONT, fontSize: 36, fontWeight: 600, lineHeight: 1.2, marginBottom: 16 }}>
          Everything You Need for a Perfect{' '}
          <span style={{ color: '#B8405E' }}>{event.label} Invitation</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
          {BENEFIT_CARDS.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              className="bg-white rounded-2xl border border-[#F0E6DC] shadow-sm hover:shadow-md transition-shadow" style={{ padding: 24 }}
            >
              <div className="w-12 h-12 rounded-xl bg-[#FEF6F7] flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-[#B8405E]" />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.3 }}>{f.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.5, color: '#8D8A86', marginTop: 4 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  7. Steps Section                                                   */
/* ------------------------------------------------------------------ */

const STEPS = [
  { icon: MessageCircle, title: 'Start Chat', desc: 'Open our friendly chatbot and pick your event type.' },
  { icon: Send, title: 'Share Details', desc: 'Tell us names, date, venue and upload your photos.' },
  { icon: Sparkles, title: 'Choose Design', desc: 'Pick from stunning templates styled for your event.' },
  { icon: Heart, title: 'Share & Celebrate', desc: 'Send the link via WhatsApp and start the celebrations!' },
];

function StepsSection() {
  return (
    <section style={{ background: 'linear-gradient(#FCE8EB, #FEF6F7)', padding: '80px 24px' }}>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center" style={{ maxWidth: 1000, margin: "0 auto" }}
      >
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-2 bg-white/80 border border-[#F0E6DC] rounded-full"
          style={{ fontSize: 13, fontWeight: 500, padding: '6px 16px', marginBottom: 16, color: '#8D8A86' }}
        >
          <Zap className="w-4 h-4 text-[#B8405E]" /> Simple Process
        </motion.span>

        <motion.h2 variants={fadeUp} style={{ ...HEADING_FONT, fontSize: 36, fontWeight: 600, lineHeight: 1.2, marginBottom: 16 }}>
          Create Your Website in <span style={{ color: '#B8405E' }}>4 Easy Steps</span>
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((s, i) => (
            <motion.div key={s.title} variants={fadeUp} className="relative text-center">
              {/* Arrow connector (visible between cards on desktop) */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-8 -right-4 w-8 text-[#B8405E]">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
              <div className="relative inline-flex">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md"
                  style={{ background: CTA_GRADIENT, boxShadow: '0 4px 16px rgba(184,64,94,0.3)' }}
                >
                  <s.icon className="w-7 h-7 text-white" />
                </div>
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#1F1A1B] text-white flex items-center justify-center" style={{ fontSize: 12, fontWeight: 700 }}>
                  {i + 1}
                </span>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.3, marginTop: 16 }}>{s.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.5, color: '#8D8A86', marginTop: 4 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  8. Testimonials Section                                            */
/* ------------------------------------------------------------------ */

function getTestimonials(event: EventConfig) {
  if (event.isCoupleEvent) {
    return [
      { initials: 'AR', name: 'Ananya & Rohit', location: 'Kerala', quote: 'Our guests were blown away! The WhatsApp sharing made things so easy. We saved so much compared to paper invites.' },
      { initials: 'SV', name: 'Sneha & Varun', location: 'Delhi', quote: 'Such a smooth experience. The chatbot asked exactly the right questions and the template was stunning.' },
      { initials: 'MA', name: 'Meera & Arjun', location: 'Mumbai', quote: 'RSVP tracking alone was worth it. We knew exactly how many guests were coming. Highly recommend!' },
    ];
  }
  return [
    { initials: 'PM', name: 'Priya Menon', location: 'Kochi', quote: `The invitation for our ${event.label.toLowerCase()} was absolutely beautiful. Guests kept asking how we made it!` },
    { initials: 'RK', name: 'Ravi Kumar', location: 'Bangalore', quote: 'Super easy to set up and share. The QR code feature is genius. Everyone loved it.' },
    { initials: 'DT', name: 'Deepa Thomas', location: 'Chennai', quote: 'From start to finish it took barely 2 minutes. The design was elegant and professional.' },
  ];
}

function TestimonialsSection({ event }: { event: EventConfig }) {
  const items = getTestimonials(event);

  return (
    <section style={{ background: 'white', padding: '80px 24px' }}>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center" style={{ maxWidth: 1000, margin: "0 auto" }}
      >
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-2 bg-[#FEF6F7] border border-[#F0E6DC] rounded-full"
          style={{ fontSize: 13, fontWeight: 500, padding: '6px 16px', marginBottom: 16, color: '#B8405E' }}
        >
          <Heart className="w-4 h-4" /> Love Stories
        </motion.span>

        <motion.h2 variants={fadeUp} style={{ ...HEADING_FONT, fontSize: 36, fontWeight: 600, lineHeight: 1.2, marginBottom: 16 }}>
          Trusted by Happy <span style={{ color: '#B8405E' }}>{dynamicNoun(event)}</span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6 text-center">
          {items.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              className="bg-[#FAFAFA] rounded-2xl border border-[#F0E6DC]" style={{ padding: 24 }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.5, color: '#4A4044', fontStyle: 'italic' }}>&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 pt-4 border-t border-[#F0E6DC] flex items-center gap-3">
                {/* Avatar initials */}
                <div className="w-10 h-10 rounded-full bg-[#FEF6F7] flex items-center justify-center" style={{ fontSize: 14, fontWeight: 700, color: '#B8405E' }}>
                  {t.initials}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</p>
                  <p className="flex items-center gap-1" style={{ fontSize: 12, color: '#8D8A86' }}>
                    <MapPin className="w-3 h-3" /> {t.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  9. Urgency Section                                                 */
/* ------------------------------------------------------------------ */

function UrgencySection({ event }: { event: EventConfig }) {
  const badges = [
    'Be the first in your family',
    'Impress your relatives',
    'Easy WhatsApp sharing',
  ];

  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #9A3350, #B8405E 50%, #D4546F)',
        padding: '80px 24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center text-white" style={{ maxWidth: 800, margin: "0 auto" }}
      >
        <Clock className="w-10 h-10 mx-auto mb-4 opacity-90" />

        <h2 style={{ ...HEADING_FONT, fontSize: 36, fontWeight: 600, lineHeight: 1.2, marginBottom: 16 }}>
          Don&apos;t Wait Until the Last Minute!
        </h2>

        <p style={{ fontSize: 16, lineHeight: 1.6, opacity: 0.9, maxWidth: 480, margin: '0 auto' }}>
          {event.label} season is here! <span style={{ fontWeight: 700 }}>102 {dynamicNoun(event).toLowerCase()}</span> created their website in the last 24 hours.
        </p>

        <div className="flex flex-wrap justify-center gap-3" style={{ marginTop: 32 }}>
          {badges.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full"
              style={{ fontSize: 14, fontWeight: 500, padding: '8px 16px' }}
            >
              <Check className="w-4 h-4" /> {b}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  10. Final CTA Section                                              */
/* ------------------------------------------------------------------ */

function FinalCTASection({ event, onCreateClick }: { event: EventConfig; onCreateClick: () => void }) {
  return (
    <section style={{ background: 'linear-gradient(#FEF6F7, #FCE8EB)', padding: '80px 24px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center" style={{ maxWidth: 700, margin: "0 auto" }}
      >
        <h2 style={{ ...HEADING_FONT, fontSize: 36, fontWeight: 600, lineHeight: 1.2, marginBottom: 16 }}>
          Ready to Create Your <span style={{ color: '#B8405E' }}>{event.label}</span> Website?
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: '#4A4044', maxWidth: 480, margin: '0 auto' }}>
          Create something beautiful your guests will love and remember.
        </p>

        <button
          onClick={onCreateClick}
          className="inline-flex items-center gap-2 text-white cursor-pointer transition-transform hover:scale-[1.03]"
          style={{
            marginTop: 32,
            padding: '14px 32px',
            fontSize: 15,
            fontWeight: 600,
            background: CTA_GRADIENT,
            borderRadius: 28,
            boxShadow: CTA_SHADOW,
            border: 'none',
          }}
        >
          Start Creating Now <ArrowRight className="w-5 h-5" />
        </button>

        <p style={{ marginTop: 16, fontSize: 14, lineHeight: 1.5, color: '#8D8A86' }}>Free to try. No credit card needed.</p>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  11. "Try it Free!" Modal                                           */
/* ------------------------------------------------------------------ */

function TryItFreeModal({ onClose, onChooseTemplate }: { onClose: () => void; onChooseTemplate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative bg-white rounded-2xl w-full max-w-[420px] mx-4"
        style={{ padding: 40, fontFamily: "'Nunito Sans', sans-serif" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* WhatsApp icon + phone animation */}
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="relative"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#25D366] flex items-center justify-center shadow-lg">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            {/* Small phone icon floating */}
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#B8405E]" />
            </motion.div>
          </motion.div>
        </div>

        {/* Heading */}
        <h2 className="text-center" style={{ fontSize: 28, fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>
          Try it Free!
        </h2>
        <p className="text-center" style={{ fontSize: 14, lineHeight: 1.5, color: '#64748b', marginBottom: 24 }}>
          Create your invitation website today
        </p>

        {/* Bullet points */}
        <div className="space-y-3 mb-6">
          {[
            { text: '1 day free trial', color: '#10B981' },
            { text: 'Pay only when satisfied', color: '#10B981' },
            { text: 'No ads \u00B7 Transparent pricing', color: '#10B981' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: item.color }}>
                <Check className="w-3 h-3 text-white" />
              </div>
              <span style={{ fontSize: 14, color: '#334155', fontWeight: 500 }}>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Activation badge */}
        <div
          className="flex items-center justify-center gap-2 rounded-lg mb-6 py-2.5 px-4"
          style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}
        >
          <Zap className="w-4 h-4 text-orange-500" />
          <span style={{ fontSize: 12, fontWeight: 500, color: '#9a3412' }}>
            46% users activated within 30 mins
          </span>
        </div>

        {/* Choose a Template button */}
        <button
          onClick={onChooseTemplate}
          className="w-full py-3.5 text-white cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ fontSize: 15, fontWeight: 600 }}
          style={{
            background: '#10B981',
            borderRadius: 9999,
            border: 'none',
            boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
          }}
        >
          Choose a Template <ArrowRight className="w-4 h-4 inline-block ml-1" />
        </button>

        {/* Contact link */}
        <p className="text-center" style={{ marginTop: 16, fontSize: 12, color: '#94a3b8' }}>
          For pricing or bulk usage discounts?{' '}
          <a href="#" className="underline hover:text-[#64748b] transition-colors">Contact us</a>
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  12. Fullscreen Template Overlay                                    */
/* ------------------------------------------------------------------ */

const TIERS = ['Basic', 'Standard', 'Premium'] as const;

const TIER_STYLES: Record<string, { bg: string; text: string; activeBg: string; activeText: string }> = {
  Basic:    { bg: '#F1F5F9', text: '#475569', activeBg: '#475569', activeText: '#ffffff' },
  Standard: { bg: '#DBEAFE', text: '#1E40AF', activeBg: '#1E40AF', activeText: '#ffffff' },
  Premium:  { bg: '#FEF3C7', text: '#92400E', activeBg: '#92400E', activeText: '#ffffff' },
};

function TemplateOverlay({
  selectedTemplate,
  setSelectedTemplate,
  onClose,
  onContinue,
}: {
  selectedTemplate: Template | null;
  setSelectedTemplate: (t: Template) => void;
  onClose: () => void;
  onContinue: () => void;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeTier, setActiveTier] = useState<string>('Basic');

  const filteredTemplates = TEMPLATES.filter((t) => t.tier === activeTier);

  const tierBadgeColor = (tier: string) => {
    const s = TIER_STYLES[tier] ?? TIER_STYLES.Basic;
    return { bg: s.bg, text: s.text };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        background: '#f8fafc',
        fontFamily: "'Nunito Sans', sans-serif",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          flexShrink: 0,
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', margin: 0 }}>Choose Your Template</h2>
        <button
          onClick={onClose}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#f1f5f9',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            cursor: 'pointer',
          }}
        >
          <X style={{ width: 20, height: 20 }} />
        </button>
      </div>

      {/* Floating tier tabs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '16px 24px 8px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            gap: 8,
            padding: 4,
            borderRadius: 16,
            background: '#ffffff',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          }}
        >
          {TIERS.map((tier) => {
            const isActive = activeTier === tier;
            const s = TIER_STYLES[tier];
            const count = TEMPLATES.filter((t) => t.tier === tier).length;
            return (
              <motion.button
                key={tier}
                onClick={() => {
                  setActiveTier(tier);
                  gridRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '8px 20px',
                  borderRadius: 12,
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: isActive ? s.activeBg : 'transparent',
                  color: isActive ? s.activeText : s.text,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {tier}
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '1px 7px',
                    borderRadius: 8,
                    background: isActive ? 'rgba(255,255,255,0.25)' : s.bg,
                    color: isActive ? s.activeText : s.text,
                  }}
                >
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Scrollable template grid */}
      <div
        ref={gridRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 24px',
          paddingBottom: 220,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTier}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 20,
              maxWidth: 900,
              margin: '0 auto',
            }}
          >
            {filteredTemplates.map((t) => {
              const isSelected = selectedTemplate?.id === t.id;
              const badge = tierBadgeColor(t.tier);
              return (
                <motion.div
                  key={t.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTemplate(t)}
                  style={{
                    cursor: 'pointer',
                    borderRadius: 16,
                    overflow: 'hidden',
                    background: '#ffffff',
                    border: isSelected ? '3px solid #0EA5E9' : '2px solid #e2e8f0',
                    boxShadow: isSelected ? '0 0 0 3px rgba(14,165,233,0.2)' : '0 1px 3px rgba(0,0,0,0.06)',
                    transition: 'border 0.15s, box-shadow 0.15s',
                  }}
                >
                  <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
                    <img
                      src={t.image}
                      alt={t.name}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    {/* Tier badge */}
                    <span
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        fontSize: 10,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 999,
                        background: badge.bg,
                        color: badge.text,
                      }}
                    >
                      {t.tier}
                    </span>
                    {/* Selected checkmark */}
                    {isSelected && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: '#0EA5E9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Check style={{ width: 14, height: 14, color: '#ffffff' }} />
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', margin: 0 }}>{t.name}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {filteredTemplates.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
            <p style={{ fontSize: 15, fontWeight: 600 }}>No templates in this tier yet</p>
          </div>
        )}
      </div>

      {/* Bottom sheet */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#ffffff',
          zIndex: 60,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          boxShadow: '0 -8px 30px rgba(0,0,0,0.12)',
          padding: '12px 24px 28px',
        }}
      >
        {/* Handle bar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, background: '#d1d5db' }} />
        </div>

        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: 0 }}>Website Preview</h3>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 999,
              background: '#DCFCE7',
              color: '#166534',
            }}
          >
            FREE
          </span>
        </div>

        {/* Info lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Star style={{ width: 14, height: 14, color: '#eab308', fill: '#eab308' }} />
            <span style={{ fontSize: 12, color: '#64748b' }}>Completely FREE</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Check style={{ width: 14, height: 14, color: '#22c55e' }} />
            <span style={{ fontSize: 12, color: '#64748b' }}>Ready in under 5 minutes</span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => {
              gridRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              flex: 1,
              padding: '12px 0',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              background: '#ffffff',
              border: '2px solid #e2e8f0',
              color: '#475569',
            }}
          >
            Change Theme
          </button>
          <button
            onClick={onContinue}
            disabled={!selectedTemplate}
            style={{
              flex: 1,
              padding: '12px 0',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              cursor: selectedTemplate ? 'pointer' : 'not-allowed',
              color: '#ffffff',
              background: selectedTemplate ? 'linear-gradient(135deg, #0EA5E9, #0284C7)' : '#94a3b8',
              border: 'none',
              boxShadow: selectedTemplate ? '0 4px 14px rgba(14,165,233,0.35)' : 'none',
              opacity: selectedTemplate ? 1 : 0.5,
            }}
          >
            Continue to Chatbot <ArrowRight style={{ width: 16, height: 16, display: 'inline-block', marginLeft: 4, verticalAlign: 'middle' }} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ================================================================== */
/*  Page Component                                                     */
/* ================================================================== */

export function Component() {
  const { eventSlug } = useParams();
  const navigate = useNavigate();
  const event = getEventBySlug(eventSlug || '');

  const [showModal, setShowModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  if (!event) return <Navigate to="/" replace />;

  const handleCreateClick = () => {
    setShowModal(true);
  };

  const handleChooseTemplate = () => {
    setShowModal(false);
    setShowTemplates(true);
  };

  const handleContinueToChatbot = () => {
    if (selectedTemplate) {
      sessionStorage.setItem('inviteSelectedTemplate', JSON.stringify(selectedTemplate));
    }
    navigate(`/chatbot?event=${event.type}`);
  };

  return (
    <div>
      <HeroSection event={event} onCreateClick={handleCreateClick} />
      <QRPaperDigitalSection event={event} />
      <WhatsAppSection event={event} />
      <StatsSection />
      <WhyChooseSection event={event} />
      <BenefitsSection event={event} />
      <StepsSection />
      {/* TestimonialsSection removed — no customers yet */}
      {/* UrgencySection removed — no real data yet */}
      <FinalCTASection event={event} onCreateClick={handleCreateClick} />

      <AnimatePresence>
        {showModal && (
          <TryItFreeModal
            onClose={() => setShowModal(false)}
            onChooseTemplate={handleChooseTemplate}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTemplates && (
          <TemplateOverlay
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            onClose={() => setShowTemplates(false)}
            onContinue={handleContinueToChatbot}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
