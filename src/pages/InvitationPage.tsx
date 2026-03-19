import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Cake,
  Church,
  Baby,
  Home,
  X,
  CalendarPlus,
  MapPin,
  Share2,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { getEventByType, type EventType } from '../constants/events';
import { getInvitationBySlug, submitRsvp } from '../lib/invitations';
import { getImageUrl } from '../lib/storage';
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
  [key: string]: unknown;
}

interface InvitationRecord {
  id: string;
  slug: string;
  event_type: string;
  form_data: FormData;
  status: string;
  expires_at: string | null;
  invitation_images?: { storage_path: string; type: string; display_order: number }[];
}

// ── Helpers ────────────────────────────────────────────────
const EVENT_ICONS: Record<string, typeof Heart> = {
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
    <div style={{ pointerEvents: 'none', position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0 }}>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          style={{ position: 'absolute', color: 'rgba(45, 42, 38, 0.1)' }}
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
function Section({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={style}
    >
      {children}
    </motion.section>
  );
}

// ── RSVP Modal ────────────────────────────────────────────
function RsvpModal({
  onClose,
  onSubmit,
  submitting,
}: {
  onClose: () => void;
  onSubmit: (name: string, phone: string, status: 'attending' | 'declined') => void;
  submitting: boolean;
}) {
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '28px 24px',
          width: '100%',
          maxWidth: '400px',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: '#94a3b8',
          }}
          aria-label="Close RSVP"
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Heart size={28} style={{ color: '#B8405E', margin: '0 auto 8px' }} />
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#2D2A26', margin: 0 }}>
            RSVP
          </h3>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
            Let us know if you can make it!
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Your Name *"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid #F0E6DC',
              fontSize: '14px',
              outline: 'none',
              fontFamily: "'Nunito Sans', sans-serif",
              boxSizing: 'border-box',
            }}
          />
          <input
            type="tel"
            placeholder="Phone (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid #F0E6DC',
              fontSize: '14px',
              outline: 'none',
              fontFamily: "'Nunito Sans', sans-serif",
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            disabled={!guestName.trim() || submitting}
            onClick={() => onSubmit(guestName.trim(), phone.trim(), 'attending')}
            style={{
              flex: 1,
              padding: '14px 0',
              borderRadius: '14px',
              border: 'none',
              background: !guestName.trim() || submitting ? '#d1d5db' : '#22c55e',
              color: '#fff',
              fontWeight: 700,
              fontSize: '14px',
              cursor: !guestName.trim() || submitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontFamily: "'Nunito Sans', sans-serif",
            }}
          >
            <CheckCircle2 size={16} />
            Attending
          </button>
          <button
            disabled={!guestName.trim() || submitting}
            onClick={() => onSubmit(guestName.trim(), phone.trim(), 'declined')}
            style={{
              flex: 1,
              padding: '14px 0',
              borderRadius: '14px',
              border: 'none',
              background: !guestName.trim() || submitting ? '#d1d5db' : '#ef4444',
              color: '#fff',
              fontWeight: 700,
              fontSize: '14px',
              cursor: !guestName.trim() || submitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontFamily: "'Nunito Sans', sans-serif",
            }}
          >
            <X size={16} />
            Can't Make It
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────
export default function InvitationPage() {
  const { slug } = useParams<{ slug: string }>();
  const [invitation, setInvitation] = useState<InvitationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [rsvpModal, setRsvpModal] = useState(false);
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpDone, setRsvpDone] = useState<'attending' | 'declined' | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const data = await getInvitationBySlug(slug);
        if (!data) {
          setError('Invitation not found or has expired');
          setLoading(false);
          return;
        }

        // Check expiry
        if (data.expires_at && new Date(data.expires_at) < new Date()) {
          setExpired(true);
          setLoading(false);
          return;
        }

        setInvitation(data as InvitationRecord);
      } catch {
        setError('Invitation not found or has expired');
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  // ── Loading State ──────────────────────────────────────
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#FFFBF8',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          fontFamily: "'Nunito Sans', sans-serif",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Heart size={40} style={{ color: '#B8405E' }} fill="#B8405E" />
        </motion.div>
        <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 600 }}>
          Loading invitation...
        </p>
      </div>
    );
  }

  // ── Expired State ──────────────────────────────────────
  if (expired) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#FFFBF8',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '24px',
          fontFamily: "'Nunito Sans', sans-serif",
        }}
      >
        <Heart size={48} style={{ color: '#B8405E', opacity: 0.4 }} />
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#2D2A26', margin: 0 }}>
          This invitation has expired
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center' }}>
          The link is no longer active. Please contact the host for details.
        </p>
      </div>
    );
  }

  // ── Error State ────────────────────────────────────────
  if (error || !invitation) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#FFFBF8',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '24px',
          fontFamily: "'Nunito Sans', sans-serif",
        }}
      >
        <Heart size={48} style={{ color: '#B8405E', opacity: 0.4 }} />
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#2D2A26', margin: 0 }}>
          Invitation not found
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center' }}>
          {error || 'Invitation not found or has expired'}
        </p>
      </div>
    );
  }

  // ── Resolve Data ───────────────────────────────────────
  const formData = invitation.form_data;
  const eventType = (invitation.event_type || formData.eventType) as EventType;
  const event = getEventByType(eventType);
  const tagline = event?.tagline || 'You are cordially invited';
  const subtitle = event?.subtitle || 'to celebrate with us';
  const countdownLabel = event?.countdownLabel || 'Countdown';
  const footerText = event?.footerText || "Can't wait to see you there!";
  const eventLabel = event?.label || 'Event';
  const isCoupleEvent = event?.isCoupleEvent ?? false;

  const IconComponent = EVENT_ICONS[eventType] || Heart;

  const names =
    isCoupleEvent && formData.person2Name
      ? `${formData.person1Name} & ${formData.person2Name}`
      : formData.person1Name;

  // Build gallery images from Supabase storage or fallback to form_data images
  const galleryImages: string[] = (() => {
    if (invitation.invitation_images && invitation.invitation_images.length > 0) {
      return invitation.invitation_images
        .sort((a, b) => a.display_order - b.display_order)
        .map((img) => getImageUrl(img.storage_path));
    }
    if (formData.images && formData.images.length > 0) {
      return formData.images;
    }
    return [];
  })();

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
    const shareUrl = window.location.href;
    const text = `You're invited! ${names} ${isCoupleEvent ? 'are' : 'is'} celebrating ${isCoupleEvent ? 'their' : 'a'} ${eventLabel.toLowerCase()} on ${formatDate(formData.date)}${formData.time ? ' at ' + formatTime(formData.time) : ''}. ${formData.location ? 'Venue: ' + formData.location + '. ' : ''}View invitation: ${shareUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleRsvpSubmit = async (guestName: string, phone: string, status: 'attending' | 'declined') => {
    setRsvpSubmitting(true);
    try {
      await submitRsvp(invitation.id, guestName, status, phone || undefined);
      setRsvpDone(status);
      setRsvpModal(false);
    } catch {
      alert('Failed to submit RSVP. Please try again.');
    } finally {
      setRsvpSubmitting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#FFFBF8', position: 'relative', fontFamily: "'Nunito Sans', sans-serif" }}>
      <FloatingHearts />

      {/* ── RSVP Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {rsvpModal && (
          <RsvpModal
            onClose={() => setRsvpModal(false)}
            onSubmit={handleRsvpSubmit}
            submitting={rsvpSubmitting}
          />
        )}
      </AnimatePresence>

      {/* ── Main Content ───────────────────────────────── */}
      <div
        style={{
          maxWidth: '512px',
          margin: '0 auto',
          padding: '16px',
          paddingBottom: '32px',
          position: 'relative',
          zIndex: 10,
        }}
      >

        {/* ── Hero ──────────────────────────────────────── */}
        <Section style={{ textAlign: 'center', paddingTop: '32px', paddingBottom: '24px' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              borderRadius: '50%',
              background: 'rgba(184, 64, 94, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconComponent size={36} style={{ color: '#B8405E' }} />
          </motion.div>

          <p
            style={{
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              color: 'rgba(45, 42, 38, 0.6)',
              fontWeight: 700,
              marginBottom: '8px',
            }}
          >
            {tagline}
          </p>
          <p style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500, marginBottom: '24px' }}>
            {subtitle}
          </p>

          <h1
            style={{
              fontSize: 'clamp(1.875rem, 5vw, 3rem)',
              color: '#2D2A26',
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: '16px',
              wordBreak: 'break-word',
              fontFamily: "'Great Vibes', cursive",
            }}
          >
            {names}
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginTop: '16px' }}>
            <p style={{ fontSize: '18px', fontWeight: 600, color: '#334155' }}>
              {formatDate(formData.date)}
            </p>
            {formData.time && (
              <p style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}>
                {formatTime(formData.time)}
              </p>
            )}
          </div>

          {formData.parents && typeof formData.parents === 'object' && (
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '16px', fontStyle: 'italic' }}>
              With the blessings of{' '}
              {Object.values(formData.parents).filter(Boolean).join(' & ')}
            </p>
          )}
        </Section>

        {/* ── Divider ──────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '24px 0' }}>
          <div style={{ height: '1px', width: '64px', background: 'rgba(45, 42, 38, 0.2)' }} />
          <Heart size={12} style={{ color: 'rgba(184, 64, 94, 0.3)' }} fill="currentColor" />
          <div style={{ height: '1px', width: '64px', background: 'rgba(45, 42, 38, 0.2)' }} />
        </div>

        {/* ── Photo Gallery ─────────────────────────────── */}
        {galleryImages.length > 0 && (
          <Section
            style={{
              borderRadius: '16px',
              border: '1px solid #F0E6DC',
              marginTop: '24px',
              padding: '16px',
              background: '#fff',
            }}
          >
            <CinematicGallery images={galleryImages} maxPhotos={50} tier="Premium" />
          </Section>
        )}

        {/* ── Countdown ─────────────────────────────────── */}
        <Section style={{ marginTop: '32px', borderRadius: '16px', padding: '24px' }}>
          <h2
            style={{
              fontSize: '24px',
              textAlign: 'center',
              color: '#2D2A26',
              marginBottom: '8px',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
            }}
          >
            {countdownLabel}
          </h2>
          <CountdownTimer targetDate={formData.date + 'T12:00:00'} />
        </Section>

        {/* ── Venue Map ─────────────────────────────────── */}
        {(formData.location || formData.address) && (
          <Section
            style={{
              marginTop: '32px',
              borderRadius: '16px',
              border: '1px solid #F0E6DC',
              padding: '16px',
              background: '#fff',
            }}
          >
            <VenueMap
              locationName={formData.location || 'Venue'}
              address={formData.address || formData.location || ''}
              coords={formData.coords}
            />
          </Section>
        )}

        {/* ── Shagun ────────────────────────────────────── */}
        <Section style={{ marginTop: '32px', borderRadius: '16px', padding: '16px' }}>
          <Shagun upiId="wedding.invitation@okaxis" recipientName={names} />
        </Section>

        {/* ── Action Buttons ────────────────────────────── */}
        <Section
          style={{
            marginTop: '32px',
            borderRadius: '16px',
            border: '1px solid #F0E6DC',
            padding: '16px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            background: '#fff',
          }}
        >
          {/* RSVP */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (rsvpDone) return;
              setRsvpModal(true);
            }}
            aria-label="RSVP to event"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '16px 0',
              borderRadius: '16px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: rsvpDone ? 'default' : 'pointer',
              border: rsvpDone
                ? rsvpDone === 'attending'
                  ? '1px solid #22c55e'
                  : '1px solid #ef4444'
                : '1px solid #F0E6DC',
              background: rsvpDone
                ? rsvpDone === 'attending'
                  ? '#22c55e'
                  : '#ef4444'
                : '#fff',
              color: rsvpDone ? '#fff' : '#2D2A26',
              fontFamily: "'Nunito Sans', sans-serif",
              transition: 'all 0.2s',
            }}
          >
            <CheckCircle2 size={18} />
            {rsvpDone === 'attending'
              ? 'Attending!'
              : rsvpDone === 'declined'
                ? 'Declined'
                : 'RSVP'}
          </motion.button>

          {/* Add to Calendar */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCalendar}
            aria-label="Add event to calendar"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '16px 0',
              borderRadius: '16px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              border: '1px solid #F0E6DC',
              background: '#fff',
              color: '#334155',
              fontFamily: "'Nunito Sans', sans-serif",
              transition: 'all 0.2s',
            }}
          >
            <CalendarPlus size={18} style={{ color: '#B8405E' }} />
            Add to Calendar
          </motion.button>

          {/* Get Directions */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleGetDirections}
            aria-label="Get directions to venue"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '16px 0',
              borderRadius: '16px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              border: '1px solid #F0E6DC',
              background: '#fff',
              color: '#334155',
              fontFamily: "'Nunito Sans', sans-serif",
              transition: 'all 0.2s',
            }}
          >
            <MapPin size={18} style={{ color: '#B8405E' }} />
            Get Directions
          </motion.button>

          {/* Share on WhatsApp */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleShareWhatsApp}
            aria-label="Share on WhatsApp"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '16px 0',
              borderRadius: '16px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              border: '1px solid #25D366',
              background: '#25D366',
              color: '#fff',
              fontFamily: "'Nunito Sans', sans-serif",
              transition: 'all 0.2s',
            }}
          >
            <Share2 size={18} />
            WhatsApp
          </motion.button>
        </Section>

        {/* ── Footer ────────────────────────────────────── */}
        <Section style={{ textAlign: 'center', marginTop: '64px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ height: '1px', width: '48px', background: 'rgba(45, 42, 38, 0.2)' }} />
            <Heart size={10} style={{ color: 'rgba(184, 64, 94, 0.3)' }} fill="currentColor" />
            <div style={{ height: '1px', width: '48px', background: 'rgba(45, 42, 38, 0.2)' }} />
          </div>
          <p style={{ fontSize: '18px', color: '#64748b', fontStyle: 'italic', marginBottom: '8px' }}>
            {footerText}
          </p>
          <p
            style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              color: '#cbd5e1',
              fontWeight: 900,
            }}
          >
            Crafted with Love by Invitation.AI
          </p>
        </Section>
      </div>
    </div>
  );
}
