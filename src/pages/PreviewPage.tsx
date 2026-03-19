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
          className="absolute text-[#2D2A26]/10"
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
  const { formData, eventType, selectedTemplate: _selectedTemplate } = (location.state as LocationState) || {};

  const stored = !formData ? JSON.parse(sessionStorage.getItem('inviteFormData') || 'null') : null;
  const actualFormData = formData || stored;

  const [bannerVisible, setBannerVisible] = useState(true);
  const [rsvpStatus, setRsvpStatus] = useState<'none' | 'attending'>('none');

  // Redirect if no formData
  if (!actualFormData) return <Navigate to="/" replace />;

  const event = getEventByType(eventType || actualFormData.eventType);
  const tagline = event?.tagline || 'You are cordially invited';
  const subtitle = event?.subtitle || 'to celebrate with us';
  const countdownLabel = event?.countdownLabel || 'Countdown';
  const footerText = event?.footerText || "Can't wait to see you there!";
  const eventLabel = event?.label || 'Event';
  const isCoupleEvent = event?.isCoupleEvent ?? false;

  const IconComponent = eventIcons[eventType || actualFormData.eventType] || Heart;

  const names = isCoupleEvent && actualFormData.person2Name
    ? `${actualFormData.person1Name} & ${actualFormData.person2Name}`
    : actualFormData.person1Name;

  const galleryImages =
    actualFormData.images && actualFormData.images.length > 0 ? actualFormData.images : SAMPLE_IMAGES;

  // ── Handlers ───────────────────────────────────────────
  const handleAddToCalendar = () => {
    const icsContent = generateICS(actualFormData, eventLabel);
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
    const url = actualFormData.coords
      ? `https://www.google.com/maps/dir/?api=1&destination=${actualFormData.coords.lat},${actualFormData.coords.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(actualFormData.address || actualFormData.location || '')}`;
    window.open(url, '_blank');
  };

  const handleShareWhatsApp = () => {
    const text = `You're invited! ${names} ${isCoupleEvent ? 'are' : 'is'} celebrating ${isCoupleEvent ? 'their' : 'a'} ${eventLabel.toLowerCase()} on ${formatDate(actualFormData.date)}${actualFormData.time ? ' at ' + formatTime(actualFormData.time) : ''}. ${actualFormData.location ? 'Venue: ' + actualFormData.location : ''}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleRsvp = () => {
    setRsvpStatus((prev) => (prev === 'attending' ? 'none' : 'attending'));
  };

  // ── Render ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FFFBF8] relative" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
      <FloatingHearts />

      {/* ── 1. Upgrade Banner (fixed top) ──────────────── */}
      <AnimatePresence>
        {bannerVisible && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-[#B8405E] text-white px-3 md:px-4 py-2.5 md:py-3 flex items-center justify-center gap-2 md:gap-3 shadow-lg flex-wrap"
          >
            <Sparkles size={14} className="shrink-0 hidden sm:block" />
            <span className="text-xs md:text-sm font-semibold">
              Free preview — Upgrade for shareable link
            </span>
            <button
              onClick={() => navigate('/pricing')}
              className="bg-white text-[#B8405E] text-[10px] md:text-xs font-black uppercase tracking-wider px-3 md:px-4 py-1 md:py-1.5 rounded-full hover:bg-[#FFF5EE] transition-colors"
            >
              Activate Now
            </button>
            <button
              onClick={() => setBannerVisible(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
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
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#B8405E]/10 flex items-center justify-center"
          >
            <IconComponent size={36} className="text-[#B8405E]" />
          </motion.div>

          <p className="text-sm uppercase tracking-[0.25em] text-[#2D2A26]/60 font-bold mb-2">
            {tagline}
          </p>
          <p className="text-sm text-slate-400 font-medium mb-6">{subtitle}</p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl text-[#2D2A26] font-bold leading-tight mb-4 break-words" style={{ fontFamily: "'Great Vibes', cursive" }}>
            {names}
          </h1>

          <div className="flex flex-col items-center gap-1 mt-4">
            <p className="text-lg font-semibold text-slate-700">{formatDate(actualFormData.date)}</p>
            {actualFormData.time && (
              <p className="text-sm text-slate-400 font-medium">{formatTime(actualFormData.time)}</p>
            )}
          </div>

          {actualFormData.parents && typeof actualFormData.parents === 'object' && (
            <p className="text-xs text-slate-400 mt-4 italic">
              With the blessings of{' '}
              {Object.values(actualFormData.parents).filter(Boolean).join(' & ')}
            </p>
          )}
        </Section>

        {/* ── Divider ──────────────────────────────────── */}
        <div className="flex items-center justify-center gap-3 my-6">
          <div className="h-px w-16 bg-[#2D2A26]/20" />
          <Heart size={12} className="text-[#B8405E]/30" fill="currentColor" />
          <div className="h-px w-16 bg-[#2D2A26]/20" />
        </div>

        {/* ── 3. Photo Gallery ─────────────────────────── */}
        <Section bg="white" className="rounded-2xl border border-[#F0E6DC] mt-6 p-4">
          <CinematicGallery images={galleryImages} maxPhotos={50} tier="Premium" />
        </Section>

        {/* ── 4. Countdown ─────────────────────────────── */}
        <Section bg="blush" className="mt-8 rounded-2xl p-6">
          <h2 className="text-2xl text-center text-[#2D2A26] mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{countdownLabel}</h2>
          <CountdownTimer targetDate={actualFormData.date + 'T12:00:00'} />
        </Section>

        {/* ── 5. Venue Map ─────────────────────────────── */}
        {(actualFormData.location || actualFormData.address) && (
          <Section bg="white" className="mt-8 rounded-2xl border border-[#F0E6DC] p-4">
            <VenueMap
              locationName={actualFormData.location || 'Venue'}
              address={actualFormData.address || actualFormData.location || ''}
              coords={actualFormData.coords}
            />
          </Section>
        )}

        {/* ── 6. Shagun ────────────────────────────────── */}
        <Section bg="muted" className="mt-8 rounded-2xl p-4">
          <Shagun
            upiId="wedding.invitation@okaxis"
            recipientName={names}
          />
        </Section>

        {/* ── 7. Action Buttons ────────────────────────── */}
        <Section bg="white" className="mt-8 rounded-2xl border border-[#F0E6DC] p-4 grid grid-cols-2 gap-3">
          {/* RSVP */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleRsvp}
            aria-label={rsvpStatus === 'attending' ? 'Cancel RSVP' : 'RSVP to event'}
            className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all border ${
              rsvpStatus === 'attending'
                ? 'bg-[#B8405E] text-white border-[#B8405E] shadow-lg shadow-[rgba(184,64,94,0.3)]'
                : 'bg-white text-[#2D2A26] border-[#F0E6DC] hover:border-[#B8405E]'
            }`}
          >
            <CheckCircle2 size={18} />
            {rsvpStatus === 'attending' ? 'Attending!' : 'RSVP'}
          </motion.button>

          {/* Add to Calendar */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCalendar}
            aria-label="Add event to calendar"
            className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm bg-white text-slate-700 border border-[#F0E6DC] hover:border-[#B8405E] transition-all"
          >
            <CalendarPlus size={18} className="text-[#B8405E]" />
            Add to Calendar
          </motion.button>

          {/* Get Directions */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleGetDirections}
            aria-label="Get directions to venue"
            className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm bg-white text-slate-700 border border-[#F0E6DC] hover:border-[#B8405E] transition-all"
          >
            <MapPin size={18} className="text-[#B8405E]" />
            Get Directions
          </motion.button>

          {/* Share on WhatsApp */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleShareWhatsApp}
            aria-label="Share on WhatsApp"
            className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm bg-[#25D366] text-white border border-[#25D366] hover:bg-[#20bd5a] transition-all"
          >
            <Share2 size={18} />
            WhatsApp
          </motion.button>
        </Section>

        {/* ── 8. Footer ────────────────────────────────── */}
        <Section className="text-center mt-16 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-[#2D2A26]/20" />
            <Heart size={10} className="text-[#B8405E]/30" fill="currentColor" />
            <div className="h-px w-12 bg-[#2D2A26]/20" />
          </div>
          <p className="text-lg text-slate-500 italic mb-2">{footerText}</p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-300 font-black">
            Crafted with Love by Invitation.AI
          </p>
        </Section>
      </div>

      {/* ── 9. Floating Bottom Bar ─────────────────────── */}
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-[#F0E6DC] px-4 py-3 safe-bottom"
      >
        <div className="max-w-lg mx-auto flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              navigate('/templates', {
                state: { formData: actualFormData, eventType: eventType || actualFormData.eventType },
              })
            }
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-slate-600 bg-[#FFF5EE] hover:bg-[#FFE8DC] transition-colors"
          >
            <Palette size={18} />
            Change Theme
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/pricing')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white bg-[#B8405E] shadow-lg shadow-[rgba(184,64,94,0.3)] hover:bg-[#A03650] transition-colors"
          >
            <Crown size={18} />
            Activate Now
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
