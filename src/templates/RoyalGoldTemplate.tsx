import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles,
    CalendarPlus,
    MapPin,
    Share2,
    CheckCircle2,
} from 'lucide-react';
import type { EventType } from '../constants/events';
import { getEventByType } from '../constants/events';
import CountdownTimer from '../components/CountdownTimer';
import CinematicGallery from '../components/CinematicGallery';
import VenueMap from '../components/VenueMap';
import Shagun from '../components/Shagun';

export interface TemplateProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData: any;
    eventType: EventType;
    onRsvpClick?: () => void;
    rsvpDone?: 'attending' | 'declined' | null;
}

// ── Helpers ────────────────────────────────────────────────
const SAMPLE_IMAGES = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800',
];

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

function generateICS(formData: any, eventLabel: string): string {
    const dtStart = formData.date.replace(/-/g, '');
    const time = formData.time ? formData.time.replace(/:/g, '') + '00' : '120000';
    const names = formData.person2Name
        ? `${formData.person1Name} & ${formData.person2Name}`
        : formData.person1Name;
    return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `DTSTART:${dtStart}T${time}`,
        `DTEND:${dtStart}T${time}`,
        `SUMMARY:${eventLabel} - ${names}`,
        `LOCATION:${formData.address || formData.location || ''}`,
        'END:VEVENT',
        'END:VCALENDAR',
    ].join('\r\n');
}

// ── Floating Gold Dust ─────────────────────────────
const INITIAL_DUST = [...Array(15)].map(() => ({
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    scale: Math.random() * 0.5 + 0.2,
    duration: 4 + Math.random() * 6,
    delay: Math.random() * 5,
}));

function GoldDust() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
            {INITIAL_DUST.map((d, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-[#D4AF37] rounded-full blur-[1px] opacity-40"
                    style={{ width: 4, height: 4 }}
                    initial={{ x: d.x, y: '110%', scale: d.scale, opacity: 0 }}
                    animate={{ y: '-10%', opacity: [0, 0.6, 0] }}
                    transition={{
                        duration: d.duration,
                        repeat: Infinity,
                        delay: d.delay,
                        ease: 'linear',
                    }}
                />
            ))}
        </div>
    );
}

// ── Section wrapper ───────────────────────
function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.section>
    );
}

// ── Main Component ─────────────────────────────────────────
export default function RoyalGoldTemplate({ formData, eventType, onRsvpClick, rsvpDone }: TemplateProps) {
    const [rsvpStatus, setRsvpStatus] = useState<'none' | 'attending'>('none');

    if (!formData) return null;

    const event = getEventByType(eventType);
    const eventLabel = event?.label || 'Event';
    const isCoupleEvent = event?.isCoupleEvent ?? false;

    const names = isCoupleEvent && formData.person2Name
        ? `${formData.person1Name} & ${formData.person2Name}`
        : formData.person1Name;

    const galleryImages =
        formData.images && formData.images.length > 0 ? formData.images : SAMPLE_IMAGES;

    const handleAddToCalendar = () => {
        const icsContent = generateICS(formData, eventLabel);
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${eventLabel.toLowerCase().replace(/\s+/g, '-')}-invitation.ics`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleShareWhatsApp = () => {
        const text = `You're invited! ${names} ${isCoupleEvent ? 'are' : 'is'} celebrating ${isCoupleEvent ? 'their' : 'a'} ${eventLabel.toLowerCase()} on ${formatDate(formData.date)}${formData.time ? ' at ' + formatTime(formData.time) : ''}.`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="w-full relative bg-[#111111] text-[#E5E5E5] overflow-hidden rounded-md shadow-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {/* Background Decor */}
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[#D4AF37]/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#FFD700]/10 blur-[100px] pointer-events-none" />

            <GoldDust />

            <div className="max-w-lg mx-auto p-6 md:p-10 relative z-10 pb-16">

                {/* ── Hero ──────────────────────────────────── */}
                <Section className="text-center pt-12 pb-8">
                    {formData.person1Image && formData.person2Image ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                            className="flex justify-center mb-8"
                        >
                            <div className="relative w-40 h-24">
                                <img
                                    src={formData.person1Image}
                                    alt={formData.person1Name}
                                    className="absolute left-0 w-24 h-24 rounded-full object-cover border-[3px] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)] z-10"
                                />
                                <img
                                    src={formData.person2Image}
                                    alt={formData.person2Name || ''}
                                    className="absolute right-0 w-24 h-24 rounded-full object-cover border-[3px] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)] z-0"
                                />
                            </div>
                        </motion.div>
                    ) : formData.person1Image ? (
                        <motion.div
                            initial={{ scale: 0, rotate: -15 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                            className="w-24 h-24 mx-auto mb-8 rounded-full border-[3px] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)] overflow-hidden"
                        >
                            <img src={formData.person1Image} alt={formData.person1Name} className="w-full h-full object-cover" />
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                            className="w-16 h-16 mx-auto mb-8 rounded-full border border-[#D4AF37]/50 flex items-center justify-center bg-[#D4AF37]/5"
                        >
                            <Sparkles size={28} className="text-[#D4AF37]" />
                        </motion.div>
                    )}

                    <p className="text-xs uppercase tracking-[0.4em] text-[#D4AF37] font-semibold mb-4">
                        {event?.tagline || 'You are graciously invited'}
                    </p>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#C5A028] via-[#FFDF73] to-[#C5A028]" style={{ fontFamily: "'Great Vibes', cursive", padding: '10px 0' }}>
                        {names}
                    </h1>

                    <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6" />

                    <div className="flex flex-col items-center gap-2">
                        <p className="text-xl tracking-wide text-[#FFDF73]">{formatDate(formData.date)}</p>
                        {formData.time && (
                            <p className="text-sm tracking-widest text-[#A0A0A0] uppercase">{formatTime(formData.time)}</p>
                        )}
                    </div>

                    {formData.parents && typeof formData.parents === 'object' && (
                        <p className="text-[11px] uppercase tracking-widest text-[#888888] mt-8">
                            With blessings from <br />
                            <span className="text-[#D4AF37] mt-2 block">{Object.values(formData.parents).filter(Boolean).join(' & ')}</span>
                        </p>
                    )}
                </Section>

                {/* ── Gallery ─────────────────────────── */}
                <Section className="mt-8 relative p-1">
                    <div className="absolute inset-0 border border-[#D4AF37]/30 rounded-xl" />
                    <div className="rounded-xl overflow-hidden bg-black">
                        <CinematicGallery images={galleryImages} maxPhotos={5} tier="Premium" />
                    </div>
                </Section>

                {/* ── Countdown ─────────────────────────────── */}
                <Section className="mt-12 text-center p-8 bg-[#1A1A1A] border border-[#333] rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />
                    <h2 className="text-2xl text-[#E5E5E5] mb-4 tracking-widest uppercase text-sm">
                        {event?.countdownLabel || 'The Countdown Begins'}
                    </h2>
                    {/* We use a wrapper to force white text on the countdown if it doesn't inherit */}
                    <div className="text-white">
                        <CountdownTimer targetDate={formData.date + 'T12:00:00'} />
                    </div>
                </Section>

                {/* ── Venue Map ─────────────────────────────── */}
                {(formData.location || formData.address) && (
                    <Section className="mt-12 p-1 border border-[#D4AF37]/30 rounded-2xl bg-[#111]">
                        <VenueMap
                            locationName={formData.location || 'The Venue'}
                            address={formData.address || formData.location || ''}
                            coords={formData.coords}
                        />
                    </Section>
                )}

                {/* ── Shagun ────────────────────────────────── */}
                <Section className="mt-12 bg-[#1A1A1A] border border-[#333] rounded-2xl p-6 text-white text-center">
                    <h2 className="text-lg text-[#D4AF37] mb-2 tracking-widest uppercase">Blessings & Gifts</h2>
                    <Shagun
                        upiId="wedding.invitation@okaxis"
                        recipientName={names}
                    />
                </Section>

                {/* ── Action Buttons ────────────────────────── */}
                <Section className="mt-12 grid grid-cols-2 gap-4">
                    <button
                        onClick={() => {
                            if (rsvpDone) return;
                            if (onRsvpClick) onRsvpClick();
                            else setRsvpStatus(prev => prev === 'attending' ? 'none' : 'attending');
                        }}
                        className={`flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm transition-all border ${(rsvpDone === 'attending' || rsvpStatus === 'attending')
                            ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                            : rsvpDone === 'declined'
                                ? 'bg-[transparent] text-red-500 border-red-500'
                                : 'bg-transparent text-[#D4AF37] border-[#D4AF37]/50 hover:bg-[#D4AF37]/10'
                            }`}
                    >
                        <CheckCircle2 size={18} />
                        {rsvpDone === 'attending' || rsvpStatus === 'attending' ? 'Accepted' : rsvpDone === 'declined' ? 'Declined' : 'Accept Invite'}
                    </button>

                    <button
                        onClick={handleAddToCalendar}
                        className="flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm bg-[#1A1A1A] text-[#A0A0A0] border border-[#333] hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all"
                    >
                        <CalendarPlus size={18} />
                        Save Date
                    </button>

                    <button
                        onClick={() => window.open(formData.coords ? `https://www.google.com/maps/dir/?api=1&destination=${formData.coords.lat},${formData.coords.lng}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.address || formData.location || '')}`, '_blank')}
                        className="flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm bg-[#1A1A1A] text-[#A0A0A0] border border-[#333] hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all"
                    >
                        <MapPin size={18} />
                        Directions
                    </button>

                    <button
                        onClick={handleShareWhatsApp}
                        className="flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm bg-[#1A1A1A] text-[#A0A0A0] border border-[#333] hover:border-[#25D366] hover:text-[#25D366] transition-all"
                    >
                        <Share2 size={18} />
                        WhatsApp
                    </button>
                </Section>

                {/* ── Footer ────────────────────────────────── */}
                <Section className="text-center mt-20 mb-8">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
                        <Sparkles size={12} className="text-[#D4AF37]" />
                        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
                    </div>
                    <p className="text-lg text-[#A0A0A0] italic tracking-wide">{event?.footerText || "We eagerly await your presence."}</p>
                </Section>
            </div>
        </div>
    );
}
