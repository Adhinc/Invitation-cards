import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Palette, Crown } from 'lucide-react';
import type { EventType } from '../constants/events';
import { DefaultTemplate, RoyalGoldTemplate, MinimalistTemplate } from '../templates';

interface LocationState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData?: any;
  eventType?: EventType;
  selectedTemplate?: { id: string; name: string; image: string; category?: string };
}

export function Component() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, eventType, selectedTemplate } = (location.state as LocationState) || {};

  const stored = !formData ? JSON.parse(sessionStorage.getItem('inviteFormData') || 'null') : null;
  const actualFormData = formData || stored;

  const [bannerVisible, setBannerVisible] = useState(true);

  // Redirect if no formData
  if (!actualFormData) return <Navigate to="/" replace />;

  const renderTemplate = () => {
    const templateId = selectedTemplate?.id || 'default';

    switch (templateId) {
      // Add other templates here later (e.g. RoyalGold, Minimalist)
      default:
        return <DefaultTemplate formData={actualFormData} eventType={eventType || actualFormData.eventType} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF8] flex flex-col relative font-sans overflow-x-hidden">

      {/* ── 1. Upgrade Banner (fixed top) ──────────────── */}
      <AnimatePresence>
        {bannerVisible && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-[#B8405E] text-white px-3 md:px-4 py-2.5 md:py-3 flex items-center justify-center gap-2 md:gap-3 shadow-lg flex-wrap"
          >
            <Sparkles size={14} className="shrink-0 hidden sm:block" />
            <span className="text-xs md:text-sm font-semibold">
              Free preview — Upgrade for shareable link
            </span>
            <button
              onClick={() => navigate('/pricing')}
              className="bg-white text-[#B8405E] text-[10px] md:text-xs font-black uppercase tracking-wider px-3 md:px-4 py-1 md:py-1.5 rounded-full hover:bg-[#FFF5EE] transition-colors"
            >
              Activate Now
            </button>
            <button
              onClick={() => setBannerVisible(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Dismiss banner"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Template Container ──────────────── */}
      <div className={`w-full flex-1 ${bannerVisible ? 'pt-14 md:pt-16' : ''} pb-28 relative z-10`}>
        {renderTemplate()}
      </div>

      {/* ── Floating Bottom Bar ─────────────────────── */}
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-[#F0E6DC] px-4 py-3 pb-safe"
      >
        <div className="max-w-lg mx-auto flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              navigate('/templates', {
                state: { formData: actualFormData, eventType: eventType || actualFormData.eventType },
              })
            }
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-slate-600 bg-[#FFF5EE] hover:bg-[#FFE8DC] transition-colors"
          >
            <Palette size={18} />
            Change Theme
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/pricing')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white bg-[#B8405E] shadow-lg shadow-[rgba(184,64,94,0.3)] hover:bg-[#A03650] transition-colors"
          >
            <Crown size={18} />
            Activate Now
          </motion.button>
        </div>
      </motion.div>

    </div>
  );
}
