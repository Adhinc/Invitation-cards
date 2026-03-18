import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { getEventByType } from '../constants/events';

const TEMPLATES = [
  { id: 'midnight', name: 'Midnight Constellation', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400' },
  { id: 'lavender', name: 'Lavender Fields', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400' },
  { id: 'blossom', name: 'Simple Blossom', image: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=400' },
  { id: 'golden', name: 'Golden Hour', image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400' },
  { id: 'royal', name: 'Royal Elegance', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
  { id: 'minimal', name: 'Modern Minimal', image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400' },
];

export function Component() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, eventType } = (location.state as { formData?: unknown; eventType?: string }) || {};

  const stored = !formData ? JSON.parse(sessionStorage.getItem('inviteFormData') || 'null') : null;
  const actualFormData = formData || stored;
  const actualEventType = eventType || stored?.eventType;

  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!actualFormData) return <Navigate to="/" replace />;

  const event = getEventByType(actualEventType as Parameters<typeof getEventByType>[0]);
  const accentColor = event?.accentColor || '#B8405E';
  const selectedTemplate = TEMPLATES.find((t) => t.id === selectedId);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      {/* Header */}
      <div className="pt-20 pb-8 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {event && (
            <span
              className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ backgroundColor: accentColor + '22', color: accentColor, border: `1px solid ${accentColor}44` }}
            >
              {event.label}
            </span>
          )}
          <h1 className="text-2xl md:text-3xl font-bold">
            Choose Your Template
          </h1>
          <p className="mt-2 text-[var(--color-text-muted)] text-sm md:text-base max-w-md mx-auto">
            Pick a design that matches your celebration's vibe
          </p>
        </motion.div>
      </div>

      {/* Template Grid */}
      <div className="flex-1 px-4 md:px-8 pb-32 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {TEMPLATES.map((template, i) => {
            const isSelected = selectedId === template.id;
            return (
              <motion.button
                key={template.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                onClick={() => setSelectedId(template.id)}
                className="group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow focus:outline-none"
              >
                {/* Border highlight */}
                <motion.div
                  className="absolute inset-0 z-10 rounded-2xl pointer-events-none"
                  animate={{
                    boxShadow: isSelected ? 'inset 0 0 0 3px #B8405E' : 'inset 0 0 0 0px transparent',
                  }}
                  transition={{ duration: 0.25 }}
                />

                {/* Image */}
                <motion.div
                  className="aspect-[3/4] overflow-hidden"
                  animate={{ scale: isSelected ? 1.03 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </motion.div>

                {/* Checkmark overlay */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-[#B8405E] flex items-center justify-center shadow-lg"
                  >
                    <Check size={16} className="text-white stroke-[3]" />
                  </motion.div>
                )}

                {/* Name */}
                <div className="p-3 md:p-4">
                  <p className="text-xs md:text-sm font-bold text-[var(--color-text-primary)] truncate">
                    {template.name}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-[#FFFBF8]/90 backdrop-blur-xl border-t border-[#F0E6DC]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-[#F0E6DC] text-[#4A4744] font-bold text-sm hover:border-[#B8405E]/30 transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="flex-1 text-center hidden sm:block">
            {selectedTemplate ? (
              <motion.p
                key={selectedTemplate.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-[var(--color-text-secondary)]"
              >
                Selected: <span className="font-bold text-[var(--color-text-primary)]">{selectedTemplate.name}</span>
              </motion.p>
            ) : (
              <p className="text-sm text-[var(--color-text-muted)]">No template selected</p>
            )}
          </div>

          <button
            disabled={!selectedTemplate}
            onClick={() => {
              sessionStorage.setItem('inviteSelectedTemplate', JSON.stringify(selectedTemplate));
              navigate('/preview', {
                state: { formData: actualFormData, eventType: actualEventType, selectedTemplate },
              });
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#B8405E] text-white font-bold text-sm shadow-[0_6px_28px_rgba(184,64,94,0.4)] hover:bg-[#A03650] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Continue
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
