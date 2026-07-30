import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    CalendarPlus,
    MapPin,
    Share2,
    Check,
} from 'lucide-react';
import type { EventType } from '../constants/events';
import { getEventByType } from '../constants/events';
import CountdownTimer from '../components/CountdownTimer';
import CinematicGallery from '../components/CinematicGallery';
import VenueMap from '../components/VenueMap';

export interface TemplateProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData: any;
    eventType: EventType;
    onRsvpClick?: () => void;
    rsvpDone?: 'attending' | 'declined' | null;
}

// ── Helpers ────────────────────────────────────────────────
const SAMPLE_IMAGES = [
    'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=800',
    'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
];

function formatDate(dateStr: string): string {
    try {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return dateStr;
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

// ── Section wrapper ───────────────────────
function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // smooth apple-like ease
            className={className}
        >
            {children}
        </motion.section>
    );
}

// ── Main Component ─────────────────────────────────────────
export default function MinimalistTemplate({ formData, eventType, onRsvpClick, rsvpDone }: TemplateProps) {
    const [rsvpStatus, setRsvpStatus] = useState<'none' | 'attending'>('none');

    if (!formData) return null;

    const event = getEventByType(eventType);
    const eventLabel = event?.label || 'Event';
    const isCoupleEvent = event?.isCoupleEvent ?? false;

    const names = isCoupleEvent && formData.person2Name
        ? (
            <>
                <span>{formData.person1Name}</span>
                <span className="text-[#999] font-normal mx-3">&</span>
                <span>{formData.person2Name}</span>
            </>
        )
        : formData.person1Name;

    const galleryImages =
        formData.images && formData.images.length > 0 ? formData.images : SAMPLE_IMAGES;

    const handleAddToCalendar = () => {
        const icsContent = generateICS(formData, eventLabel);
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invite.ics`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleShareWhatsApp = () => {
        const text = `Join us for the ${eventLabel.toLowerCase()} on ${formatDate(formData.date)}.`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="w-full relative bg-white text-black overflow-hidden shadow-2xl" style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}>

            {/* Extreme Minimalist Grid Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="max-w-lg mx-auto px-8 relative z-10 pb-20">

                {/* ── Hero ──────────────────────────────────── */}
                <section className="text-center pt-24 pb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        {formData.person1Image && formData.person2Image ? (
                            <div className="flex justify-center mb-8 relative w-48 h-28 mx-auto -mt-6">
                                <img
                                    src={formData.person1Image}
                                    alt={formData.person1Name}
                                    className="absolute left-0 w-28 h-28 rounded-full object-cover border-[6px] border-white shadow-xl z-10 grayscale hover:grayscale-0 transition-all duration-700"
                                />
                                <img
                                    src={formData.person2Image}
                                    alt={formData.person2Name || ''}
                                    className="absolute right-0 w-28 h-28 rounded-full object-cover border-[6px] border-white shadow-xl z-0 grayscale hover:grayscale-0 transition-all duration-700"
                                />
                            </div>
                        ) : formData.person1Image ? (
                            <div className="w-32 h-32 mx-auto mb-8 rounded-full border-[6px] border-white shadow-xl overflow-hidden -mt-6 grayscale hover:grayscale-0 transition-all duration-700">
                                <img src={formData.person1Image} alt={formData.person1Name} className="w-full h-full object-cover" />
                            </div>
                        ) : null}

                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#888] font-semibold mb-6">
                            {event?.tagline || 'You are invited'}
                        </p>

                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-none mb-10 text-black">
                            {names}
                        </h1>

                        <div className="w-full h-[1px] bg-[#EAEAEA] mx-auto mb-10" />

                        <div className="flex flex-col items-center gap-1">
                            <p className="text-2xl font-bold tracking-tight">{formatDate(formData.date)}</p>
                            {formData.time && (
                                <p className="text-sm font-medium text-[#666] tracking-wide mt-2">{formData.time}</p>
                            )}
                        </div>
                    </motion.div>
                </section>

                {/* ── Gallery ─────────────────────────── */}
                <Section className="mt-4 relative mb-20">
                    <div className="rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-white border border-[#F0F0F0] p-2">
                        <div className="rounded-2xl overflow-hidden">
                            <CinematicGallery images={galleryImages} maxPhotos={3} tier="Standard" />
                        </div>
                    </div>
                </Section>

                {/* ── Countdown ─────────────────────────────── */}
                <Section className="mt-16 text-center">
                    <h2 className="text-xs text-[#888] mb-6 tracking-[0.2em] uppercase font-bold">
                        {event?.countdownLabel || 'Remaining Time'}
                    </h2>
                    <div className="bg-[#FAF9F8] rounded-[2rem] p-8 border border-[#F0F0F0]">
                        <CountdownTimer targetDate={formData.date + 'T12:00:00'} />
                    </div>
                </Section>

                {/* ── Venue Map ─────────────────────────────── */}
                {(formData.location || formData.address) && (
                    <Section className="mt-16">
                        <h2 className="text-xs text-[#888] mb-6 tracking-[0.2em] uppercase font-bold text-center">Location</h2>
                        <div className="border border-[#F0F0F0] rounded-[2rem] p-2 bg-white shadow-sm overflow-hidden">
                            <VenueMap
                                locationName={formData.location || 'Venue'}
                                address={formData.address || formData.location || ''}
                                coords={formData.coords}
                            />
                        </div>
                    </Section>
                )}

                {/* ── Action Buttons ────────────────────────── */}
                <Section className="mt-20">
                    <button
                        onClick={() => {
                            if (rsvpDone) return;
                            if (onRsvpClick) onRsvpClick();
                            else setRsvpStatus(prev => prev === 'attending' ? 'none' : 'attending');
                        }}
                        className={`w-full flex items-center justify-center gap-3 py-5 rounded-full font-bold text-sm transition-all duration-300 ${(rsvpDone === 'attending' || rsvpStatus === 'attending')
                            ? 'bg-black text-white shadow-xl scale-[0.98]'
                            : rsvpDone === 'declined'
                                ? 'bg-[#EAEAEA] text-[#666] shadow-sm'
                                : 'bg-black text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
                            }`}
                    >
                        {(rsvpDone === 'attending' || rsvpStatus === 'attending') && <Check size={18} />}
                        {rsvpDone === 'attending' || rsvpStatus === 'attending' ? 'RSVP Confirmed' : rsvpDone === 'declined' ? 'Declined' : 'Confirm Attendance'}
                    </button>

                    <div className="grid grid-cols-3 gap-3 mt-4">
                        <button
                            onClick={handleAddToCalendar}
                            className="flex flex-col items-center justify-center gap-2 py-4 rounded-3xl font-semibold text-xs bg-[#F8F8F8] text-[#333] hover:bg-[#F0F0F0] transition-colors"
                        >
                            <CalendarPlus size={20} className="mb-1" />
                            Calendar
                        </button>

                        <button
                            onClick={() => window.open(formData.coords ? `https://www.google.com/maps/dir/?api=1&destination=${formData.coords.lat},${formData.coords.lng}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.address || formData.location || '')}`, '_blank')}
                            className="flex flex-col items-center justify-center gap-2 py-4 rounded-3xl font-semibold text-xs bg-[#F8F8F8] text-[#333] hover:bg-[#F0F0F0] transition-colors"
                        >
                            <MapPin size={20} className="mb-1" />
                            Directions
                        </button>

                        <button
                            onClick={handleShareWhatsApp}
                            className="flex flex-col items-center justify-center gap-2 py-4 rounded-3xl font-semibold text-xs bg-[#F8F8F8] text-[#333] hover:bg-[#F0F0F0] transition-colors"
                        >
                            <Share2 size={20} className="mb-1" />
                            Share
                        </button>
                    </div>
                </Section>

                {/* ── Footer ────────────────────────────────── */}
                <Section className="text-center mt-32 mb-10">
                    <p className="text-sm font-medium text-[#999]">{event?.footerText || "See you there"}</p>
                </Section>
            </div>
        </div>
    );
}
