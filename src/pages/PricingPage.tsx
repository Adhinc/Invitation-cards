import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Check,
  Star,
  X,
  Ban,
  Crown,
  Users,
  ImageIcon,
  Timer,
  MousePointerClick,
  Share2,
  MapPin,
  Music,
  LinkIcon,
  Headphones,
} from 'lucide-react';
import { PRICING_PLANS, PROMO_CODES } from '../constants/events';
import { fadeUp, stagger } from '../utils/animations';
import { Accordion } from '../components/ui';

/* ------------------------------------------------------------------ */
/*  Features list                                                      */
/* ------------------------------------------------------------------ */

const FEATURES = [
  { label: 'All Templates Unlocked', icon: Crown },
  { label: 'Photo Gallery (up to 50 photos)', icon: ImageIcon },
  { label: 'Countdown Timer', icon: Timer },
  { label: 'RSVP & Interactive Buttons', icon: MousePointerClick },
  { label: 'WhatsApp Sharing', icon: Share2 },
  { label: 'Google Maps Integration', icon: MapPin },
  { label: 'Background Music', icon: Music },
  { label: 'Personalized Shareable Link', icon: LinkIcon },
  { label: '24/7 Support', icon: Headphones },
  { label: 'Zero Ads', icon: Ban },
];

/* ------------------------------------------------------------------ */
/*  FAQ data                                                           */
/* ------------------------------------------------------------------ */

const FAQ = [
  {
    q: 'Is the preview really free?',
    a: 'Yes! You can preview and create your invitation website completely free. No credit card required.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit/debit cards, UPI, PhonePe, Google Pay, and net banking.',
  },
  {
    q: 'Can I upgrade later?',
    a: 'Absolutely. You can upgrade your plan anytime from your dashboard. You only pay the difference.',
  },
  {
    q: 'What happens when my plan expires?',
    a: 'Your website goes offline when the plan expires. Simply renew to reactivate it instantly — all your data is preserved.',
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Component() {
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');
  const discount = appliedPromo ? PROMO_CODES[appliedPromo]?.discount ?? 0 : 0;

  function applyPromo() {
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Please try again.');
      setAppliedPromo(null);
    }
  }

  function removePromo() {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError('');
  }

  function discountedPrice(price: number) {
    return Math.round(price * (1 - discount / 100));
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-16">

        {/* ---- Header ---- */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.h1
            variants={fadeUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold serif mb-4"
          >
            Pricing Plan
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto"
          >
            Simple, transparent pricing for your special moments
          </motion.p>
        </motion.div>

        {/* ---- Special Offer Banner ---- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-rose-500 text-white rounded-2xl px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-14 text-center"
        >
          <Sparkles className="w-5 h-5 shrink-0" />
          <span className="font-medium text-sm md:text-base">
            Special Offer for New Users! Get 10% OFF — Use Code:{' '}
            <span className="font-bold underline underline-offset-2">SAVE10</span>
          </span>
          <Sparkles className="w-5 h-5 shrink-0" />
        </motion.div>

        {/* ---- Free Tier Card ---- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          className="relative bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl p-8 md:p-10 mb-14 text-center"
        >
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">
            Free
          </span>
          <h2 className="text-2xl md:text-3xl font-bold serif mt-2 mb-3">Website Preview</h2>
          <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
            Completely FREE — Preview your invitation before you commit
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-secondary)] mb-6">
            <Users className="w-4 h-4" />
            <span>Trusted by <strong>4,500+</strong> happy customers</span>
          </div>
          <Link
            to="/"
            className="inline-block bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Create Website
          </Link>
        </motion.div>

        {/* ---- Duration Pricing Cards ---- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-center"
        >
          {PRICING_PLANS.map((plan) => {
            const pricePerMonth = plan.price / (plan.duration / 30);
            const final = discountedPrice(plan.price);
            const isPreferred = plan.preferred;

            return (
              <motion.div
                key={plan.id}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className={`relative bg-[var(--bg-secondary)] rounded-3xl p-8 text-center transition-shadow ${
                  isPreferred
                    ? 'border-2 border-rose-400 shadow-xl md:scale-105 z-10'
                    : 'border border-[var(--border)] shadow-md'
                }`}
              >
                {isPreferred && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">
                    Most Popular
                  </span>
                )}

                <h3 className="text-xl font-bold serif mt-2 mb-1">{plan.label}</h3>

                <div className="mb-1">
                  {discount > 0 ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-[var(--text-secondary)] line-through text-lg">
                        &#8377;{plan.price}
                      </span>
                      <span className="text-3xl md:text-4xl font-extrabold text-rose-500">
                        &#8377;{final}
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl md:text-4xl font-extrabold">
                      &#8377;{plan.price}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[var(--text-secondary)] mb-4">
                  ~&#8377;{Math.round(pricePerMonth)}/month
                </p>

                <span className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full mb-6">
                  <Ban className="w-3 h-3" /> Zero Ads
                </span>

                <div>
                  <button
                    className={`w-full font-semibold px-6 py-3 rounded-full transition-opacity hover:opacity-90 ${
                      isPreferred
                        ? 'bg-rose-500 text-white'
                        : 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                    }`}
                  >
                    Activate Now
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ---- Features List ---- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold serif text-center mb-8">
            All Plans Include
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {FEATURES.map((f) => (
              <motion.div
                key={f.label}
                variants={fadeUp}
                className="flex items-center gap-3"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                  <Check className="w-4 h-4" strokeWidth={3} />
                </span>
                <span className="text-sm md:text-base">{f.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ---- Promo Code Section ---- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-8 mb-16 max-w-lg mx-auto text-center"
        >
          <h3 className="font-bold text-lg mb-4">Have a Promo Code?</h3>

          {appliedPromo ? (
            <div className="flex items-center justify-center gap-3">
              <span className="bg-emerald-100 text-emerald-700 font-semibold px-4 py-2 rounded-full text-sm">
                {appliedPromo} — {PROMO_CODES[appliedPromo].label} applied
              </span>
              <button
                onClick={removePromo}
                className="text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                aria-label="Remove promo code"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value);
                    setPromoError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                  placeholder="Enter code"
                  className="flex-1 px-4 py-2.5 rounded-full border border-[var(--border)] bg-[var(--bg-primary)] text-sm outline-none focus:ring-2 focus:ring-rose-300 transition"
                />
                <button
                  onClick={applyPromo}
                  className="bg-rose-500 text-white font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity text-sm"
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <p className="text-red-500 text-sm mt-2">{promoError}</p>
              )}
            </>
          )}
        </motion.div>

        {/* ---- Trust Section ---- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <div className="flex justify-center -space-x-3 mb-4">
            {[
              'bg-rose-300',
              'bg-amber-300',
              'bg-sky-300',
              'bg-emerald-300',
              'bg-violet-300',
            ].map((bg, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-full ${bg} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-[var(--text-secondary)]">
            Trusted by <strong>4,500+</strong> happy customers
          </p>
        </motion.div>

        {/* ---- FAQ Section ---- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-2xl md:text-3xl font-bold serif text-center mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion>
            {FAQ.map((item, idx) => (
              <Accordion.Item key={idx} id={`faq-${idx}`} title={item.q}>
                {item.a}
              </Accordion.Item>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
}
