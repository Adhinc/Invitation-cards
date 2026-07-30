import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, CheckCircle2 } from 'lucide-react';
import type { EventType } from '../constants/events';
import { getInvitationBySlug, submitRsvp } from '../lib/invitations';
import { getImageUrl } from '../lib/storage';
import { DefaultTemplate, RoyalGoldTemplate, MinimalistTemplate } from '../templates';

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

interface InvitationRecord {
  id: string;
  slug: string;
  event_type: string;
  form_data: FormData;
  status: string;
  expires_at: string | null;
  template_id?: string;
  invitation_images?: { storage_path: string; type: string; display_order: number }[];
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
        zIndex: 9999,
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
  const formData = { ...invitation.form_data };
  const eventType = (invitation.event_type || formData.eventType) as EventType;

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

  formData.images = galleryImages;

  // ── Handlers ───────────────────────────────────────────
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

  const renderTemplate = () => {
    const templateId = invitation.template_id || 'default';

    switch (templateId) {
      case 'royal_gold':
        return <RoyalGoldTemplate formData={formData} eventType={eventType} onRsvpClick={() => setRsvpModal(true)} rsvpDone={rsvpDone} />;
      case 'minimalist':
        return <MinimalistTemplate formData={formData} eventType={eventType} onRsvpClick={() => setRsvpModal(true)} rsvpDone={rsvpDone} />;
      case 'default':
      default:
        return <DefaultTemplate formData={formData} eventType={eventType} onRsvpClick={() => setRsvpModal(true)} rsvpDone={rsvpDone} />;
    }
  };

  // ── Render ─────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
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

      {/* ── Main Template Container ───────────────────────────────── */}
      <div className="w-full flex-1 flex justify-center items-start min-h-screen bg-[#FFFBF8] lg:bg-[#EBE5E0] lg:p-12 relative z-10">
        <div className="w-full max-w-md lg:shadow-2xl lg:border-[12px] lg:border-black lg:rounded-[3rem] lg:overflow-hidden relative bg-white min-h-[100vh] lg:min-h-[850px] lg:max-h-[850px] overflow-y-auto custom-scrollbar">
          {/* Mockup Notch (Desktop only) */}
          <div className="hidden lg:block absolute top-0 inset-x-0 h-6 bg-black rounded-b-3xl w-40 mx-auto z-[999]"></div>
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}
