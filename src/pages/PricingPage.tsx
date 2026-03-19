import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Star, Crown, Users, ImageIcon, Timer, MousePointerClick, Share2, MapPin, Music, LinkIcon, Headphones, Ban, Building2, User, ChevronDown } from 'lucide-react';
import { PRICING_PLANS, BUSINESS_PLAN } from '../constants/events';
import { useAuth } from '../lib/auth';
import { initiatePayment } from '../lib/payments';
import { saveInvitation } from '../lib/invitations';
import { useState, useEffect } from 'react';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };

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
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(PRICING_PLANS.find(p => p.preferred)!);

  useEffect(() => {
    if (user) {
      const pendingPlan = sessionStorage.getItem('pendingPlan');
      if (pendingPlan) {
        setSelectedPlan(JSON.parse(pendingPlan));
      }
    }
  }, [user]);

  const handleProceed = async () => {
    if (!user) {
      sessionStorage.setItem('pendingPlan', JSON.stringify(selectedPlan));
      await signInWithGoogle();
      return;
    }

    setProcessing(true);
    try {
      const formDataStr = sessionStorage.getItem('inviteFormData');
      const templateStr = sessionStorage.getItem('inviteSelectedTemplate');
      if (!formDataStr) {
        navigate('/');
        return;
      }

      const formData = JSON.parse(formDataStr);
      const template = templateStr ? JSON.parse(templateStr) : { id: 'midnight' };

      const invitation = await saveInvitation({
        userId: user.id,
        formData,
        templateId: template.id,
      });

      await initiatePayment({
        invitationId: invitation.id,
        planId: selectedPlan.id,
        amount: selectedPlan.price,
        planDuration: selectedPlan.duration,
        userEmail: user.email!,
        onSuccess: () => {
          sessionStorage.removeItem('inviteFormData');
          sessionStorage.removeItem('inviteSelectedTemplate');
          sessionStorage.removeItem('pendingPlan');
          navigate('/dashboard');
        },
        onFailure: (error) => {
          alert(`Payment failed: ${error}`);
          setProcessing(false);
        },
      });
    } catch (err) {
      alert(`Error: ${(err as Error).message}`);
      setProcessing(false);
    }
  };

  return (
    <div style={{ background: '#FFFBF8', minHeight: '100vh' }}>

      {/* ─── Hero / Title Section ─── */}
      <section style={{ background: 'linear-gradient(180deg, #FFFBF8 0%, #FFF5EE 100%)', padding: '80px 24px 40px' }}>
        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}
        >
          <motion.h1 variants={fadeUp} style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 48,
            fontWeight: 600,
            color: '#1F1A1B',
            marginBottom: 16,
            lineHeight: 1.2,
          }}>
            Pricing <span style={{ color: '#B8405E' }}>Plan</span>
          </motion.h1>
          <motion.p variants={fadeUp} style={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: 16,
            color: '#4A4044',
            lineHeight: 1.6,
            maxWidth: 480,
            margin: '0 auto',
          }}>
            List of our pricing packages
          </motion.p>
        </motion.div>
      </section>

      {/* ─── Pricing Cards — Individual + Business ─── */}
      <section style={{ background: '#FFFBF8', padding: '40px 24px 80px' }}>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}
          style={{
            maxWidth: 800,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 32,
            alignItems: 'start',
          }}
        >
          {/* ── Individual Plan Card ── */}
          <motion.div variants={fadeUp} style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 0 20px rgba(204, 204, 204, 0.4)',
            overflow: 'hidden',
            textAlign: 'center',
          }}>
            {/* Card Header */}
            <div style={{ padding: '40px 30px 24px', position: 'relative' }}>
              {/* Icon Circle */}
              <div style={{
                width: 80, height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FFF5EE, #FFF0F4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                border: '2px solid #F0E6DC',
              }}>
                <User style={{ width: 36, height: 36, color: '#B8405E' }} />
              </div>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 20,
                fontWeight: 600,
                color: '#1F1A1B',
                lineHeight: 1.3,
                marginBottom: 0,
              }}>Individual</h3>
            </div>

            {/* Card Body */}
            <div style={{ padding: '0 32px 32px' }}>
              {/* Domain */}
              <div style={{
                display: 'inline-block',
                background: '#FFF5EE',
                borderRadius: 8,
                padding: '8px 16px',
                marginBottom: 24,
                fontSize: 14,
                color: '#4A4044',
                fontFamily: "'Nunito Sans', sans-serif",
              }}>
                <span style={{ color: '#B8405E', fontWeight: 600 }}>your-name</span>.invitationai.events
              </div>

              {/* Pricing Tiers */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', textAlign: 'left' }}>
                {PRICING_PLANS.map((plan) => (
                  <li
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    style={{
                      padding: '10px 12px',
                      borderBottom: '1px solid #F0E6DC',
                      fontSize: 14,
                      fontFamily: "'Nunito Sans', sans-serif",
                      color: '#1F1A1B',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      borderRadius: 8,
                      background: selectedPlan.id === plan.id ? '#FFF0F4' : 'transparent',
                      border: selectedPlan.id === plan.id ? '1.5px solid #B8405E' : '1.5px solid transparent',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Check style={{ width: 16, height: 16, color: selectedPlan.id === plan.id ? '#B8405E' : '#22C55E', flexShrink: 0 }} strokeWidth={3} />
                    <span>
                      <strong style={{ color: '#1F1A1B' }}>₹{plan.price}</strong> per invitation for {plan.label.toLowerCase()}
                    </span>
                  </li>
                ))}
                <li style={{
                  padding: '10px 0',
                  borderBottom: '1px solid #F0E6DC',
                  fontSize: 14,
                  fontFamily: "'Nunito Sans', sans-serif",
                  color: '#1F1A1B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <Check style={{ width: 16, height: 16, color: '#22C55E', flexShrink: 0 }} strokeWidth={3} />
                  Ad free invitation
                </li>
                <li style={{
                  padding: '10px 0',
                  fontSize: 14,
                  fontFamily: "'Nunito Sans', sans-serif",
                  color: '#1F1A1B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <Check style={{ width: 16, height: 16, color: '#22C55E', flexShrink: 0 }} strokeWidth={3} />
                  Dedicated customer support
                </li>
              </ul>

              {/* CTA Button */}
              <button
                onClick={handleProceed}
                disabled={processing}
                style={{
                  width: '100%',
                  padding: '14px 0',
                  borderRadius: 12,
                  border: 'none',
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily: "'Nunito Sans', sans-serif",
                  cursor: processing ? 'not-allowed' : 'pointer',
                  color: '#fff',
                  background: 'linear-gradient(135deg, #9A3350, #B8405E)',
                  boxShadow: '0 6px 28px rgba(184,64,94,0.35)',
                  opacity: processing ? 0.7 : 1,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                {processing ? 'Processing...' : 'Proceed to Pay'}
              </button>
            </div>
          </motion.div>

          {/* ── Business Plan Card (Featured/Active) ── */}
          <motion.div variants={fadeUp} style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 4px 30px rgba(184, 64, 94, 0.15)',
            overflow: 'hidden',
            textAlign: 'center',
            border: '2px solid #B8405E',
          }}>
            {/* Red Gradient Header */}
            <div style={{
              background: 'linear-gradient(135deg, #B8405E, #D4548F)',
              padding: '40px 30px 24px',
              position: 'relative',
              borderRadius: '10px 10px 0 0',
            }}>
              {/* Icon Circle */}
              <div style={{
                width: 64, height: 64,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                border: '2px solid rgba(255,255,255,0.3)',
              }}>
                <Building2 style={{ width: 28, height: 28, color: '#fff' }} />
              </div>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 20,
                fontWeight: 600,
                color: '#fff',
                lineHeight: 1.3,
                marginBottom: 8,
              }}>Business</h3>
              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 40,
                fontWeight: 700,
                color: '#fff',
                lineHeight: 1,
              }}>
                ₹{BUSINESS_PLAN.registrationFee}
              </div>
            </div>

            {/* Card Body */}
            <div style={{ padding: '24px 32px 32px' }}>
              {/* Domain */}
              <div style={{
                display: 'inline-block',
                background: '#FFF5EE',
                borderRadius: 8,
                padding: '8px 16px',
                marginBottom: 24,
                fontSize: 14,
                color: '#4A4044',
                fontFamily: "'Nunito Sans', sans-serif",
              }}>
                <span style={{ color: '#B8405E', fontWeight: 600 }}>events</span>.yourdomain.com
              </div>

              {/* Features */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', textAlign: 'left' }}>
                <li style={{
                  padding: '10px 0',
                  borderBottom: '1px solid #F0E6DC',
                  fontSize: 14,
                  fontFamily: "'Nunito Sans', sans-serif",
                  color: '#1F1A1B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <Check style={{ width: 16, height: 16, color: '#22C55E', flexShrink: 0 }} strokeWidth={3} />
                  <span><strong>₹{BUSINESS_PLAN.registrationFee}</strong> lifetime registration fee (one time)</span>
                </li>
                {BUSINESS_PLAN.features.map((feature, i) => (
                  <li key={i} style={{
                    padding: '10px 0',
                    borderBottom: i < BUSINESS_PLAN.features.length - 1 ? '1px solid #F0E6DC' : 'none',
                    fontSize: 14,
                    fontFamily: "'Nunito Sans', sans-serif",
                    color: '#1F1A1B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                    <Check style={{ width: 16, height: 16, color: '#22C55E', flexShrink: 0 }} strokeWidth={3} />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link to="/" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'linear-gradient(45deg, #9A3350, #B8405E)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 28,
                  padding: '14px 32px',
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: "'Nunito Sans', sans-serif",
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 4px 14px rgba(184, 64, 94, 0.3)',
                }}>
                  Proceed
                </button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── All Plans Include ─── */}
      <section style={{
        background: 'linear-gradient(180deg, #FFF5EE 0%, #FFFBF8 100%)',
        padding: '80px 24px',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 36,
            fontWeight: 600,
            color: '#1F1A1B',
            textAlign: 'center',
            marginBottom: 32,
          }}>
            All Plans <span style={{ color: '#B8405E' }}>Include</span>
          </h2>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 16,
            }}
          >
            {FEATURES.map((f) => (
              <motion.div key={f.label} variants={fadeUp} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 20px',
                background: '#fff',
                borderRadius: 10,
                border: '1px solid #F0E6DC',
              }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#F0FFF4',
                  color: '#22C55E',
                  flexShrink: 0,
                }}>
                  <Check style={{ width: 16, height: 16 }} strokeWidth={3} />
                </span>
                <span style={{
                  fontSize: 14,
                  fontFamily: "'Nunito Sans', sans-serif",
                  color: '#1F1A1B',
                  lineHeight: 1.5,
                }}>{f.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Trust / Social Proof ─── */}
      <section style={{
        background: 'linear-gradient(180deg, #FFFBF8 0%, #FFF5EE 100%)',
        padding: '80px 24px',
      }}>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}
        >
          {/* Overlapping Avatars */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            {['#B8405E', '#D4A06A', '#6B9BB5', '#8B6BAA', '#C07D54'].map((bg, i) => (
              <div key={i} style={{
                width: 44, height: 44,
                borderRadius: '50%',
                background: bg,
                border: '3px solid #fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "'Nunito Sans', sans-serif",
                marginLeft: i > 0 ? -12 : 0,
                position: 'relative',
                zIndex: 5 - i,
              }}>
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>

          {/* Stars */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 12 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} style={{ width: 22, height: 22, fill: '#F59E0B', color: '#F59E0B' }} />
            ))}
          </div>

          <p style={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: 16,
            lineHeight: 1.6,
            color: '#4A4044',
          }}>
            Secure payment &middot; Instant activation &middot; Cancel anytime
          </p>
        </motion.div>
      </section>

      {/* ─── FAQ ─── */}
      <section style={{
        background: '#FFFBF8',
        padding: '80px 24px',
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 36,
            fontWeight: 600,
            color: '#1F1A1B',
            textAlign: 'center',
            marginBottom: 32,
          }}>
            Frequently Asked <span style={{ color: '#B8405E' }}>Questions</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQ.map((item, idx) => (
              <FAQItem key={idx} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Contact / CTA Footer ─── */}
      <section style={{
        background: 'linear-gradient(135deg, #1F1A1B 0%, #1A1816 100%)',
        padding: '80px 24px',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'flex-start' }}>
          {/* Left */}
          <div style={{ flex: '1 1 300px' }}>
            <p style={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: 14,
              color: '#D4548F',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 2,
              marginBottom: 12,
            }}>Contact Us</p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 36,
              fontWeight: 600,
              color: '#fff',
              marginBottom: 16,
              lineHeight: 1.2,
            }}>
              Let's Get In Touch
            </h2>
            <p style={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: 16,
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.6,
            }}>
              Or just reach out manually to <span style={{ color: '#D4548F' }}>info@invitation.ai</span>
            </p>
          </div>

          {/* Right */}
          <div style={{ flex: '1 1 300px' }}>
            <h4 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 16,
              fontWeight: 600,
              color: '#fff',
              marginBottom: 16,
            }}>Main Office</h4>
            <p style={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: 14,
              color: 'rgba(255,255,255,0.4)',
              lineHeight: 1.5,
            }}>
              Invitation.AI<br />
              info@invitation.ai<br />
              Kerala, India
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── FAQ Accordion Item ─── */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        background: '#fff',
        border: '1px solid #F0E6DC',
        borderRadius: 12,
        padding: '20px 24px',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        boxShadow: open ? '0 4px 16px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
      }}>
        <h4 style={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: 16,
          fontWeight: 600,
          color: '#1F1A1B',
          margin: 0,
        }}>{question}</h4>
        <ChevronDown style={{
          width: 20, height: 20,
          color: '#4A4044',
          flexShrink: 0,
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
        }} />
      </div>
      {open && (
        <p style={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: 14,
          color: '#8D8A86',
          marginTop: 12,
          lineHeight: 1.5,
        }}>
          {answer}
        </p>
      )}
    </div>
  );
}

/* React imports moved to top */
