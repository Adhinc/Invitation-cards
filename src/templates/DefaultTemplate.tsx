import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Cake,
  Church,
  Baby,
  Home,
  CalendarPlus,
  MapPin,
  Share2,
  CheckCircle2,
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
  parents?: Record<string, string | null> | null;
  images?: string[];
  person1Image?: string;
  person2Image?: string;
  [key: string]: unknown;
}

export interface TemplateProps {
  formData: FormData;
  eventType: EventType;
  onRsvpClick?: () => void;
  rsvpDone?: 'attending' | 'declined' | null;
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
  if (!timeStr.includes(':')) return timeStr;
  try {
    const [hStr, mStr] = timeStr.split(':');
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    if (isNaN(h) || isNaN(m)) return timeStr;
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
const INITIAL_HEARTS = [...Array(6)].map((_, i) => ({
  x: `${15 + i * 15}%`,
  rotateInit: Math.random() * 30 - 15,
  scale: 0.6 + Math.random() * 0.8,
  rotateAnim: Math.random() * 60 - 30,
  duration: 12 + Math.random() * 8,
  delay: i * 2.5,
}));

function FloatingHearts() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {INITIAL_HEARTS.map((h, i) => (
        <motion.div
          key={i}
          className="absolute text-[#2D2A26]/10"
          initial={{
            x: h.x,
            y: '110%',
            rotate: h.rotateInit,
            scale: h.scale,
          }}
          animate={{
            y: '-10%',
            rotate: h.rotateAnim,
          }}
          transition={{
            duration: h.duration,
            repeat: Infinity,
            delay: h.delay,
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
function Section({ children, className = '', bg }: { children: React.ReactNode; className?: string; bg?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
      style={bg ? { background: bg } : undefined}
    >
      {children}
    </motion.section>
  );
}

// ── Main Component ─────────────────────────────────────────
export default function DefaultTemplate({ formData: actualFormData, eventType, onRsvpClick, rsvpDone }: TemplateProps) {
  const [rsvpStatus, setRsvpStatus] = useState<'none' | 'attending'>('none');

  // Redirect if no formData
  if (!actualFormData) return null;

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
    const text = `You're invited! ${names} ${isCoupleEvent ? 'are' : 'is'} celebrating ${isCoupleEvent ? 'their' : 'a'} ${eventLabel.toLowerCase()} on ${formatDate(actualFormData.date)}${actualFormData.time ? ' at ' + formatTime(actualFormData.time) : ''}. ${actualFormData.location ? 'Venue: ' + actualFormData.location : ''}\n\nView Invitation & RSVP here:\n${window.location.href}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // ── Render ─────────────────────────────────────────────
  return (
    <div className="w-full relative" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
      <FloatingHearts />

      {/* ── Main Content ───────────────────────────────── */}
      <div className="max-w-lg mx-auto p-4 md:p-8 relative z-10 pb-8">

        {/* ── 2. Hero ──────────────────────────────────── */}
        <Section className="text-center pt-8 pb-6">
          {actualFormData.person1Image && actualFormData.person2Image ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
              className="flex justify-center mb-6"
            >
              <div className="relative w-40 h-24">
                <img
                  src={actualFormData.person1Image}
                  alt={actualFormData.person1Name}
                  className="absolute left-0 w-24 h-24 rounded-full object-cover border-4 border-[#FFFBF8] shadow-[0_8px_24px_rgba(0,0,0,0.12)] z-10"
                />
                <img
                  src={actualFormData.person2Image}
                  alt={actualFormData.person2Name || ''}
                  className="absolute right-0 w-24 h-24 rounded-full object-cover border-4 border-[#FFFBF8] shadow-[0_8px_24px_rgba(0,0,0,0.12)] z-0"
                />
              </div>
            </motion.div>
          ) : actualFormData.person1Image ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full border-4 border-[#FFFBF8] shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden"
            >
              <img src={actualFormData.person1Image} alt={actualFormData.person1Name} className="w-full h-full object-cover" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#B8405E]/10 flex items-center justify-center"
            >
              <IconComponent size={36} className="text-[#B8405E]" />
            </motion.div>
          )}

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
            onClick={() => {
              if (rsvpDone) return;
              if (onRsvpClick) onRsvpClick();
              else setRsvpStatus(prev => prev === 'attending' ? 'none' : 'attending');
            }}
            aria-label={rsvpStatus === 'attending' || rsvpDone === 'attending' ? 'Cancel RSVP' : 'RSVP to event'}
            className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all border ${(rsvpDone === 'attending' || rsvpStatus === 'attending')
              ? 'bg-[#B8405E] text-white border-[#B8405E] shadow-lg shadow-[rgba(184,64,94,0.3)]'
              : rsvpDone === 'declined'
                ? 'bg-[#ef4444] text-white border-[#ef4444]'
                : 'bg-white text-[#2D2A26] border-[#F0E6DC] hover:border-[#B8405E]'
              }`}
          >
            <CheckCircle2 size={18} />
            {rsvpDone === 'attending' || rsvpStatus === 'attending' ? 'Attending!' : rsvpDone === 'declined' ? 'Declined' : 'RSVP'}
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
    </div>
  );
}
