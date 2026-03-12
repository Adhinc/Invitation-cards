import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail, MessageCircle, MapPin, Camera, ClipboardList, Music,
  Clock, Smartphone, CreditCard, Sparkles, ArrowRight, Check, X,
  QrCode, Send, Leaf, Star, Users, Heart, Gift, Zap, Tag,
} from 'lucide-react';
import { getEventBySlug, PRICING_PLANS, type EventConfig } from '../constants/events';

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={stagger}
      className={`max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 ${className}`}
    >
      {children}
    </motion.section>
  );
}

function SectionTitle({ children, sub, color }: { children: React.ReactNode; sub?: string; color: string }) {
  return (
    <motion.div variants={fadeUp} className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{children}</h2>
      {sub && <p className="mt-3 text-gray-500 text-lg max-w-2xl mx-auto">{sub}</p>}
      <div className="mt-4 mx-auto w-16 h-1 rounded-full" style={{ background: color }} />
    </motion.div>
  );
}

function sampleNames(event: EventConfig) {
  if (event.isCoupleEvent) return { name1: 'Maneesh', name2: 'Menak' };
  if (event.type === 'birthday') return { name1: 'Little Arya', name2: '' };
  if (event.type === 'baby_shower') return { name1: 'Priya', name2: '' };
  if (event.type === 'housewarming') return { name1: 'The Sharma Family', name2: '' };
  return { name1: 'Baby Joel', name2: '' };
}

/* ------------------------------------------------------------------ */
/*  1. Hero Section                                                   */
/* ------------------------------------------------------------------ */

function HeroSection({ event }: { event: EventConfig }) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: `linear-gradient(to bottom, ${event.accentColor}20, transparent)` }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-600 mb-6">
            <Star className="w-4 h-4" style={{ color: event.accentColor }} />
            {event.socialProof}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight"
        >
          {event.heroTitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-5 text-lg md:text-xl text-gray-500 max-w-xl mx-auto"
        >
          {event.tagline}. Beautiful digital invitations your guests will love.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Link
            to={`/chatbot?event=${event.type}`}
            className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-full text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            style={{ background: event.accentColor }}
          >
            Start Now <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-400"
        >
          {[
            { icon: <Clock className="w-4 h-4" />, text: '2 Min Setup' },
            { icon: <Smartphone className="w-4 h-4" />, text: 'Mobile Ready' },
            { icon: <CreditCard className="w-4 h-4" />, text: 'No credit card required' },
          ].map((b) => (
            <span key={b.text} className="inline-flex items-center gap-1.5 bg-white/60 backdrop-blur rounded-full px-3 py-1 border border-gray-100">
              {b.icon} {b.text}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  2. QR Invitation Mockup                                           */
/* ------------------------------------------------------------------ */

function QRMockupSection({ event }: { event: EventConfig }) {
  const { name1, name2 } = sampleNames(event);
  const displayName = event.isCoupleEvent ? `${name1} & ${name2}` : name1;

  return (
    <Section>
      <SectionTitle color={event.accentColor} sub="A sneak peek of how your invitation will look">
        Your Invitation, Reimagined
      </SectionTitle>
      <motion.div variants={fadeUp} className="flex justify-center">
        <div
          className="relative w-80 rounded-2xl shadow-2xl overflow-hidden border"
          style={{ borderColor: `${event.accentColor}40` }}
        >
          {/* Top accent bar */}
          <div className="h-2" style={{ background: event.accentColor }} />
          <div className="p-8 text-center bg-white">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">{event.tagline}</p>
            <h3 className="text-2xl font-bold text-gray-900">{displayName}</h3>
            <p className="text-sm text-gray-500 mt-1">{event.subtitle}</p>

            <div className="my-6 flex justify-center">
              <div
                className="w-28 h-28 rounded-xl flex items-center justify-center"
                style={{ background: `${event.accentColor}15` }}
              >
                <QrCode className="w-16 h-16" style={{ color: event.accentColor }} />
              </div>
            </div>

            <p className="text-lg font-semibold text-gray-800">14 Feb 2026</p>
            <p className="text-sm text-gray-400 mt-1">Saturday, 6:00 PM</p>

            <div className="mt-6 pt-4 border-t border-dashed border-gray-200">
              <p className="text-xs text-gray-400">Scan to RSVP & view details</p>
            </div>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  3. WhatsApp Sharing Demo                                          */
/* ------------------------------------------------------------------ */

function WhatsAppSection({ event }: { event: EventConfig }) {
  const { name1, name2 } = sampleNames(event);
  const displayName = event.isCoupleEvent ? `${name1} & ${name2}` : name1;

  return (
    <Section className="bg-gray-50 rounded-3xl">
      <SectionTitle color={event.accentColor} sub="Share via WhatsApp with a single tap">
        Easy WhatsApp Sharing
      </SectionTitle>
      <motion.div variants={fadeUp} className="flex justify-center">
        <div className="w-80 bg-[#e5ddd5] rounded-2xl p-4 shadow-lg space-y-3">
          {/* Outgoing bubble */}
          <div className="flex justify-end">
            <div className="bg-[#dcf8c6] rounded-xl rounded-tr-sm px-4 py-2 max-w-[85%] shadow-sm">
              <p className="text-sm text-gray-800">
                Hey! You&apos;re invited to {displayName}&apos;s {event.label}! 🎉
              </p>
              <p className="text-[10px] text-gray-400 text-right mt-1">10:42 AM ✓✓</p>
            </div>
          </div>

          {/* Link preview bubble */}
          <div className="flex justify-end">
            <div className="bg-[#dcf8c6] rounded-xl rounded-tr-sm max-w-[85%] shadow-sm overflow-hidden">
              <div className="p-3" style={{ background: `${event.accentColor}18` }}>
                <p className="text-xs font-semibold" style={{ color: event.accentColor }}>bigdates.in</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">{displayName}&apos;s {event.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">14 Feb 2026 | View invitation & RSVP</p>
              </div>
              <div className="px-4 py-2">
                <p className="text-xs text-blue-600 underline">bigdates.in/invite/m-and-m</p>
                <p className="text-[10px] text-gray-400 text-right mt-1">10:42 AM ✓✓</p>
              </div>
            </div>
          </div>

          {/* Incoming reply */}
          <div className="flex justify-start">
            <div className="bg-white rounded-xl rounded-tl-sm px-4 py-2 max-w-[85%] shadow-sm">
              <p className="text-sm text-gray-800">Wow, this looks amazing! 😍 RSVPed!</p>
              <p className="text-[10px] text-gray-400 text-right mt-1">10:44 AM</p>
            </div>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  4. Paper vs Digital                                               */
/* ------------------------------------------------------------------ */

function PaperVsDigitalSection({ event }: { event: EventConfig }) {
  const rows = [
    { label: 'Delivery Speed', paper: 'Days', digital: 'Instant' },
    { label: 'Cost', paper: '₹5,000+', digital: 'From ₹49' },
    { label: 'RSVP Tracking', paper: false, digital: true },
    { label: 'Eco Friendly', paper: false, digital: true },
    { label: 'Edit Anytime', paper: false, digital: true },
    { label: 'WhatsApp Share', paper: false, digital: true },
  ];

  return (
    <Section>
      <SectionTitle color={event.accentColor} sub="One small choice today. A greener tomorrow.">
        Paper vs Digital
      </SectionTitle>
      <motion.div variants={fadeUp} className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="grid grid-cols-3 text-center text-sm font-semibold border-b border-gray-100">
          <div className="py-3" />
          <div className="py-3 text-gray-400">Paper</div>
          <div className="py-3 text-white" style={{ background: event.accentColor }}>Digital</div>
        </div>
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-3 text-center text-sm border-b border-gray-50 last:border-0">
            <div className="py-3 text-left pl-4 text-gray-600">{r.label}</div>
            <div className="py-3 flex items-center justify-center">
              {typeof r.paper === 'string' ? (
                <span className="text-gray-400">{r.paper}</span>
              ) : r.paper ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-red-400" />
              )}
            </div>
            <div className="py-3 flex items-center justify-center">
              {typeof r.digital === 'string' ? (
                <span className="font-medium" style={{ color: event.accentColor }}>{r.digital}</span>
              ) : r.digital ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-red-400" />
              )}
            </div>
          </div>
        ))}
      </motion.div>
      <motion.div variants={fadeUp} className="mt-6 text-center">
        <span className="inline-flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-full px-4 py-1.5">
          <Leaf className="w-4 h-4" /> Save trees, share love digitally
        </span>
      </motion.div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  5. Feature Highlights                                             */
/* ------------------------------------------------------------------ */

const FEATURES = [
  { icon: Mail, title: 'Digital Invitations', desc: 'Beautifully designed templates you can personalize in minutes.' },
  { icon: MessageCircle, title: 'WhatsApp Sharing', desc: 'Share your invitation via WhatsApp with a single tap.' },
  { icon: MapPin, title: 'Google Maps', desc: 'Help your guests find the venue effortlessly.' },
  { icon: Camera, title: 'Photo Gallery', desc: 'Let guests upload & view event photos in one place.' },
  { icon: ClipboardList, title: 'RSVP Management', desc: 'Track guest responses and meal preferences easily.' },
  { icon: Music, title: 'Background Music', desc: 'Set the mood with your favourite song on the invite.' },
];

function FeaturesSection({ event }: { event: EventConfig }) {
  return (
    <Section className="bg-gray-50 rounded-3xl">
      <SectionTitle color={event.accentColor} sub="Everything you need for the perfect invitation">
        Features You&apos;ll Love
      </SectionTitle>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((f) => (
          <motion.div
            key={f.title}
            variants={fadeUp}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: `${event.accentColor}18` }}
            >
              <f.icon className="w-6 h-6" style={{ color: event.accentColor }} />
            </div>
            <h3 className="font-semibold text-gray-900 text-lg">{f.title}</h3>
            <p className="text-gray-500 text-sm mt-1">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  6. How It Works                                                   */
/* ------------------------------------------------------------------ */

const STEPS = [
  { icon: MessageCircle, title: 'Start Chat', desc: 'Open our friendly chatbot and pick your event type.' },
  { icon: Send, title: 'Share Details', desc: 'Tell us names, date, venue and upload photos.' },
  { icon: Sparkles, title: 'Choose Design', desc: 'Pick from stunning templates styled for your event.' },
  { icon: Heart, title: 'Share & Celebrate', desc: 'Send the link via WhatsApp and start the party!' },
];

function HowItWorksSection({ event }: { event: EventConfig }) {
  return (
    <Section>
      <SectionTitle color={event.accentColor} sub="From start to share in under 2 minutes">
        How It Works
      </SectionTitle>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {STEPS.map((s, i) => (
          <motion.div key={s.title} variants={fadeUp} className="text-center">
            <div className="relative inline-flex">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ background: `${event.accentColor}18` }}
              >
                <s.icon className="w-7 h-7" style={{ color: event.accentColor }} />
              </div>
              <span
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                style={{ background: event.accentColor }}
              >
                {i + 1}
              </span>
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">{s.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  7. Testimonials                                                   */
/* ------------------------------------------------------------------ */

function getTestimonials(event: EventConfig) {
  const base: { name: string; text: string; role: string }[] = [];
  if (event.isCoupleEvent) {
    base.push(
      { name: 'Ananya & Rohit', role: 'Wedding, Kerala', text: 'Our guests were blown away! The WhatsApp sharing made things so easy. We saved so much money compared to paper invites.' },
      { name: 'Sneha & Varun', role: 'Engagement, Delhi', text: 'Such a smooth experience. The chatbot asked us exactly the right questions and the template was stunning.' },
      { name: 'Meera & Arjun', role: 'Reception, Mumbai', text: 'RSVP tracking alone was worth it. We knew exactly how many people were coming. Highly recommend!' },
    );
  } else {
    base.push(
      { name: 'Priya Menon', role: `${event.label}, Kochi`, text: `The invitation for our ${event.label.toLowerCase()} was absolutely beautiful. Guests kept asking how we made it!` },
      { name: 'Ravi Kumar', role: `${event.label}, Bangalore`, text: 'Super easy to set up and share. The QR code feature is genius. Everyone loved it.' },
      { name: 'Deepa Thomas', role: `${event.label}, Chennai`, text: 'From start to finish it took us barely 2 minutes. The design was elegant and professional.' },
    );
  }
  return base;
}

function TestimonialsSection({ event }: { event: EventConfig }) {
  const testimonials = getTestimonials(event);
  return (
    <Section className="bg-gray-50 rounded-3xl">
      <SectionTitle color={event.accentColor} sub="Hear from people who loved it">
        What Our Users Say
      </SectionTitle>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <motion.div key={t.name} variants={fadeUp} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="font-semibold text-sm text-gray-900">{t.name}</p>
              <p className="text-xs text-gray-400">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  8. Stats Bar                                                      */
/* ------------------------------------------------------------------ */

function StatsBar({ event }: { event: EventConfig }) {
  const stats = [
    { icon: Tag, value: '₹49', label: 'Starting price' },
    { icon: Gift, value: '500+', label: 'Templates' },
    { icon: Users, value: '50 Lakh+', label: 'Guests reached' },
  ];

  return (
    <section
      className="py-12"
      style={{ background: `linear-gradient(135deg, ${event.accentColor}15, ${event.accentColor}08)` }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={fadeUp} className="text-center">
              <s.icon className="w-6 h-6 mx-auto mb-2" style={{ color: event.accentColor }} />
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  9. Pricing Cards                                                  */
/* ------------------------------------------------------------------ */

function PricingSection({ event }: { event: EventConfig }) {
  return (
    <Section>
      <SectionTitle color={event.accentColor} sub="Simple, transparent pricing">
        Choose Your Plan
      </SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
        {PRICING_PLANS.map((plan) => (
          <motion.div
            key={plan.id}
            variants={fadeUp}
            className={`relative rounded-2xl p-6 text-center border transition-shadow hover:shadow-lg ${
              plan.preferred
                ? 'border-2 shadow-lg scale-105'
                : 'border-gray-200 bg-white'
            }`}
            style={plan.preferred ? { borderColor: event.accentColor, background: `${event.accentColor}08` } : {}}
          >
            {plan.preferred && (
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-white px-3 py-1 rounded-full"
                style={{ background: event.accentColor }}
              >
                Most Popular
              </span>
            )}
            <h3 className="text-lg font-semibold text-gray-900 mt-2">{plan.label}</h3>
            <div className="mt-3">
              <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{plan.duration} days</p>
            <Link
              to={`/chatbot?event=${event.type}&plan=${plan.id}`}
              className="mt-6 block w-full py-2.5 rounded-full font-semibold text-sm transition-colors"
              style={
                plan.preferred
                  ? { background: event.accentColor, color: '#fff' }
                  : { background: `${event.accentColor}15`, color: event.accentColor }
              }
            >
              Get Started
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  10. Limited Time Offer Banner                                     */
/* ------------------------------------------------------------------ */

function OfferBanner({ event }: { event: EventConfig }) {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden p-8 md:p-12 text-center text-white"
        style={{ background: `linear-gradient(135deg, ${event.accentColor}, ${event.accentColor}cc)` }}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white_0%,transparent_70%)]" />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Zap className="w-4 h-4" /> Limited Time Offer
          </span>
          <h3 className="text-2xl md:text-3xl font-bold">Premium features &mdash; 10% off for early birds</h3>
          <div className="mt-4 flex justify-center gap-2 md:gap-3 text-2xl md:text-3xl font-mono font-bold">
            {['03', '12', '45', '22'].map((v, i) => (
              <span key={i} className="inline-flex flex-col items-center">
                <span className="bg-white/20 backdrop-blur rounded-lg px-2 py-1.5 md:px-3 md:py-2">{v}</span>
                <span className="text-[10px] mt-1 font-sans font-normal opacity-80">
                  {['Days', 'Hrs', 'Min', 'Sec'][i]}
                </span>
              </span>
            ))}
          </div>
          <p className="mt-5 text-lg">
            Use Code: <span className="font-bold bg-white/20 px-3 py-1 rounded-lg">SAVE10</span>
          </p>
          <Link
            to={`/chatbot?event=${event.type}&promo=SAVE10`}
            className="inline-flex items-center gap-2 mt-6 bg-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
            style={{ color: event.accentColor }}
          >
            Apply Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  11. Final CTA                                                     */
/* ------------------------------------------------------------------ */

function FinalCTA({ event }: { event: EventConfig }) {
  return (
    <Section className="text-center">
      <motion.div variants={fadeUp}>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Ready to Get Started?</h2>
        <p className="mt-3 text-gray-500 text-lg max-w-lg mx-auto">
          Create your beautiful {event.label.toLowerCase()} invitation in under 2 minutes.
        </p>
        <Link
          to={`/chatbot?event=${event.type}`}
          className="inline-flex items-center gap-2 mt-8 px-10 py-4 rounded-full text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
          style={{ background: event.accentColor }}
        >
          Start Creating Now <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="mt-4 text-sm text-gray-400">Free to try. No credit card needed.</p>
      </motion.div>
    </Section>
  );
}

/* ================================================================== */
/*  Page Component                                                    */
/* ================================================================== */

export function Component() {
  const { eventSlug } = useParams();
  const event = getEventBySlug(eventSlug || '');

  if (!event) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-white">
      <HeroSection event={event} />
      <QRMockupSection event={event} />
      <WhatsAppSection event={event} />
      <PaperVsDigitalSection event={event} />
      <FeaturesSection event={event} />
      <HowItWorksSection event={event} />
      <TestimonialsSection event={event} />
      <StatsBar event={event} />
      <PricingSection event={event} />
      <OfferBanner event={event} />
      <FinalCTA event={event} />
    </div>
  );
}
