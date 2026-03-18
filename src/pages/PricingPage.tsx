import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Star, Crown, Users, ImageIcon, Timer, MousePointerClick, Share2, MapPin, Music, LinkIcon, Headphones, Ban, Building2, User } from 'lucide-react';
import { PRICING_PLANS, BUSINESS_PLAN } from '../constants/events';
import { fadeUp, stagger } from '../utils/animations';
import { Accordion, Badge, Button, Card, Section, SectionTitle } from '../components/ui';

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
  return (
    <div>
      {/* Header */}
      <Section spacing="compact" className="text-center pt-8">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-bold serif mb-4">
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p variants={fadeUp} className="text-[var(--color-text-secondary)] text-base max-w-xl mx-auto">
            Choose the plan that fits your celebration
          </motion.p>
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

      {/* Individual + Business Two-Column Layout */}
      <Section size="narrow" label="Pricing plans">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Individual Plan Card */}
          <motion.div variants={fadeUp}>
            <Card className="p-8 relative h-full">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-900">
                  <User className="w-5 h-5" />
                </span>
                <h3 className="text-2xl font-bold serif">Individual Plan</h3>
              </div>

              <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                your-name.<strong>invitationai.events</strong>
              </p>

              {/* Pricing Tiers Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {PRICING_PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative rounded-xl border-2 p-4 text-center transition-colors ${
                      plan.preferred
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200'
                    }`}
                  >
                    {plan.preferred && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-semibold bg-gray-900 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                        Popular
                      </span>
                    )}
                    <p className="text-xs text-[var(--color-text-secondary)] mb-1">{plan.label}</p>
                    <p className="text-2xl font-extrabold">&#8377;{plan.price}</p>
                  </div>
                ))}
              </div>

              {/* Individual Features */}
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </span>
                  Ad free invitation
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </span>
                  Dedicated customer support
                </li>
              </ul>

              <Button variant="primary" size="lg" className="w-full">Proceed</Button>
            </Card>
          </motion.div>

          {/* Business Plan Card */}
          <motion.div variants={fadeUp}>
            <Card className="p-8 relative h-full">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-900">
                  <Building2 className="w-5 h-5" />
                </span>
                <h3 className="text-2xl font-bold serif">Business Plan</h3>
              </div>

              <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                events.<strong>yourdomain.com</strong>
              </p>

              {/* Lifetime Registration Badge */}
              <div className="flex items-center justify-center mb-6">
                <span className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full">
                  <Crown className="w-4 h-4" />
                  &#8377;{BUSINESS_PLAN.registrationFee} Lifetime Registration
                </span>
              </div>

              {/* Business Features */}
              <ul className="space-y-3 mb-8">
                {BUSINESS_PLAN.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button variant="primary" size="lg" className="w-full">Proceed</Button>
            </Card>
          </motion.div>
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

      {/* Trust Section */}
      <Section size="narrow" spacing="compact" className="text-center">
        <motion.div variants={fadeUp}>
          <div className="flex justify-center -space-x-3 mb-4">
            {['bg-gray-400', 'bg-amber-300', 'bg-sky-300', 'bg-emerald-300', 'bg-violet-300'].map((bg, i) => (
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
