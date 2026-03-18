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
  QrCode,
} from 'lucide-react';
import { EVENTS, PRICING_PLANS } from '../constants/events';
import { fadeUp, stagger } from '../utils/animations';
import {
  Button,
  Card,
  Badge,
  Section,
  SectionTitle,
  CheckList,
  FeatureRow,
} from '../components/ui';
import { cn } from '../utils/cn';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const sampleInvitations = [
  { label: 'Wedding', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=520&fit=crop' },
  { label: 'Birthday', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&h=520&fit=crop' },
  { label: 'Baptism', image: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=300&h=520&fit=crop' },
  { label: 'Baby Shower', image: 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=300&h=520&fit=crop' },
  { label: 'Housewarming', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=520&fit=crop' },
  { label: 'Holy Communion', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=520&fit=crop' },
];

const steps = [
  { num: '1', icon: <MessageCircle size={22} />, title: 'Chat with our AI', desc: 'Answer a few simple questions about your event.' },
  { num: '2', icon: <Palette size={22} />, title: 'Pick your style', desc: 'Choose from beautiful, ready-made templates.' },
  { num: '3', icon: <Share2 size={22} />, title: 'Share with everyone', desc: 'Send via WhatsApp, SMS, or a personalized link.' },
];

const benefits = [
  { title: 'More Than a Card or PDF', desc: 'A full website that your guests can revisit anytime — not a disposable piece of paper.' },
  { title: 'Everything in One Link', desc: 'Event details, venue map, photos, RSVP — all in one beautiful, shareable link.' },
  { title: 'Easy for Everyone', desc: 'No app downloads needed. Works on any phone. Even grandparents can open it.' },
  { title: 'Feels Personal, Not Generic', desc: 'Beautiful designs crafted for Indian celebrations. Feels like you, not a template.' },
  { title: 'Always With Your Guests', desc: 'Lives on their phone — no more "where was the venue again?" messages.' },
  { title: 'Trusted by Thousands', desc: '10,000+ families across India trust us for their most important moments.' },
];

const testimonials = [
  { name: 'Priya & Arjun', event: 'Wedding', city: 'Kochi', quote: 'Our guests loved the website! It was so easy to share all the details. Created in just 3 minutes.' },
  { name: 'Sneha M.', event: 'Birthday', city: 'Mumbai', quote: "Created my daughter's birthday invite in 5 minutes. Absolutely loved the templates and how easy sharing was." },
  { name: 'Rahul K.', event: 'Housewarming', city: 'Bangalore', quote: 'The chatbot made everything simple. No design skills needed. Guests kept complimenting the invite!' },
];

const stats = [
  { value: '10,000+', label: 'Happy Families' },
  { value: '50,000+', label: 'Websites Created' },
  { value: '4.9/5', label: 'User Rating' },
];

/** Show only 1M, 3M, 1Y plans */
const visiblePlans = PRICING_PLANS.filter(
  (p) => p.id === '1month' || p.id === '3months' || p.id === '1year',
);

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
            <p className="text-sm font-medium">Family Group</p>
            <p className="text-xs opacity-60">Mom, Dad, Priya, +12 more</p>
          </div>
        </div>
        <div className="bg-[#ECE5DD] px-3 py-3 space-y-2">
          <div className="flex justify-end">
            <div className="bg-[#DCF8C6] rounded-lg rounded-tr-none px-2.5 py-1.5 max-w-[80%]">
              <p className="text-xs text-gray-800">Hey everyone! Here's our wedding invitation</p>
              <p className="text-[9px] text-gray-400 text-right mt-0.5">10:32 AM</p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-[#DCF8C6] rounded-lg rounded-tr-none px-2.5 py-1.5 max-w-[80%]">
              <div className="bg-white rounded p-2 mb-1">
                <p className="text-xs font-semibold text-gray-900">Priya & Arjun's Wedding</p>
                <p className="text-[9px] text-gray-400">March 15, 2026 &bull; Kochi, Kerala</p>
                <p className="text-[9px] text-blue-500 mt-0.5">invitation.ai/priya-arjun</p>
              </div>
              <p className="text-[9px] text-gray-400 text-right">10:32 AM</p>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-white rounded-lg rounded-tl-none px-2.5 py-1.5 max-w-[80%]">
              <p className="text-xs text-gray-800">This is beautiful! Congrats!</p>
              <p className="text-[9px] text-gray-400 text-right mt-0.5">10:34 AM</p>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-white rounded-lg rounded-tl-none px-2.5 py-1.5 max-w-[80%]">
              <p className="text-xs text-gray-800">RSVP done! Can't wait!</p>
              <p className="text-[9px] text-gray-400 text-right mt-0.5">10:35 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  QR Card + Phone Mockup                                             */
/* ------------------------------------------------------------------ */

function QRMockup() {
  return (
    <div className="relative py-6">
      <div className="w-52 h-64 bg-white rounded-xl shadow-md border border-gray-100 p-5 flex flex-col items-center justify-center text-center">
        <p className="script text-xl text-gray-900 mb-1">You're Invited</p>
        <p className="text-xs text-gray-400 mb-5">Priya & Arjun's Wedding</p>
        <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mb-2">
          <QrCode size={32} className="text-gray-300" />
        </div>
        <p className="text-[8px] text-gray-400 uppercase tracking-widest font-medium">Scan for E-Invite</p>
      </div>
      <div className="absolute right-0 sm:-right-5 -bottom-3 w-24 h-40 bg-gray-900 rounded-xl shadow-md flex items-center justify-center p-0.5">
        <div className="w-full h-full bg-white rounded-[10px] flex flex-col items-center justify-center p-1.5">
          <Sparkles size={12} className="text-gray-900 mb-1" />
          <p className="text-[6px] font-semibold text-gray-900">Priya & Arjun</p>
          <p className="text-[5px] text-gray-400">March 15, 2026</p>
          <div className="w-full h-8 bg-gray-100 rounded mt-1.5" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function Component() {
  return (
    <div>

      {/* ══════════════════════════════════════════════════════════════
          1. HERO — clean white bg, dark text
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-white">
        <div className="relative max-w-3xl mx-auto px-5 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-gray-900"
          >
            Create beautiful invitations for your special moments
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base text-gray-500 mt-5 mb-8 max-w-xl mx-auto"
          >
            Weddings, birthdays, and celebrations deserve to be remembered. Create your invitation website in minutes — no design skills needed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-4"
          >
            <Link to={EVENTS[0].urlPath}>
              <Button size="xl" className="bg-gray-900 text-white hover:bg-gray-800">
                Create Website
              </Button>
            </Link>
            <span className="text-xs text-gray-400">
              No credit card required &middot; Ready in minutes
            </span>
          </motion.div>

          {/* Large stat */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-14"
          >
            <p className="text-4xl md:text-5xl font-bold text-gray-900">41,000+</p>
            <p className="text-sm text-gray-400 mt-1">Trusted Worldwide</p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          2. GALLERY CAROUSEL
      ══════════════════════════════════════════════════════════════ */}
      <Section spacing="compact" label="Sample invitations">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5">
                  <span className="text-xs font-medium text-white bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    {inv.label}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Section>

      {/* ══════════════════════════════════════════════════════════════
          3. EVENT CATEGORIES — white cards with accent dot
      ══════════════════════════════════════════════════════════════ */}
      <Section muted label="Event categories">
        <SectionTitle
          title="Create for Every Occasion"
          subtitle="Beautiful templates for every celebration."
        />

        <motion.div variants={stagger} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {EVENTS.map((ev) => (
            <motion.div key={ev.slug} variants={fadeUp}>
              <Link
                to={ev.urlPath}
                className="block rounded-xl p-5 text-center bg-white border border-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-px"
              >
                <div
                  className="w-3 h-3 rounded-full mx-auto mb-3"
                  style={{ backgroundColor: ev.accentColor }}
                />
                <h3 className="font-medium text-sm">{ev.label}</h3>
                <p className="text-xs text-gray-400 mt-0.5 leading-snug hidden sm:block">{ev.tagline}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════
          4. HOW IT WORKS — dark circle icons
      ══════════════════════════════════════════════════════════════ */}
      <Section size="narrow" label="How it works">
        <SectionTitle
          title="How It Works"
          subtitle="Three simple steps. That's all."
        />

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          {steps.map((s) => (
            <motion.div key={s.num} variants={fadeUp} className="text-center">
              <div className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center mx-auto mb-4">
                {s.icon}
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5">Step {s.num}</p>
              <h3 className="font-semibold text-base mb-1.5">{s.title}</h3>
              <p className="text-sm text-gray-500 max-w-[220px] mx-auto">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════
          5. WHATSAPP SHARING
      ══════════════════════════════════════════════════════════════ */}
      <Section muted label="WhatsApp sharing">
        <FeatureRow
          kicker="No App Needed"
          title="Share Instantly via WhatsApp"
          description="Your guests simply tap the link to view your beautiful invitation. Share to individuals, groups, or broadcast lists."
          visual={<WhatsAppMockup />}
        >
          <CheckList
            items={[
              'One tap sharing to any contact or group',
              'Beautiful link preview with event details',
              'Guests RSVP directly from the invitation',
              'Works on any phone — no app needed',
            ]}
            color="#10b981"
          />
        </FeatureRow>
      </Section>

      {/* ══════════════════════════════════════════════════════════════
          6. QR BRIDGE
      ══════════════════════════════════════════════════════════════ */}
      <Section label="QR code bridge">
        <FeatureRow
          kicker="Best of Both Worlds"
          title="Bridge Print & Digital"
          description="Add a QR code to your printed cards that links directly to your digital invitation. Guests scan to see photos, get directions, and RSVP."
          visual={<QRMockup />}
          reverse
        >
          <CheckList
            items={[
              'Auto-generated QR code for your invitation',
              'Print on physical cards, share digitally too',
              'Guests access full details instantly',
              'No more lost or forgotten invites',
            ]}
          />
        </FeatureRow>
      </Section>

      {/* ══════════════════════════════════════════════════════════════
          7. WHY CHOOSE INVITATION.AI — 6 cards
      ══════════════════════════════════════════════════════════════ */}
      <Section muted label="Why choose Invitation.AI">
        <SectionTitle
          title="Why Choose Invitation.AI"
          subtitle="Everything a paper invitation does, but better."
        />

        <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((b) => (
            <motion.div key={b.title} variants={fadeUp}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <Card.Body>
                  <h3 className="font-semibold text-sm mb-1">{b.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
                </Card.Body>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════
          8. TESTIMONIALS
      ══════════════════════════════════════════════════════════════ */}
      <Section label="Testimonials">
        <SectionTitle title="Loved by Thousands" />

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={fadeUp}>
              <Card className="h-full">
                <Card.Body>
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className="text-amber-400" fill="#fbbf24" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.event} &middot; {t.city}</p>
                </Card.Body>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════
          9. STATS BANNER — dark bg
      ══════════════════════════════════════════════════════════════ */}
      <Section size="narrow" spacing="compact" label="Stats">
        <div className="bg-gray-900 rounded-2xl px-6 py-10">
          <div className="grid grid-cols-3 text-center text-white gap-2">
            {stats.map((s) => (
              <motion.div key={s.label} variants={fadeUp}>
                <p className="text-xl sm:text-2xl md:text-4xl font-bold">{s.value}</p>
                <p className="text-[10px] sm:text-xs opacity-70 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════
          10. PRICING — 3 plans (1M, 3M, 1Y)
      ══════════════════════════════════════════════════════════════ */}
      <Section size="narrow" label="Pricing">
        <SectionTitle
          title="Simple Pricing"
          subtitle="Preview free. Pay only to activate your shareable link."
        />
        <motion.div variants={fadeUp} className="text-center -mt-8 mb-10">
          <span className="text-xs text-gray-400">
            Secure payment &middot; Instant activation &middot; No hidden fees
          </span>
        </motion.div>

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {visiblePlans.map((plan) => (
            <motion.div key={plan.id} variants={fadeUp}>
              <Card
                variant={plan.preferred ? 'elevated' : 'default'}
                className={cn(
                  'p-6 text-center relative',
                  plan.preferred && 'border-2 border-gray-900 md:scale-[1.03]',
                )}
              >
                {plan.preferred && (
                  <Badge variant="premium" className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    Most Popular
                  </Badge>
                )}
                <h3 className="font-medium text-sm mb-1.5 mt-1">{plan.label}</h3>
                <p className="text-3xl font-bold text-gray-900 mb-0.5">
                  <span className="text-sm align-top mr-0.5">&#8377;</span>{plan.price}
                </p>
                <p className="text-xs text-gray-400 mb-5">{plan.duration} days</p>
                <Link to={EVENTS[0].urlPath}>
                  <Button
                    variant={plan.preferred ? 'primary' : 'outline'}
                    size="md"
                    className={cn('w-full', plan.preferred && 'bg-gray-900 hover:bg-gray-800')}
                  >
                    Get Started
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════
          11. FINAL CTA — clean white
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-xl mx-auto px-5 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold mb-4">
              Turn Your Celebration Into a Beautiful Memory
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 text-base mb-8">
              Start creating your beautiful invitation now. It only takes a few minutes.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link to={EVENTS[0].urlPath}>
                <Button size="xl" className="bg-gray-900 text-white hover:bg-gray-800">
                  Create Website
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
