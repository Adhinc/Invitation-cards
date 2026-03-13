import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, Check, Star, X, Ban, Crown, Users, ImageIcon,
  Timer, MousePointerClick, Share2, MapPin, Music, LinkIcon, Headphones,
} from 'lucide-react';
import { PRICING_PLANS, PROMO_CODES } from '../constants/events';
import { fadeUp, stagger } from '../utils/animations';
import { Accordion, Badge, Button, Card, Input, Section, SectionTitle } from '../components/ui';
import { cn } from '../utils/cn';

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

const FAQ = [
  { q: 'Is the preview really free?', a: 'Yes! You can preview and create your invitation website completely free. No credit card required.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, UPI, PhonePe, Google Pay, and net banking.' },
  { q: 'Can I upgrade later?', a: 'Absolutely. You can upgrade your plan anytime from your dashboard. You only pay the difference.' },
  { q: 'What happens when my plan expires?', a: 'Your website goes offline when the plan expires. Simply renew to reactivate it instantly — all your data is preserved.' },
];

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
    <div>
      {/* Header */}
      <Section spacing="compact" className="text-center pt-8">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-bold serif mb-4">
            Pricing Plan
          </motion.h1>
          <motion.p variants={fadeUp} className="text-[var(--color-text-secondary)] text-base max-w-xl mx-auto">
            Simple, transparent pricing for your special moments
          </motion.p>
        </motion.div>
      </Section>

      {/* Special Offer Banner */}
      <Section spacing="compact">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-[var(--color-primary)] text-white rounded-2xl px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center"
        >
          <Sparkles className="w-5 h-5 shrink-0" />
          <span className="font-medium text-sm md:text-base">
            Special Offer for New Users! Get 10% OFF — Use Code:{' '}
            <span className="font-bold underline underline-offset-2">SAVE10</span>
          </span>
          <Sparkles className="w-5 h-5 shrink-0" />
        </motion.div>
      </Section>

      {/* Free Tier Card */}
      <Section spacing="compact" size="narrow">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}
          className="relative bg-white border border-gray-100 rounded-2xl p-8 md:p-10 text-center"
        >
          <Badge variant="success" className="absolute -top-3 left-1/2 -translate-x-1/2">Free</Badge>
          <h2 className="text-2xl md:text-3xl font-bold serif mt-2 mb-3">Website Preview</h2>
          <p className="text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto text-base">
            Completely FREE — Preview your invitation before you commit
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-text-secondary)] mb-6">
            <Users className="w-4 h-4" />
            <span>Trusted by <strong>4,500+</strong> happy customers</span>
          </div>
          <Link to="/">
            <Button variant="secondary" size="lg">Create Website</Button>
          </Link>
        </motion.div>
      </Section>

      {/* Duration Pricing Cards */}
      <Section size="narrow" label="Pricing plans">
        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {PRICING_PLANS.map((plan) => {
            const pricePerMonth = plan.price / (plan.duration / 30);
            const final = discountedPrice(plan.price);
            const isPreferred = plan.preferred;

            return (
              <motion.div key={plan.id} variants={fadeUp} whileHover={{ y: -4 }}>
                <Card
                  variant={isPreferred ? 'elevated' : 'default'}
                  className={cn(
                    'p-6 text-center relative',
                    isPreferred ? 'border-2 border-[var(--color-primary)] md:scale-105 z-10' : 'shadow-md',
                  )}
                >
                  {isPreferred && (
                    <Badge variant="premium" className="absolute -top-3 left-1/2 -translate-x-1/2">
                      Most Popular
                    </Badge>
                  )}

                  <h3 className="text-xl font-bold serif mt-2 mb-1">{plan.label}</h3>

                  <div className="mb-1">
                    {discount > 0 ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-[var(--color-text-secondary)] line-through text-base">&#8377;{plan.price}</span>
                        <span className="text-3xl md:text-4xl font-extrabold text-[var(--color-primary)]">&#8377;{final}</span>
                      </div>
                    ) : (
                      <span className="text-3xl md:text-4xl font-extrabold">&#8377;{plan.price}</span>
                    )}
                  </div>

                  <p className="text-xs text-[var(--color-text-secondary)] mb-4">
                    ~&#8377;{Math.round(pricePerMonth)}/month
                  </p>

                  <span className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full mb-6">
                    <Ban className="w-3 h-3" /> Zero Ads
                  </span>

                  <div>
                    <Button className="w-full" variant={isPreferred ? 'primary' : 'secondary'} size="lg">
                      Activate Now
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </Section>

      {/* Features List */}
      <Section size="narrow" label="Features included">
        <SectionTitle title="All Plans Include" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <motion.div key={f.label} variants={fadeUp} className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                <Check className="w-4 h-4" strokeWidth={3} />
              </span>
              <span className="text-sm">{f.label}</span>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Promo Code Section */}
      <Section size="narrow" spacing="compact">
        <motion.div
          variants={fadeUp}
          className="bg-white border border-gray-100 rounded-2xl p-8 text-center max-w-lg mx-auto"
        >
          <h3 className="font-bold text-base mb-4">Have a Promo Code?</h3>
          {appliedPromo ? (
            <div className="flex items-center justify-center gap-3">
              <span className="bg-emerald-100 text-emerald-700 font-semibold px-4 py-2 rounded-full text-sm">
                {appliedPromo} — {PROMO_CODES[appliedPromo].label} applied
              </span>
              <button onClick={removePromo} className="text-[var(--color-text-secondary)] hover:text-red-500 transition-colors" aria-label="Remove promo code">
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                label="Promo code" hideLabel
                value={promoInput}
                onChange={(e) => { setPromoInput(e.target.value); setPromoError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                placeholder="Enter code"
                error={promoError || undefined}
                className="rounded-full"
              />
              <Button onClick={applyPromo} size="md">Apply</Button>
            </div>
          )}
        </motion.div>
      </Section>

      {/* Trust Section */}
      <Section size="narrow" spacing="compact" className="text-center">
        <motion.div variants={fadeUp}>
          <div className="flex justify-center -space-x-3 mb-4">
            {['bg-rose-300', 'bg-amber-300', 'bg-sky-300', 'bg-emerald-300', 'bg-violet-300'].map((bg, i) => (
              <div key={i} className={`w-10 h-10 rounded-full ${bg} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-[var(--color-text-secondary)]">
            Trusted by <strong>4,500+</strong> happy customers
          </p>
        </motion.div>
      </Section>

      {/* FAQ Section */}
      <Section size="narrow" label="FAQ">
        <SectionTitle title="Frequently Asked Questions" />
        <Accordion>
          {FAQ.map((item, idx) => (
            <Accordion.Item key={idx} id={`faq-${idx}`} title={item.q}>
              {item.a}
            </Accordion.Item>
          ))}
        </Accordion>
      </Section>
    </div>
  );
}
