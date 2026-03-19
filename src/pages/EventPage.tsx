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
      style={{ background: 'linear-gradient(#FEF6F7, #FFFAF8)', padding: '130px 50px 90px' }}
    >
      <div className="flex flex-col items-center gap-12 text-center" style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Hero content — centered */}
        <div style={{ maxWidth: 640 }}>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-[#F0E6DC] rounded-full px-4 py-1.5 text-sm text-[#8D8A86] mb-5"
          >
            <Sparkles className="w-4 h-4 text-[#B8405E]" />
            {seasonBadge(event)}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-[3.4rem] font-bold leading-tight"
            style={HEADING_FONT}
          >
            Create Your Dream{' '}
            <span className="text-[#B8405E]">{event.label}</span>{' '}
            Website
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-5 text-base md:text-lg text-[#6B6966] max-w-xl leading-relaxed"
          >
            Beautiful digital invitations your guests will love. Trusted by{' '}
            <span className="font-bold text-[#1F1A1B]">{event.socialProof}</span>.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-6 flex flex-wrap justify-center gap-3"
          >
            {[
              { text: 'Start Now', icon: <Zap className="w-3.5 h-3.5" /> },
              { text: '5 Min Setup', icon: <Clock className="w-3.5 h-3.5" /> },
              { text: 'Mobile Ready', icon: <Smartphone className="w-3.5 h-3.5" /> },
            ].map((pill) => (
              <span
                key={pill.text}
                className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur rounded-full px-4 py-1.5 text-sm text-[#6B6966] border border-[#F0E6DC]"
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
                fontSize: 16,
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
            className="mt-4 text-sm text-[#8D8A86]"
          >
            Free to try. No credit card needed.
          </motion.p>
        </div>

        {/* Phone mockup — centered below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative flex justify-center"
        >
          {/* Phone frame */}
          <div className="relative w-[280px] h-[560px] rounded-[2.5rem] border-[6px] border-[#1F1A1B] bg-white shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#1F1A1B] rounded-b-xl z-10" />
            <iframe
              src={`/preview/${event.slug}`}
              title="Preview"
              className="w-full h-full border-0 pointer-events-none"
              loading="lazy"
            />
          </div>

          {/* Floating decorative icons */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="absolute -top-4 -left-4 w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center shadow-lg"
          >
            <span className="text-2xl">💐</span>
          </motion.div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.5 }}
            className="absolute top-20 -right-6 w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center shadow-lg"
          >
            <span className="text-xl">💍</span>
          </motion.div>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-16 -left-8 w-11 h-11 rounded-full bg-purple-100 flex items-center justify-center shadow-lg"
          >
            <span className="text-lg">🎊</span>
          </motion.div>
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
    <section style={{ background: 'linear-gradient(#FFFCF9, #FFF8F5 50%, #FFF4F0)', padding: '70px 20px' }}>
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
          className="inline-flex items-center gap-2 bg-white/80 border border-[#F0E6DC] rounded-full px-4 py-1.5 text-sm text-[#8D8A86] mb-4"
        >
          <QrCode className="w-4 h-4 text-[#B8405E]" /> Paper + Digital
        </motion.span>

        <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold" style={HEADING_FONT}>
          Tradition on Paper. <span className="text-[#B8405E]">Magic on Phone.</span>
        </motion.h2>

        <motion.p variants={fadeUp} className="mt-4 text-[#6B6966] text-base leading-relaxed" style={{ maxWidth: 560, margin: "0 auto" }}>
          Print a QR code on your traditional paper card. When guests scan it, they see your beautiful digital invitation with music, photos, maps, and RSVP.
        </motion.p>

        {/* Mockup row: Paper card → wave connector → Phone */}
        <motion.div variants={fadeUp} className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Paper card mockup */}
          <div className="w-56 bg-white rounded-2xl shadow-xl border border-[#F0E6DC] text-center" style={{ padding: 24 }}>
            <p className="text-xs uppercase tracking-widest text-[#8D8A86] mb-2">{event.tagline}</p>
            <h3 className="text-lg font-bold" style={HEADING_FONT}>Your {event.label}</h3>
            <div className="my-4 mx-auto w-20 h-20 rounded-xl flex items-center justify-center bg-[#FEF6F7]">
              <QrCode className="w-12 h-12 text-[#B8405E]" />
            </div>
            <p className="text-xs text-[#8D8A86]">Scan to view invitation</p>
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

          {/* Phone mockup */}
          <div className="w-48 h-80 rounded-[2rem] border-[5px] border-[#1F1A1B] bg-white shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-[#1F1A1B] rounded-b-lg z-10" />
            <div className="h-full flex flex-col items-center justify-center p-4 text-center">
              <Smartphone className="w-8 h-8 text-[#B8405E] mb-2" />
              <p className="text-sm font-semibold">Your Digital</p>
              <p className="text-sm font-semibold text-[#B8405E]">{event.label} Website</p>
              <p className="text-[10px] text-[#8D8A86] mt-2">Music, Photos, Maps, RSVP</p>
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
    <section style={{ background: 'linear-gradient(#F0FFF4, #E8F5E9 50%, #F1F8E9)', padding: '80px 40px' }}>
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
            className="inline-flex items-center gap-2 bg-white/80 border border-green-200 rounded-full px-4 py-1.5 text-sm text-green-700 mb-4"
          >
            <MessageCircle className="w-4 h-4 text-green-600" /> WhatsApp
          </motion.span>

          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold" style={HEADING_FONT}>
            Invite Guests <span className="text-green-600">Instantly</span>
          </motion.h2>

          <motion.div variants={stagger} className="mt-8 flex flex-wrap justify-center gap-6">
            {benefits.map((b) => (
              <motion.div key={b.title} variants={fadeUp} className="flex flex-col items-center gap-2 max-w-[160px]">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0 text-green-600">
                  {b.icon}
                </div>
                <h3 className="font-semibold text-sm">{b.title}</h3>
                <p className="text-xs text-[#6B6966]">{b.desc}</p>
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
          <div className="w-[240px] h-[440px] rounded-[2rem] border-[5px] border-[#1F1A1B] bg-white shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-[#1F1A1B] rounded-b-lg z-10" />
            {/* Browser bar */}
            <div className="mt-5 mx-3 bg-gray-100 rounded-lg px-3 py-1.5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-[9px] text-gray-400 truncate">invitation.ai/invite/...</span>
            </div>
            <div className="p-4 flex flex-col items-center justify-center h-[calc(100%-60px)] text-center">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm font-semibold">Opening {event.label}</p>
              <p className="text-sm font-semibold text-green-600">Invitation...</p>
              {/* Loading bar */}
              <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className="h-full bg-green-500 rounded-full"
                  animate={{ width: ['0%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                />
              </div>
              <p className="text-[10px] text-[#8D8A86] mt-2">Shared via WhatsApp</p>
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
    { value: '500+', label: 'Templates available' },
    { value: '50 Lakh+', label: 'Guests reached' },
  ];

  return (
    <section style={{ background: 'white', padding: '50px 20px' }}>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6" style={{ maxWidth: 1000, margin: '0 auto' }}
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeUp} className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-[#1F1A1B]" style={HEADING_FONT}>{s.value}</p>
            <p className="text-sm text-[#8D8A86] mt-1">{s.label}</p>
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
    <section style={{ background: 'linear-gradient(#FFFBF8, #FFF9F5 50%, #FFFDFB)', padding: '100px 24px' }}>
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
          className="inline-flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-full px-4 py-1.5 mb-4"
        >
          <Leaf className="w-4 h-4" /> Go Paperless &middot; Save Trees &middot; Protect Nature
        </motion.span>

        <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold" style={HEADING_FONT}>
          Why Modern {dynamicNoun(event)} Choose{' '}
          <span className="text-[#B8405E]">{event.label} Websites</span>
        </motion.h2>

        {/* Two comparison cards */}
        <div className="mt-12 grid md:grid-cols-2 gap-8 text-center">
          {/* Old way */}
          <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-[#F0E6DC] shadow-sm" style={{ padding: 32 }}>
            <p className="text-xs uppercase tracking-widest text-[#8D8A86] mb-2">The traditional way</p>
            <h3 className="text-xl font-bold mb-1" style={HEADING_FONT}>Paper Invitations</h3>
            <ul className="mt-5 space-y-3">
              {paperCons.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#6B6966]">
                  <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* New way */}
          <motion.div
            variants={fadeUp}
            className="relative bg-white rounded-2xl border-2 border-[#B8405E] shadow-lg" style={{ padding: 32 }}
          >
            <span className="absolute -top-3 right-6 bg-[#B8405E] text-white text-xs font-semibold px-3 py-1 rounded-full">
              Recommended
            </span>
            <p className="text-xs uppercase tracking-widest text-[#8D8A86] mb-2">The modern, eco-friendly choice</p>
            <h3 className="text-xl font-bold mb-1" style={HEADING_FONT}>
              Invitation.AI <span className="text-[#B8405E]">{event.label}</span> Website
            </h3>
            <ul className="mt-5 space-y-3">
              {digitalPros.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#6B6966]">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Closing text */}
        <motion.p variants={fadeUp} className="mt-10 text-[#6B6966] text-base italic" style={{ maxWidth: 480, margin: "0 auto" }}>
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
    <section style={{ background: 'linear-gradient(#FFF, #FEF6F7)', padding: '70px 20px' }}>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center" style={{ maxWidth: 1000, margin: "0 auto" }}
      >
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-2 bg-white/80 border border-[#F0E6DC] rounded-full px-4 py-1.5 text-sm text-[#8D8A86] mb-4"
        >
          <Sparkles className="w-4 h-4 text-[#B8405E]" /> Features
        </motion.span>

        <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold" style={HEADING_FONT}>
          Everything You Need for a Perfect{' '}
          <span className="text-[#B8405E]">{event.label} Invitation</span>
        </motion.h2>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
          {BENEFIT_CARDS.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              className="bg-white rounded-2xl border border-[#F0E6DC] shadow-sm hover:shadow-md transition-shadow" style={{ padding: 24 }}
            >
              <div className="w-12 h-12 rounded-xl bg-[#FEF6F7] flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-[#B8405E]" />
              </div>
              <h3 className="font-semibold text-base">{f.title}</h3>
              <p className="text-sm text-[#6B6966] mt-1">{f.desc}</p>
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
    <section style={{ background: 'linear-gradient(#FCE8EB, #FEF6F7)', padding: '70px 20px' }}>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center" style={{ maxWidth: 1000, margin: "0 auto" }}
      >
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-2 bg-white/80 border border-[#F0E6DC] rounded-full px-4 py-1.5 text-sm text-[#8D8A86] mb-4"
        >
          <Zap className="w-4 h-4 text-[#B8405E]" /> Simple Process
        </motion.span>

        <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold" style={HEADING_FONT}>
          Create Your Website in <span className="text-[#B8405E]">4 Easy Steps</span>
        </motion.h2>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#1F1A1B] text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-4 font-semibold text-base">{s.title}</h3>
              <p className="mt-1 text-sm text-[#6B6966]">{s.desc}</p>
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
    <section style={{ background: 'white', padding: '70px 20px' }}>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center" style={{ maxWidth: 1000, margin: "0 auto" }}
      >
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-2 bg-[#FEF6F7] border border-[#F0E6DC] rounded-full px-4 py-1.5 text-sm text-[#B8405E] mb-4"
        >
          <Heart className="w-4 h-4" /> Love Stories
        </motion.span>

        <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold" style={HEADING_FONT}>
          Trusted by Happy <span className="text-[#B8405E]">{dynamicNoun(event)}</span>
        </motion.h2>

        <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
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
              <p className="text-sm text-[#6B6966] leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 pt-4 border-t border-[#F0E6DC] flex items-center gap-3">
                {/* Avatar initials */}
                <div className="w-10 h-10 rounded-full bg-[#FEF6F7] flex items-center justify-center text-sm font-bold text-[#B8405E]">
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-[#8D8A86] flex items-center gap-1">
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
        padding: '70px 20px',
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

        <h2 className="text-2xl md:text-3xl font-bold" style={HEADING_FONT}>
          Don&apos;t Wait Until the Last Minute!
        </h2>

        <p className="mt-4 text-base opacity-90 leading-relaxed" style={{ maxWidth: 480, margin: "0 auto" }}>
          {event.label} season is here! <span className="font-bold">102 {dynamicNoun(event).toLowerCase()}</span> created their website in the last 24 hours.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {badges.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-2 text-sm font-medium"
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
    <section style={{ background: 'linear-gradient(#FEF6F7, #FCE8EB)', padding: '70px 20px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center" style={{ maxWidth: 700, margin: "0 auto" }}
      >
        <h2 className="text-2xl md:text-3xl font-bold" style={HEADING_FONT}>
          Ready to Create Your <span className="text-[#B8405E]">{event.label}</span> Website?
        </h2>
        <p className="mt-4 text-[#6B6966] text-base" style={{ maxWidth: 480, margin: "0 auto" }}>
          Join {event.socialProof} who already made their celebrations unforgettable.
        </p>

        <button
          onClick={onCreateClick}
          className="inline-flex items-center gap-2 text-white cursor-pointer transition-transform hover:scale-[1.03]"
          style={{
            marginTop: 32,
            padding: '16px 40px',
            fontSize: 16,
            fontWeight: 600,
            background: CTA_GRADIENT,
            borderRadius: 28,
            boxShadow: CTA_SHADOW,
            border: 'none',
          }}
        >
          Start Creating Now <ArrowRight className="w-5 h-5" />
        </button>

        <p className="mt-4 text-sm text-[#8D8A86]">Free to try. No credit card needed.</p>
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
        <p className="text-center text-sm" style={{ color: '#64748b', marginBottom: 24 }}>
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
              <span className="text-sm" style={{ color: '#334155', fontWeight: 500 }}>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Activation badge */}
        <div
          className="flex items-center justify-center gap-2 rounded-lg mb-6 py-2.5 px-4"
          style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}
        >
          <Zap className="w-4 h-4 text-orange-500" />
          <span className="text-xs font-medium" style={{ color: '#9a3412' }}>
            46% users activated within 30 mins
          </span>
        </div>

        {/* Choose a Template button */}
        <button
          onClick={onChooseTemplate}
          className="w-full py-3.5 text-white font-semibold text-base cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
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
        <p className="text-center mt-4 text-xs" style={{ color: '#94a3b8' }}>
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

  const tierBadgeColor = (tier: string) => {
    if (tier === 'Premium') return { bg: '#FEF3C7', text: '#92400E' };
    if (tier === 'Standard') return { bg: '#DBEAFE', text: '#1E40AF' };
    return { bg: '#F1F5F9', text: '#475569' };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: '#f8fafc', fontFamily: "'Nunito Sans', sans-serif" }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <h2 className="text-lg font-bold" style={{ color: '#1e293b' }}>Choose Your Template</h2>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable template grid */}
      <div
        ref={gridRef}
        className="flex-1 overflow-y-auto px-6 py-6"
        style={{ paddingBottom: 220 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5" style={{ maxWidth: 900, margin: '0 auto' }}>
          {TEMPLATES.map((t) => {
            const isSelected = selectedTemplate?.id === t.id;
            const badge = tierBadgeColor(t.tier);
            return (
              <motion.div
                key={t.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTemplate(t)}
                className="cursor-pointer rounded-2xl overflow-hidden bg-white shadow-sm transition-all"
                style={{
                  border: isSelected ? '3px solid #0EA5E9' : '2px solid #e2e8f0',
                  boxShadow: isSelected ? '0 0 0 3px rgba(14,165,233,0.2)' : undefined,
                }}
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Tier badge */}
                  <span
                    className="absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: badge.bg, color: badge.text }}
                  >
                    {t.tier}
                  </span>
                  {/* Selected checkmark */}
                  {isSelected && (
                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#0EA5E9] flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="px-3 py-2.5">
                  <p className="text-sm font-semibold" style={{ color: '#1e293b' }}>{t.name}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom sheet */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="fixed bottom-0 left-0 right-0 bg-white z-60"
        style={{
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          boxShadow: '0 -8px 30px rgba(0,0,0,0.12)',
          padding: '12px 24px 28px',
        }}
      >
        {/* Handle bar */}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full" style={{ background: '#d1d5db' }} />
        </div>

        {/* Title row */}
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-base font-bold" style={{ color: '#1e293b' }}>Website Preview</h3>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: '#DCFCE7', color: '#166534' }}
          >
            FREE
          </span>
        </div>

        {/* Info lines */}
        <div className="space-y-1.5 mb-5">
          <div className="flex items-center gap-2">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span className="text-xs" style={{ color: '#64748b' }}>Completely FREE</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-green-500" />
            <span className="text-xs" style={{ color: '#64748b' }}>Trusted by 4500+ happy customers</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              gridRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex-1 py-3 text-sm font-semibold rounded-xl cursor-pointer transition-colors hover:bg-gray-50"
            style={{
              background: 'white',
              border: '2px solid #e2e8f0',
              color: '#475569',
            }}
          >
            Change Theme
          </button>
          <button
            onClick={onContinue}
            disabled={!selectedTemplate}
            className="flex-1 py-3 text-sm font-semibold text-white rounded-xl cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: selectedTemplate ? 'linear-gradient(135deg, #0EA5E9, #0284C7)' : '#94a3b8',
              border: 'none',
              boxShadow: selectedTemplate ? '0 4px 14px rgba(14,165,233,0.35)' : 'none',
            }}
          >
            Continue to Chatbot <ArrowRight className="w-4 h-4 inline-block ml-1" />
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
      <TestimonialsSection event={event} />
      <UrgencySection event={event} />
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
