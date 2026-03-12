import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import {
  Heart,
  MessageCircle,
  Palette,
  Share2,
  MapPin,
  Camera,
  CalendarCheck,
  Music,
  Send,
  Check,
  X,
  Star,
  Sparkles,
  Zap,
} from 'lucide-react';
import { EVENTS, PRICING_PLANS } from '../constants/events';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const sectionPadding = 'py-20 md:py-28';
const container = 'max-w-7xl mx-auto px-4 md:px-8';
const sectionTitle =
  'text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 serif';
const sectionSub = 'text-center text-[var(--text-secondary)] max-w-2xl mx-auto mb-14 text-lg';

/* ------------------------------------------------------------------ */
/*  Floating petals                                                    */
/* ------------------------------------------------------------------ */

function FloatingPetals() {
  const petals = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 8,
    duration: 10 + Math.random() * 10,
    size: 8 + Math.random() * 14,
    opacity: 0.15 + Math.random() * 0.2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: p.left, top: '-20px', opacity: p.opacity }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, Math.random() > 0.5 ? 40 : -40, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Heart
            size={p.size}
            className="text-[var(--primary-rose)]"
            fill="currentColor"
          />
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sample invitation data                                             */
/* ------------------------------------------------------------------ */

const sampleInvitations = [
  {
    couple: 'Anjali & Rohit',
    date: 'March 15, 2026',
    location: 'Kochi, Kerala',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=500&fit=crop',
    color: '#C85C6C',
  },
  {
    couple: 'Sneha & Aditya',
    date: 'April 22, 2026',
    location: 'Jaipur, Rajasthan',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=500&fit=crop',
    color: '#c084fc',
  },
  {
    couple: 'Divya & Karthik',
    date: 'May 10, 2026',
    location: 'Chennai, Tamil Nadu',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=500&fit=crop',
    color: '#D4AF37',
  },
  {
    couple: 'Pooja & Arjun',
    date: 'June 5, 2026',
    location: 'Udaipur, Rajasthan',
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=500&fit=crop',
    color: '#f97316',
  },
  {
    couple: 'Neha & Sameer',
    date: 'July 18, 2026',
    location: 'Mumbai, Maharashtra',
    image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=500&fit=crop',
    color: '#57aa53',
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Component() {
  return (
    <div className="relative">
      {/* ==================== HERO ==================== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <FloatingPetals />

        <div className={`${container} relative z-10 text-center`}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col items-center gap-6"
          >
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight"
            >
              Make Your Special Moments{' '}
              <span
                className="italic serif"
                style={{ color: 'var(--primary-rose)' }}
              >
                Unforgettable
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-[var(--text-secondary)] max-w-xl"
            >
              Create a stunning digital invitation in under 5 minutes
            </motion.p>

            <motion.div variants={fadeUp}>
              <Link to={EVENTS[0].urlPath} className="btn-premium">
                <Sparkles size={18} />
                Create Website
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap justify-center gap-8 md:gap-14 mt-8"
            >
              {[
                { value: '10,000+', label: 'Families' },
                { value: '12,847+', label: 'Invitations' },
                { value: '50 Lakh+', label: 'Guests Reached' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-[var(--primary-rose)]">
                    {s.value}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ==================== SAMPLE CAROUSEL ==================== */}
      <section className={sectionPadding}>
        <div className={container}>
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            spaceBetween={24}
            loop
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {sampleInvitations.map((inv) => (
              <SwiperSlide key={inv.couple}>
                <div
                  className="glass-card p-6 flex flex-col items-center gap-4"
                  style={{ borderTop: `4px solid ${inv.color}` }}
                >
                  <div className="w-full h-56 rounded-2xl overflow-hidden">
                    <img
                      src={inv.image}
                      alt={inv.couple}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <p className="script text-2xl" style={{ color: inv.color }}>
                    {inv.couple}
                  </p>
                  <p className="text-[var(--text-secondary)] text-sm">
                    {inv.date} &middot; {inv.location}
                  </p>
                  <span
                    className="text-xs uppercase tracking-widest font-semibold"
                    style={{ color: inv.color }}
                  >
                    View Invitation
                  </span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ==================== EVENT CATEGORIES ==================== */}
      <section className={sectionPadding} style={{ background: 'var(--accent-soft)' }}>
        <div className={container}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className={sectionTitle}>
              Your Moment, Your Invitation
            </motion.h2>
            <motion.p variants={fadeUp} className={sectionSub}>
              From weddings to housewarmings, we have the perfect template for every celebration.
            </motion.p>

            <motion.div
              variants={stagger}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            >
              {EVENTS.map((ev) => (
                <motion.div key={ev.slug} variants={fadeUp}>
                  <Link
                    to={ev.urlPath}
                    className="block rounded-3xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    style={{ backgroundColor: ev.accentColor + '22' }}
                  >
                    <div
                      className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold"
                      style={{ backgroundColor: ev.accentColor }}
                    >
                      {ev.label.charAt(0)}
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{ev.label}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{ev.tagline}</p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className={sectionPadding}>
        <div className={container}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className={sectionTitle}>
              How It Works
            </motion.h2>
            <motion.p variants={fadeUp} className={sectionSub}>
              Creating your perfect invitation is as easy as chatting with a friend.
            </motion.p>

            <div className="relative">
              {/* Dotted connector line — desktop only */}
              <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-[var(--primary-rose-light)]" />

              <motion.div
                variants={stagger}
                className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 relative z-10"
              >
                {[
                  {
                    num: 1,
                    icon: <MessageCircle size={28} />,
                    title: 'Start Chat',
                    desc: 'Chat with our friendly AI',
                  },
                  {
                    num: 2,
                    icon: <Heart size={28} />,
                    title: 'Share Details',
                    desc: 'Tell us about your event',
                  },
                  {
                    num: 3,
                    icon: <Palette size={28} />,
                    title: 'Choose Design',
                    desc: 'Pick a beautiful template',
                  },
                  {
                    num: 4,
                    icon: <Share2 size={28} />,
                    title: 'Share & Celebrate',
                    desc: 'Send via WhatsApp, SMS, or link',
                  },
                ].map((step) => (
                  <motion.div
                    key={step.num}
                    variants={fadeUp}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-[var(--primary-rose)] text-white flex items-center justify-center text-lg font-bold mb-4 shadow-lg">
                      {step.num}
                    </div>
                    <div className="text-[var(--primary-rose)] mb-2">{step.icon}</div>
                    <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] max-w-[200px]">
                      {step.desc}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className={sectionPadding} style={{ background: 'var(--accent-soft)' }}>
        <div className={container}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className={sectionTitle}>
              Everything You Need
            </motion.h2>
            <motion.p variants={fadeUp} className={sectionSub}>
              All the features to make your invitation truly special.
            </motion.p>

            <motion.div
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[
                {
                  icon: <Sparkles size={28} />,
                  title: 'Beautiful Digital Invitations',
                  desc: 'Stunning templates designed for every Indian celebration, crafted with love.',
                },
                {
                  icon: <Send size={28} />,
                  title: 'Share Instantly via WhatsApp',
                  desc: 'One tap to share with all your guests through WhatsApp, SMS, or a link.',
                },
                {
                  icon: <MapPin size={28} />,
                  title: 'Google Maps Integration',
                  desc: 'Help your guests find the venue easily with embedded directions.',
                },
                {
                  icon: <Camera size={28} />,
                  title: 'Photo Gallery & Memories',
                  desc: 'Showcase your best moments with a beautiful photo gallery section.',
                },
                {
                  icon: <CalendarCheck size={28} />,
                  title: 'Event Schedule & RSVP',
                  desc: 'Keep everyone informed with a timeline and collect RSVPs effortlessly.',
                },
                {
                  icon: <Music size={28} />,
                  title: 'Background Music',
                  desc: 'Set the mood with background music that plays when guests open your invite.',
                },
              ].map((f) => (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  className="glass-card p-8 hover:scale-[1.03] transition-transform"
                >
                  <div className="text-[var(--primary-rose)] mb-4">{f.icon}</div>
                  <h3 className="font-semibold text-xl mb-2">{f.title}</h3>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ==================== PAPER VS DIGITAL ==================== */}
      <section className={sectionPadding}>
        <div className={container}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className={sectionTitle}>
              Why Go Digital?
            </motion.h2>
            <motion.p variants={fadeUp} className={sectionSub}>
              One small choice today. A greener tomorrow.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="max-w-3xl mx-auto glass-card overflow-hidden"
              style={{ borderLeft: '4px solid #22c55e' }}
            >
              <div className="grid grid-cols-3 text-center font-semibold p-4 border-b border-gray-100">
                <span>Feature</span>
                <span>Paper</span>
                <span className="text-green-600">Digital</span>
              </div>
              {[
                { feature: 'Cost', paper: false, digital: true, pLabel: 'Expensive', dLabel: 'Affordable' },
                { feature: 'Delivery Speed', paper: false, digital: true, pLabel: 'Days/Weeks', dLabel: 'Instant' },
                { feature: 'Eco-Friendly', paper: false, digital: true, pLabel: 'Wasteful', dLabel: 'Zero Waste' },
                { feature: 'Easy Sharing', paper: false, digital: true, pLabel: 'Manual', dLabel: 'One Tap' },
                { feature: 'RSVP Tracking', paper: false, digital: true, pLabel: 'No', dLabel: 'Built-in' },
                { feature: 'Updates & Edits', paper: false, digital: true, pLabel: 'Reprint', dLabel: 'Real-time' },
              ].map((row, i) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-3 text-center p-4 text-sm ${
                    i % 2 === 0 ? 'bg-white/50' : ''
                  }`}
                >
                  <span className="font-medium">{row.feature}</span>
                  <span className="flex items-center justify-center gap-1 text-red-400">
                    <X size={16} /> {row.pLabel}
                  </span>
                  <span className="flex items-center justify-center gap-1 text-green-600">
                    <Check size={16} /> {row.dLabel}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className={sectionPadding} style={{ background: 'var(--accent-soft)' }}>
        <div className={container}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className={sectionTitle}>
              Loved by Thousands
            </motion.h2>
            <motion.p variants={fadeUp} className={sectionSub}>
              Hear from couples and families who trusted BigDates.
            </motion.p>

            <motion.div
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                {
                  initials: 'PR',
                  name: 'Priya & Rahul',
                  city: 'Kochi',
                  quote:
                    'Created our wedding website in 3 minutes! The templates are gorgeous.',
                },
                {
                  initials: 'AV',
                  name: 'Ananya & Vikram',
                  city: 'Mumbai',
                  quote:
                    'So easy to use. Our guests loved the digital invite.',
                },
                {
                  initials: 'MA',
                  name: 'Meera & Arjun',
                  city: 'Bangalore',
                  quote:
                    'Best investment for our wedding. WhatsApp sharing was a game changer.',
                },
              ].map((t) => (
                <motion.div key={t.name} variants={fadeUp} className="glass-card p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--primary-rose)] text-white flex items-center justify-center font-bold text-sm">
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{t.city}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="text-[var(--accent-gold)]"
                        fill="var(--accent-gold)"
                      />
                    ))}
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ==================== URGENCY BANNER ==================== */}
      <section
        className="py-6"
        style={{ background: 'linear-gradient(135deg, var(--primary-rose), #B04A59)' }}
      >
        <div className={`${container} flex items-center justify-center gap-3 text-white`}>
          <motion.span
            className="w-3 h-3 rounded-full bg-white"
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <p className="text-sm md:text-base font-medium">
            <Zap size={16} className="inline mr-1" />
            <strong>137 people</strong> created their invitation in the last 24 hours
          </p>
        </div>
      </section>

      {/* ==================== PRICING ==================== */}
      <section className={sectionPadding}>
        <div className={container}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className={sectionTitle}>
              Simple Pricing
            </motion.h2>
            <motion.p variants={fadeUp} className={sectionSub}>
              No hidden fees. Pick a plan that works for your celebration.
            </motion.p>

            <motion.div
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              {PRICING_PLANS.map((plan) => (
                <motion.div
                  key={plan.id}
                  variants={fadeUp}
                  className={`glass-card p-8 text-center relative ${
                    plan.preferred
                      ? 'scale-105 border-2 border-[var(--primary-rose)]'
                      : ''
                  }`}
                >
                  {plan.preferred && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--primary-rose)] text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-semibold text-xl mb-2 mt-2">{plan.label}</h3>
                  <p className="text-4xl font-bold text-[var(--primary-rose)] mb-1">
                    <span className="text-lg align-top">&#8377;</span>
                    {plan.price}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] mb-6">
                    {plan.duration} days access
                  </p>
                  <Link
                    to={EVENTS[0].urlPath}
                    className={`inline-block w-full py-3 rounded-full font-semibold text-sm uppercase tracking-wider transition-all ${
                      plan.preferred
                        ? 'btn-premium'
                        : 'border-2 border-[var(--primary-rose)] text-[var(--primary-rose)] hover:bg-[var(--primary-rose)] hover:text-white'
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
    </div>
  );
}
