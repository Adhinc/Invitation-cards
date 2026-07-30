import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Share2, Sparkles, CheckCircle2, Heart } from 'lucide-react';
import type { EventType } from '../constants/events';
import { getEventByType } from '../constants/events';
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
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
    'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=800',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800',
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

// ── Custom Midnight Countdown Component ──────────────────────
function MidnightCountdown({ targetDate }: { targetDate: string }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();
            let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
            if (difference > 0) {
                timeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return timeLeft;
        };
        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    const Pad = ({ num, label }: { num: number; label: string }) => (
        <div className="flex flex-col items-center justify-center bg-[#0C121D] border border-[#222E46] rounded-xl p-4 md:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-1 right-2 opacity-20"><Sparkles size={10} color="#7BA7D9" /></div>
            <span className="text-3xl md:text-5xl font-bold font-serif text-white mb-1 shadow-sm leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {String(num).padStart(2, '0')}
            </span>
            <span className="text-[9px] md:text-[10px] tracking-[0.25em] text-[#A1B5D8] font-bold uppercase mt-1">
                {label}
            </span>
        </div>
    );

    return (
        <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-xs mx-auto">
            <Pad num={timeLeft.days} label="Days" />
            <Pad num={timeLeft.hours} label="Hours" />
            <Pad num={timeLeft.minutes} label="Minutes" />
            <Pad num={timeLeft.seconds} label="Seconds" />
        </div>
    );
}

// ── Section wrapper ───────────────────────
function Section({ children, className = '' }: { children: React.ReactNode; className?: string; }) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
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

    const galleryImages =
        formData.images && formData.images.length > 0 ? formData.images : SAMPLE_IMAGES;

    const handleShareWhatsApp = () => {
        const namesShared = isCoupleEvent && formData.person2Name ? `${formData.person1Name} & ${formData.person2Name}` : formData.person1Name;
        const text = `You're invited! ${namesShared} ${isCoupleEvent ? 'are' : 'is'} celebrating ${isCoupleEvent ? 'their' : 'a'} ${eventLabel.toLowerCase()} on ${formatDate(formData.date)}${formData.time ? ' at ' + formatTime(formData.time) : ''}.\n\nView Invitation & RSVP here:\n${window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="w-full relative text-[#E5E5E5] overflow-hidden rounded-md" style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Arial, sans-serif", background: 'radial-gradient(ellipse at center, #0B1121 0%, #04060B 100%)' }}>

            {/* Subtle Starry Particle Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{
                backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                backgroundPosition: '0 0, 20px 20px'
            }} />

            <div className="max-w-md mx-auto p-0 relative z-10 pb-16">

                {/* ── Outer Stroke Border framing the entire card ── */}
                <div className="m-4 border border-[#222E46] rounded-[2.5rem] relative overflow-hidden bg-[#070A11]/60 backdrop-blur-sm">

                    {/* Glowing Core */}
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[30%] bg-[#7BA7D9]/20 blur-[100px] pointer-events-none rounded-full" />

                    {/* ── 1. Hero ──────────────────────────────────── */}
                    <Section className="text-center pt-16 pb-12 px-6 flex flex-col items-center">

                        {/* Top Profile (Person 1) */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1 }}
                            className="w-32 h-32 rounded-full border border-[rgba(123,167,217,0.3)] p-1 shadow-[0_0_30px_rgba(123,167,217,0.1)] mb-10 overflow-hidden relative"
                        >
                            <div className="w-full h-full rounded-full overflow-hidden">
                                {formData.person1Image ? (
                                    <img src={formData.person1Image} alt={formData.person1Name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-[#1A2639] flex items-center justify-center"><Heart className="text-[#A1B5D8]" /></div>
                                )}
                            </div>
                        </motion.div>

                        {/* "You are invited to" */}
                        <p className="text-2xl text-[#8EACD9] mb-4" style={{ fontFamily: "'Great Vibes', cursive" }}>
                            {event?.tagline || 'You are invited to'}
                        </p>

                        {/* "The Wedding Of" */}
                        <p className="text-[10px] tracking-[0.3em] font-black uppercase text-[#D5E1F2] mb-12 opacity-80">
                            {isCoupleEvent ? 'The Wedding of' : `The ${eventLabel} of`}
                        </p>

                        {/* Names */}
                        <div className="flex flex-col items-center justify-center w-full relative mb-12">
                            <h1 className="text-6xl md:text-7xl font-normal leading-none text-white tracking-widest drop-shadow-md z-10" style={{ fontFamily: "'Great Vibes', cursive", textShadow: '0 4px 20px rgba(255,255,255,0.1)' }}>
                                {formData.person1Name}
                            </h1>

                            {isCoupleEvent && formData.person2Name && (
                                <>
                                    <span className="text-4xl text-[#7BA7D9] my-6" style={{ fontFamily: "'Great Vibes', cursive" }}>&</span>
                                    <h1 className="text-6xl md:text-7xl font-normal leading-none text-white tracking-widest drop-shadow-md z-10" style={{ fontFamily: "'Great Vibes', cursive", textShadow: '0 4px 20px rgba(255,255,255,0.1)' }}>
                                        {formData.person2Name}
                                    </h1>
                                </>
                            )}
                        </div>

                        {/* Event Date Text */}
                        <div className="w-full bg-gradient-to-r from-transparent via-[#E04B5A] to-transparent h-[1px] opacity-40 mb-8" />
                        <p className="text-lg text-[#E0E7F1] italic font-serif">
                            {formatDate(formData.date)}
                        </p>
                        {formData.time && (
                            <p className="text-xs text-[#A1B5D8] tracking-[0.2em] uppercase font-bold mt-3">
                                {formatTime(formData.time)}
                            </p>
                        )}
                        <div className="w-full bg-gradient-to-r from-transparent via-[#E04B5A] to-transparent h-[1px] opacity-40 mt-8" />

                        {/* Bottom Profile (Person 2) if exists */}
                        {isCoupleEvent && formData.person2Name && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.3 }}
                                className="w-32 h-32 rounded-full border border-[rgba(123,167,217,0.3)] p-1 shadow-[0_0_30px_rgba(123,167,217,0.1)] mt-12 overflow-hidden"
                            >
                                <div className="w-full h-full rounded-full overflow-hidden">
                                    {formData.person2Image ? (
                                        <img src={formData.person2Image} alt={formData.person2Name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-[#1A2639] flex items-center justify-center"><Heart className="text-[#A1B5D8]" /></div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </Section>

                    {/* ── Red Divider with Cross ── */}
                    <div className="relative flex items-center justify-center w-full py-4 -my-4 z-20">
                        <div className="absolute w-full h-px bg-[#E04B5A] opacity-50" />
                        <div className="relative bg-[#E04B5A] w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#070A11] shadow-[0_0_15px_rgba(224,75,90,0.5)]">
                            <span className="text-white text-xl font-light leading-none mb-1">+</span>
                        </div>
                    </div>

                    {/* ── Countdown ─────────────────────────────── */}
                    <Section className="py-16 px-6 text-center">
                        <div className="relative inline-block mb-10">
                            <h2 className="text-5xl md:text-6xl text-white font-normal" style={{ fontFamily: "'Great Vibes', cursive" }}>
                                Countdown
                            </h2>
                            {/* Decorative planet/lens flare icon */}
                            <div className="absolute top-[-10px] right-[-20px] w-8 h-8 rounded-full bg-gradient-to-tr from-white to-[#FFA8B4] opacity-80 shadow-[0_0_10px_#FFA8B4]" />
                        </div>

                        <div className="flex items-center justify-center gap-3 mb-12">
                            <div className="w-16 h-[1px] bg-[#334155]" />
                            <Sparkles size={12} className="text-[#7BA7D9]" />
                            <div className="w-16 h-[1px] bg-[#334155]" />
                        </div>

                        <MidnightCountdown targetDate={formData.date + 'T12:00:00'} />

                        <p className="text-[12px] italic text-[#A1B5D8] mt-12 font-serif">
                            We are excited to see you at our special event
                        </p>
                    </Section>

                    {/* ── Red Divider with Cross ── */}
                    <div className="relative flex items-center justify-center w-full py-4 -my-4 z-20">
                        <div className="absolute w-full h-px bg-[#E04B5A] opacity-50" />
                        <div className="relative bg-[#E04B5A] w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#070A11] shadow-[0_0_15px_rgba(224,75,90,0.5)]">
                            <span className="text-white text-xl font-light leading-none mb-1">+</span>
                        </div>
                    </div>

                    {/* ── The Happy Couple / Title Section ─────────────────────────────── */}
                    <Section className="py-16 px-4 text-center">
                        <h2 className="text-4xl md:text-5xl text-white font-normal mb-6" style={{ fontFamily: "'Great Vibes', cursive" }}>
                            {isCoupleEvent ? 'The Happy Couple' : 'Our Story'}
                        </h2>
                        <p className="text-[#7BA7D9] italic text-lg" style={{ fontFamily: "'Great Vibes', cursive" }}>
                            {isCoupleEvent ? 'Two hearts, one moonlit journey' : 'A night to remember forever'}
                        </p>

                        <div className="mt-12 mx-auto rounded-3xl overflow-hidden border border-[#222E46] bg-black p-1 shadow-2xl relative">
                            <div className="rounded-2xl overflow-hidden">
                                <CinematicGallery images={galleryImages} maxPhotos={5} tier="Premium" />
                            </div>
                        </div>
                    </Section>

                    {/* ── Venue Map ─────────────────────────────── */}
                    {(formData.location || formData.address) && (
                        <Section className="pb-16 px-6">
                            <div className="flex items-center justify-center gap-3 mb-8">
                                <div className="w-16 h-[1px] bg-[#334155]" />
                                <MapPin size={12} className="text-[#E04B5A]" />
                                <div className="w-16 h-[1px] bg-[#334155]" />
                            </div>
                            <h2 className="text-xs text-[#A1B5D8] mb-6 tracking-[0.3em] uppercase font-bold text-center">The Venue</h2>
                            <div className="border border-[#222E46] rounded-[2rem] p-2 bg-[#0C121D] shadow-xl overflow-hidden">
                                <VenueMap
                                    locationName={formData.location || 'Venue'}
                                    address={formData.address || formData.location || ''}
                                    coords={formData.coords}
                                />
                            </div>
                        </Section>
                    )}

                    {/* ── Action Buttons ────────────────────────── */}
                    <Section className="px-6 pb-20">
                        <button
                            onClick={() => {
                                if (rsvpDone) return;
                                if (onRsvpClick) onRsvpClick();
                                else setRsvpStatus(prev => prev === 'attending' ? 'none' : 'attending');
                            }}
                            className={`w-full flex items-center justify-center gap-3 py-5 a rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300 ${(rsvpDone === 'attending' || rsvpStatus === 'attending')
                                ? 'bg-gradient-to-r from-[#2ecc71] to-[#27ae60] text-white shadow-[0_0_30px_rgba(46,204,113,0.3)] scale-[0.98]'
                                : rsvpDone === 'declined'
                                    ? 'bg-gradient-to-r from-[#e74c3c] to-[#c0392b] text-white shadow-[0_0_30px_rgba(231,76,60,0.3)] scale-[0.98]'
                                    : 'bg-gradient-to-xl bg-[#E04B5A] text-white shadow-[0_10px_30px_rgba(224,75,90,0.4)] hover:shadow-[0_15px_40px_rgba(224,75,90,0.6)] hover:scale-[1.02]'
                                }`}
                        >
                            {(rsvpDone === 'attending' || rsvpStatus === 'attending') ? <CheckCircle2 size={18} /> : null}
                            {rsvpDone === 'attending' || rsvpStatus === 'attending' ? 'RSVP Confirmed' : rsvpDone === 'declined' ? 'Declined' : 'Confirm Attendance'}
                        </button>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <button
                                onClick={handleShareWhatsApp}
                                className="flex items-center justify-center gap-3 py-4 rounded-full font-bold text-xs uppercase tracking-widest border border-[#334155] bg-[#0C121D] text-[#A1B5D8] hover:border-[#7BA7D9] transition-colors"
                            >
                                <Share2 size={16} />
                                Share
                            </button>

                            <button
                                onClick={() => window.open(formData.coords ? `https://www.google.com/maps/dir/?api=1&destination=${formData.coords.lat},${formData.coords.lng}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.address || formData.location || '')}`, '_blank')}
                                className="flex items-center justify-center gap-3 py-4 rounded-full font-bold text-xs uppercase tracking-widest border border-[#334155] bg-[#0C121D] text-[#A1B5D8] hover:border-[#7BA7D9] transition-colors"
                            >
                                <MapPin size={16} />
                                Directions
                            </button>
                        </div>
                    </Section>
                </div>

                {/* ── Footer ────────────────────────────────── */}
                <Section className="text-center mt-6 mb-10 text-[#4B6386]">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold">
                        Crafted by Initiation.AI
                    </p>
                </Section>
            </div>
        </div>
    );
}
