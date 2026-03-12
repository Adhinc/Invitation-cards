import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Cake,
  Church,
  Baby,
  Home,
  X,
  Sparkles,
  CalendarPlus,
  MapPin,
  Share2,
  CheckCircle2,
  Palette,
  Crown,
} from 'lucide-react';
import { getEventByType, type EventType } from '../constants/events';
import CountdownTimer from '../components/CountdownTimer';
import CinematicGallery from '../components/CinematicGallery';
import VenueMap from '../components/VenueMap';
import Shagun from '../components/Shagun';

// ── Types ──────────────────────────────────────────────────
interface FormData {
  eventType: EventType;
  person1Name: string;
  person2Name?: string;
  date: string;
  time?: string;
  address?: string;
  location?: string;
  coords?: { lat: number; lng: number };
  parents?: string;
  images?: string[];
  [key: string]: unknown;
}

interface LocationState {
  formData?: FormData;
  eventType?: EventType;
  selectedTemplate?: { id: string; name: string; image: string };
}

// ── Helpers ────────────────────────────────────────────────
const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
  'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=800',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800',
  'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800',
];

const eventIcons: Record<string, typeof Heart> = {
  wedding: Heart,
  betrothal: Heart,
  birthday: Cake,
  baptism: Church,
  holy_communion: Church,
  naming_ceremony: Baby,
  baby_shower: Baby,
  housewarming: Home,
};

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function formatTime(timeStr?: string): string {
  if (!timeStr) return '';
  try {
    const [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`;
  } catch {
    return timeStr;
  }
}

function generateICS(formData: FormData, eventLabel: string): string {
  const dtStart = formData.date.replace(/-/g, '');
  const time = formData.time ? formData.time.replace(/:/g, '') + '00' : '120000';
  const names = formData.person2Name
    ? `${formData.person1Name} & ${formData.person2Name}`
    : formData.person1Name;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BigDate//Invitation//EN',
    'BEGIN:VEVENT',
    `DTSTART:${dtStart}T${time}`,
    `DTEND:${dtStart}T${time}`,
    `SUMMARY:${eventLabel} - ${names}`,
    `LOCATION:${formData.address || formData.location || ''}`,
    `DESCRIPTION:You are invited to the ${eventLabel.toLowerCase()} of ${names}.`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

// ── Floating Hearts Decoration ─────────────────────────────
function FloatingHearts() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-[#C85C6C]/10"
          initial={{
            x: `${15 + i * 15}%`,
            y: '110%',
            rotate: Math.random() * 30 - 15,
            scale: 0.6 + Math.random() * 0.8,
          }}
          animate={{
            y: '-10%',
            rotate: Math.random() * 60 - 30,
          }}
          transition={{
            duration: 12 + Math.random() * 8,
            repeat: Infinity,
            delay: i * 2.5,
            ease: 'linear',
          }}
        >
          <Heart size={28 + i * 6} fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
}

// ── Section wrapper with whileInView ───────────────────────
function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ── Main Component ─────────────────────────────────────────
export function Component() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, eventType, selectedTemplate } = (location.state as LocationState) || {};

  const [bannerVisible, setBannerVisible] = useState(true);
  const [rsvpStatus, setRsvpStatus] = useState<'none' | 'attending'>('none');

  // Redirect if no formData
  if (!formData) return <Navigate to="/" replace />;

  const event = getEventByType(eventType || formData.eventType);
  const tagline = event?.tagline || 'You are cordially invited';
  const subtitle = event?.subtitle || 'to celebrate with us';
  const countdownLabel = event?.countdownLabel || 'Countdown';
  const footerText = event?.footerText || "Can't wait to see you there!";
  const eventLabel = event?.label || 'Event';
  const isCoupleEvent = event?.isCoupleEvent ?? false;

  const IconComponent = eventIcons[eventType || formData.eventType] || Heart;

  const names = isCoupleEvent && formData.person2Name
    ? `${formData.person1Name} & ${formData.person2Name}`
    : formData.person1Name;

  const galleryImages =
    formData.images && formData.images.length > 0 ? formData.images : SAMPLE_IMAGES;

  // ── Handlers ───────────────────────────────────────────
  const handleAddToCalendar = () => {
    const icsContent = generateICS(formData, eventLabel);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${eventLabel.toLowerCase().replace(/\s+/g, '-')}-invitation.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGetDirections = () => {
    const url = formData.coords
      ? `https://www.google.com/maps/dir/?api=1&destination=${formData.coords.lat},${formData.coords.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.address || formData.location || '')}`;
    window.open(url, '_blank');
  };

  const handleShareWhatsApp = () => {
    const text = `You're invited! ${names} ${isCoupleEvent ? 'are' : 'is'} celebrating ${isCoupleEvent ? 'their' : 'a'} ${eventLabel.toLowerCase()} on ${formatDate(formData.date)}${formData.time ? ' at ' + formatTime(formData.time) : ''}. ${formData.location ? 'Venue: ' + formData.location : ''}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleRsvp = () => {
    setRsvpStatus((prev) => (prev === 'attending' ? 'none' : 'attending'));
  };

  // ── Render ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FFF9F5] relative">
      <FloatingHearts />

      {/* ── 1. Upgrade Banner (fixed top) ──────────────── */}
      <AnimatePresence>
        {bannerVisible && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#C85C6C] to-[#e8829a] text-white px-4 py-3 flex items-center justify-center gap-3 shadow-lg"
          >
            <Sparkles size={16} className="shrink-0" />
            <span className="text-sm font-semibold">
              Free preview — Upgrade for shareable link
            </span>
            <button
              onClick={() => navigate('/pricing')}
              className="ml-2 bg-white text-[#C85C6C] text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full hover:bg-rose-50 transition-colors"
            >
              Activate Now
            </button>
            <button
              onClick={() => setBannerVisible(false)}
              className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Dismiss banner"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content ───────────────────────────────── */}
      <div className={`max-w-lg mx-auto p-4 md:p-8 relative z-10 ${bannerVisible ? 'pt-16' : ''} pb-28`}>

        {/* ── 2. Hero ──────────────────────────────────── */}
        <Section className="text-center pt-8 pb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#C85C6C]/10 flex items-center justify-center"
          >
            <IconComponent size={36} className="text-[#C85C6C]" />
          </motion.div>

          <p className="text-sm uppercase tracking-[0.25em] text-[#C85C6C]/60 font-bold mb-2">
            {tagline}
          </p>
          <p className="text-sm text-slate-400 font-medium mb-6">{subtitle}</p>

          <h1 className="font-serif text-4xl md:text-5xl text-[#C85C6C] font-bold leading-tight mb-4">
            {names}
          </h1>

          <div className="flex flex-col items-center gap-1 mt-4">
            <p className="text-lg font-semibold text-slate-700">{formatDate(formData.date)}</p>
            {formData.time && (
              <p className="text-sm text-slate-400 font-medium">{formatTime(formData.time)}</p>
            )}
          </div>

          {formData.parents && (
            <p className="text-xs text-slate-400 mt-4 italic">{formData.parents}</p>
          )}
        </Section>

        {/* ── Divider ──────────────────────────────────── */}
        <div className="flex items-center justify-center gap-3 my-6">
          <div className="h-px w-16 bg-[#C85C6C]/20" />
          <Heart size={12} className="text-[#C85C6C]/30" fill="currentColor" />
          <div className="h-px w-16 bg-[#C85C6C]/20" />
        </div>

        {/* ── 3. Photo Gallery ─────────────────────────── */}
        <Section>
          <CinematicGallery images={galleryImages} maxPhotos={50} tier="Premium" />
        </Section>

        {/* ── 4. Countdown ─────────────────────────────── */}
        <Section className="mt-12">
          <h2 className="font-serif text-2xl text-center text-[#C85C6C] mb-2">{countdownLabel}</h2>
          <CountdownTimer targetDate={formData.date + 'T12:00:00'} />
        </Section>

        {/* ── 5. Venue Map ─────────────────────────────── */}
        {(formData.location || formData.address) && (
          <Section>
            <VenueMap
              locationName={formData.location || 'Venue'}
              address={formData.address || formData.location || ''}
              coords={formData.coords}
            />
          </Section>
        )}

        {/* ── 6. Shagun ────────────────────────────────── */}
        <Section>
          <Shagun
            upiId="wedding.invitation@okaxis"
            recipientName={names}
          />
        </Section>

        {/* ── 7. Action Buttons ────────────────────────── */}
        <Section className="mt-12 grid grid-cols-2 gap-3">
          {/* RSVP */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleRsvp}
            className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all border ${
              rsvpStatus === 'attending'
                ? 'bg-[#C85C6C] text-white border-[#C85C6C] shadow-lg shadow-rose-200'
                : 'bg-white text-[#C85C6C] border-[#C85C6C]/30 hover:border-[#C85C6C]'
            }`}
          >
            <CheckCircle2 size={18} />
            {rsvpStatus === 'attending' ? 'Attending!' : 'RSVP'}
          </motion.button>

          {/* Add to Calendar */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCalendar}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm bg-white text-slate-700 border border-slate-200 hover:border-[#C85C6C]/40 transition-all"
          >
            <CalendarPlus size={18} className="text-[#C85C6C]" />
            Add to Calendar
          </motion.button>

          {/* Get Directions */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleGetDirections}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm bg-white text-slate-700 border border-slate-200 hover:border-[#C85C6C]/40 transition-all"
          >
            <MapPin size={18} className="text-[#C85C6C]" />
            Get Directions
          </motion.button>

          {/* Share on WhatsApp */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleShareWhatsApp}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm bg-[#25D366] text-white border border-[#25D366] hover:bg-[#20bd5a] transition-all"
          >
            <Share2 size={18} />
            WhatsApp
          </motion.button>
        </Section>

        {/* ── 8. Footer ────────────────────────────────── */}
        <Section className="text-center mt-16 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-[#C85C6C]/20" />
            <Heart size={10} className="text-[#C85C6C]/30" fill="currentColor" />
            <div className="h-px w-12 bg-[#C85C6C]/20" />
          </div>
          <p className="font-serif text-lg text-slate-500 italic mb-2">{footerText}</p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-300 font-black">
            Crafted with Love by BigDate
          </p>
        </Section>
      </div>

      {/* ── 9. Floating Bottom Bar ─────────────────────── */}
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-rose-100 px-4 py-3 safe-bottom"
      >
        <div className="max-w-lg mx-auto flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              navigate('/templates', {
                state: { formData, eventType: eventType || formData.eventType },
              })
            }
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Palette size={18} />
            Change Theme
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/pricing')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#C85C6C] to-[#e8829a] shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-shadow"
          >
            <Crown size={18} />
            Activate Now
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
