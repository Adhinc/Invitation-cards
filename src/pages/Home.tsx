import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import {
  MessageCircle,
  Palette,
  Share2,
  Star,
  Sparkles,
  Zap,
  QrCode,
  Check,
} from 'lucide-react';
import { EVENTS, PRICING_PLANS } from '../constants/events';
import { fadeUp, stagger } from '../utils/animations';

/* ------------------------------------------------------------------ */
/*  Sample invitation carousel data                                    */
/* ------------------------------------------------------------------ */

const sampleInvitations = [
  { label: 'Wedding', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=520&fit=crop', color: '#C85C6C' },
  { label: 'Birthday', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&h=520&fit=crop', color: '#8499dd' },
  { label: 'Baptism', image: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=300&h=520&fit=crop', color: '#57aa53' },
  { label: 'Baby Shower', image: 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=300&h=520&fit=crop', color: '#f9a8d4' },
  { label: 'Housewarming', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=520&fit=crop', color: '#f97316' },
  { label: 'Holy Communion', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=520&fit=crop', color: '#57aa53' },
];

/* ------------------------------------------------------------------ */
/*  WhatsApp Chat Mockup                                               */
/* ------------------------------------------------------------------ */

function WhatsAppMockup() {
  return (
    <div className="w-full max-w-[320px] mx-auto">
      <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200/60">
        <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">FA</div>
          <div>
            <p className="text-[13px] font-medium">Family Group</p>
            <p className="text-[10px] opacity-60">Mom, Dad, Priya, +12 more</p>
          </div>
        </div>
        <div className="bg-[#ECE5DD] px-3 py-3 space-y-2">
          <div className="flex justify-end">
            <div className="bg-[#DCF8C6] rounded-lg rounded-tr-none px-2.5 py-1.5 max-w-[80%]">
              <p className="text-[12px] text-gray-800">Hey everyone! Here's our wedding invitation</p>
              <p className="text-[9px] text-gray-400 text-right mt-0.5">10:32 AM</p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-[#DCF8C6] rounded-lg rounded-tr-none px-2.5 py-1.5 max-w-[80%]">
              <div className="bg-white rounded p-2 mb-1">
                <p className="text-[11px] font-semibold text-[#C85C6C]">Priya & Arjun's Wedding</p>
                <p className="text-[9px] text-gray-400">March 15, 2026 &bull; Kochi, Kerala</p>
                <p className="text-[9px] text-blue-500 mt-0.5">bigdate.events/priya-arjun</p>
              </div>
              <p className="text-[9px] text-gray-400 text-right">10:32 AM</p>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-white rounded-lg rounded-tl-none px-2.5 py-1.5 max-w-[80%]">
              <p className="text-[12px] text-gray-800">This is beautiful! Congrats!</p>
              <p className="text-[9px] text-gray-400 text-right mt-0.5">10:34 AM</p>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-white rounded-lg rounded-tl-none px-2.5 py-1.5 max-w-[80%]">
              <p className="text-[12px] text-gray-800">RSVP done! Can't wait!</p>
              <p className="text-[9px] text-gray-400 text-right mt-0.5">10:35 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Benefit items for "Why Digital" section                             */
/* ------------------------------------------------------------------ */

const benefits = [
  { title: 'More Than a Card or PDF', desc: 'A full website that your guests can revisit anytime — not a disposable piece of paper.' },
  { title: 'Everything in One Link', desc: 'Event details, venue map, photos, RSVP — all in one beautiful, shareable link.' },
  { title: 'Easy for Everyone', desc: 'No app downloads needed. Works on any phone. Even grandparents can open it.' },
  { title: 'Update Anytime, Instantly', desc: 'Venue changed? Time updated? Edit once, and every guest sees the latest.' },
  { title: 'Feels Personal, Not Generic', desc: 'Beautiful designs crafted for Indian celebrations. Feels like you, not a template.' },
  { title: 'Always With Your Guests', desc: 'Lives on their phone — no more "where was the venue again?" messages.' },
  { title: 'Paperless & Thoughtful', desc: 'No paper waste. A small, mindful choice for a greener celebration.' },
  { title: 'Trusted by Thousands', desc: '10,000+ families across India trust us for their most important moments.' },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Component() {
  return (
    <div>

      {/* ═══════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section className="pt-28 pb-14 md:pt-36 md:pb-20">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[2rem] sm:text-4xl md:text-5xl font-bold tracking-tight"
          >
            Make Your Special Moments{' '}
            <span className="italic serif" style={{ color: 'var(--color-primary)' }}>
              Unforgettable
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[15px] text-gray-500 mt-4 mb-8 max-w-md mx-auto"
          >
            Create a stunning digital invitation website in under 5 minutes. No design skills needed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-3"
          >
            <Link to={EVENTS[0].urlPath} className="btn-premium">
              <Sparkles size={16} />
              Create Website
            </Link>
            <span className="text-xs text-gray-400">
              Takes less than 5 minutes &middot; Loved by <strong className="text-gray-600">10,000+</strong> families
            </span>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SOCIAL PROOF + CAROUSEL
      ═══════════════════════════════════════════════════════════════ */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-5xl mx-auto px-5">
          {/* Counter badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-100">
              <motion.span
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-[13px] text-gray-500">
                <strong className="text-gray-800">44,653+</strong> invitations created
              </span>
            </div>
          </div>

          {/* Invitation carousel */}
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 2800, disableOnInteraction: false }}
            spaceBetween={12}
            loop
            breakpoints={{
              0: { slidesPerView: 2, spaceBetween: 8 },
              480: { slidesPerView: 3, spaceBetween: 10 },
              768: { slidesPerView: 4, spaceBetween: 12 },
              1024: { slidesPerView: 5, spaceBetween: 12 },
            }}
          >
            {sampleInvitations.map((inv) => (
              <SwiperSlide key={inv.label}>
                <div className="rounded-xl overflow-hidden aspect-[9/16] relative group cursor-pointer">
                  <img
                    src={inv.image}
                    alt={inv.label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="text-[10px] font-medium text-white bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      {inv.label}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          EVENT CATEGORIES
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-gray-50/80">
        <div className="max-w-5xl mx-auto px-5">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 serif">
              Create for Every Occasion
            </motion.h2>
            <motion.p variants={fadeUp} className="text-center text-gray-500 text-[15px] mb-12">
              Beautiful templates for every celebration.
            </motion.p>

            <motion.div variants={stagger} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {EVENTS.map((ev) => (
                <motion.div key={ev.slug} variants={fadeUp}>
                  <Link
                    to={ev.urlPath}
                    className="block rounded-xl p-4 sm:p-5 text-center bg-white border border-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-px"
                  >
                    <div
                      className="w-10 h-10 rounded-lg mx-auto mb-2.5 flex items-center justify-center text-white text-sm font-semibold"
                      style={{ backgroundColor: ev.accentColor }}
                    >
                      {ev.label.charAt(0)}
                    </div>
                    <h3 className="font-medium text-[13px] sm:text-sm">{ev.label}</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-snug hidden sm:block">{ev.tagline}</p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          HOW IT WORKS — 3 Steps
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-5">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 serif">
              How It Works
            </motion.h2>
            <motion.p variants={fadeUp} className="text-center text-gray-500 text-[15px] mb-14">
              Three simple steps. That's all.
            </motion.p>

            <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
              {[
                { num: '1', icon: <MessageCircle size={22} />, title: 'Chat with our AI', desc: 'Answer a few simple questions about your event.' },
                { num: '2', icon: <Palette size={22} />, title: 'Pick your style', desc: 'Choose from beautiful, ready-made templates.' },
                { num: '3', icon: <Share2 size={22} />, title: 'Share with everyone', desc: 'Send via WhatsApp, SMS, or a personalized link.' },
              ].map((s) => (
                <motion.div key={s.num} variants={fadeUp} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center mx-auto mb-4">
                    {s.icon}
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-primary)] mb-1.5">Step {s.num}</p>
                  <h3 className="font-semibold text-base mb-1.5">{s.title}</h3>
                  <p className="text-[13px] text-gray-500 max-w-[220px] mx-auto">{s.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHATSAPP SHARING — Side by side
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-gray-50/80">
        <div className="max-w-4xl mx-auto px-5">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeUp}>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-primary)] mb-3">No App Needed</p>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 serif leading-snug">
                Share Instantly via WhatsApp
              </h2>
              <p className="text-[15px] text-gray-500 mb-6 leading-relaxed">
                Your guests simply tap the link to view your beautiful invitation. Share to individuals, groups, or broadcast lists.
              </p>
              <ul className="space-y-3">
                {[
                  'One tap sharing to any contact or group',
                  'Beautiful link preview with event details',
                  'Guests RSVP directly from the invitation',
                  'Works on any phone — no app needed',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={10} strokeWidth={3} />
                    </span>
                    <span className="text-[13px] text-gray-500">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={fadeUp}>
              <WhatsAppMockup />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PRINT + DIGITAL BRIDGE — Side by side (reversed)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-5">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            {/* Card + Phone mockup */}
            <motion.div variants={fadeUp} className="order-2 md:order-1 flex justify-center py-6">
              <div className="relative">
                <div className="w-52 h-64 bg-white rounded-xl shadow-md border border-gray-100 p-5 flex flex-col items-center justify-center text-center">
                  <p className="script text-xl text-[var(--color-primary)] mb-1">You're Invited</p>
                  <p className="text-[11px] text-gray-400 mb-5">Priya & Arjun's Wedding</p>
                  <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mb-2">
                    <QrCode size={32} className="text-gray-300" />
                  </div>
                  <p className="text-[8px] text-gray-400 uppercase tracking-widest font-medium">Scan for E-Invite</p>
                </div>
                <div className="absolute -right-5 -bottom-3 w-24 h-40 bg-gray-900 rounded-xl shadow-md flex items-center justify-center p-0.5">
                  <div className="w-full h-full bg-white rounded-[10px] flex flex-col items-center justify-center p-1.5">
                    <Sparkles size={12} className="text-[var(--color-primary)] mb-1" />
                    <p className="text-[6px] font-semibold text-[var(--color-primary)]">Priya & Arjun</p>
                    <p className="text-[5px] text-gray-400">March 15, 2026</p>
                    <div className="w-full h-8 bg-rose-50 rounded mt-1.5" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div variants={fadeUp} className="order-1 md:order-2">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-primary)] mb-3">Best of Both Worlds</p>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 serif leading-snug">
                Bridge Print & Digital
              </h2>
              <p className="text-[15px] text-gray-500 mb-6 leading-relaxed">
                Add a QR code to your printed cards that links directly to your digital invitation. Guests scan to see photos, get directions, and RSVP.
              </p>
              <ul className="space-y-3">
                {[
                  'Auto-generated QR code for your invitation',
                  'Print on physical cards, share digitally too',
                  'Guests access full details instantly',
                  'No more lost or forgotten invites',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={10} strokeWidth={3} />
                    </span>
                    <span className="text-[13px] text-gray-500">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHY DIGITAL — 8 Benefit blocks (accordion-style text cards)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-gray-50/80">
        <div className="max-w-4xl mx-auto px-5">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 serif">
              Why Go Digital?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-center text-gray-500 text-[15px] mb-12">
              Everything a paper invitation does, but better.
            </motion.p>

            <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {benefits.map((b) => (
                <motion.div
                  key={b.title}
                  variants={fadeUp}
                  className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-sm transition-shadow duration-200"
                >
                  <h3 className="font-semibold text-[14px] mb-1">{b.title}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{b.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-5">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 serif">
              Loved by Thousands
            </motion.h2>

            <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Priya & Arjun', event: 'Wedding', city: 'Kochi', quote: 'Our guests loved the website! It was so easy to share all the details. Created in just 3 minutes.' },
                { name: 'Sneha M.', event: 'Birthday', city: 'Mumbai', quote: "Created my daughter's birthday invite in 5 minutes. Absolutely loved the templates and how easy sharing was." },
                { name: 'Rahul K.', event: 'Housewarming', city: 'Bangalore', quote: 'The chatbot made everything simple. No design skills needed. Guests kept complimenting the invite!' },
              ].map((t) => (
                <motion.div key={t.name} variants={fadeUp} className="bg-white rounded-xl p-5 border border-gray-100">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} className="text-amber-400" fill="#fbbf24" />
                    ))}
                  </div>
                  <p className="text-[13px] text-gray-500 leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                  <p className="font-medium text-[13px]">{t.name}</p>
                  <p className="text-[11px] text-gray-400">{t.event} &middot; {t.city}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          STATS BANNER
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-10 md:py-12 bg-[var(--color-primary)]">
        <div className="max-w-3xl mx-auto px-5">
          <div className="grid grid-cols-3 text-center text-white">
            {[
              { value: '10,000+', label: 'Happy Families' },
              { value: '50,000+', label: 'Websites Created' },
              { value: '4.9/5', label: 'User Rating' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold">{s.value}</p>
                <p className="text-[11px] sm:text-xs opacity-70 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PRICING
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-5">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 serif">
              Simple Pricing
            </motion.h2>
            <motion.p variants={fadeUp} className="text-center text-gray-500 text-[15px] mb-3">
              Preview free. Pay only to activate your shareable link.
            </motion.p>
            <motion.div variants={fadeUp} className="text-center mb-10">
              <span className="text-[11px] text-gray-400">
                Secure payment &middot; Instant activation &middot; No hidden fees
              </span>
            </motion.div>

            <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PRICING_PLANS.map((plan) => (
                <motion.div
                  key={plan.id}
                  variants={fadeUp}
                  className={`bg-white rounded-xl p-5 sm:p-6 text-center relative border-2 transition-all duration-200 ${
                    plan.preferred
                      ? 'border-[var(--color-primary)] sm:scale-[1.03]'
                      : 'border-gray-100'
                  }`}
                >
                  {plan.preferred && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[var(--color-primary)] text-white text-[9px] font-semibold uppercase tracking-wider px-3 py-0.5 rounded-full whitespace-nowrap">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-medium text-sm mb-1.5 mt-1">{plan.label}</h3>
                  <p className="text-3xl font-bold text-[var(--color-primary)] mb-0.5">
                    <span className="text-sm align-top mr-0.5">₹</span>{plan.price}
                  </p>
                  <p className="text-[11px] text-gray-400 mb-5">{plan.duration} days</p>
                  <Link
                    to={EVENTS[0].urlPath}
                    className={`block w-full py-2.5 rounded-full text-[13px] font-medium transition-all ${
                      plan.preferred
                        ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]'
                        : 'border border-gray-200 text-gray-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                    }`}
                  >
                    Get Started
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-gray-50/80">
        <div className="max-w-xl mx-auto px-5 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 serif">
              Turn Your Celebration Into a Beautiful Memory
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 text-[15px] mb-8">
              Start creating your beautiful invitation now. It only takes a few minutes.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link to={EVENTS[0].urlPath} className="btn-premium">
                <Sparkles size={16} />
                Create Your Invitation
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PROMO BANNER
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-3 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-5 flex items-center justify-center gap-3 flex-wrap">
          <span className="text-[12px] text-gray-400">
            <Zap size={12} className="inline mr-0.5 text-amber-400" />
            New user? Get <strong className="text-white">10% OFF</strong> with code
          </span>
          <span className="bg-white/10 px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider">
            SAVE10
          </span>
          <Link to="/pricing" className="text-[var(--color-primary-light)] hover:text-white text-[11px] font-medium underline underline-offset-2">
            Apply Now →
          </Link>
        </div>
      </section>
    </div>
  );
}
