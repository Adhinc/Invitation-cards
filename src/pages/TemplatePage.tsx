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

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

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
  const selectedTemplate = TEMPLATES.find((t) => t.id === selectedId);

  return (
    <div style={{ background: '#FFFBF8', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ─── Header ─── */}
      <div style={{ padding: '80px 24px 32px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {event && (
            <span style={{
              display: 'inline-block',
              marginBottom: 16,
              padding: '6px 20px',
              borderRadius: 24,
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 2,
              fontFamily: "'DM Sans', sans-serif",
              background: '#FFF0F4',
              color: '#B8405E',
              border: '1px solid rgba(184, 64, 94, 0.2)',
            }}>
              {event.label}
            </span>
          )}
          <h1 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 36,
            fontWeight: 600,
            color: '#2D2A26',
            marginBottom: 8,
          }}>
            Choose Your <span style={{ color: '#B8405E' }}>Template</span>
          </h1>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 16,
            color: '#6B6560',
            maxWidth: 420,
            margin: '0 auto',
          }}>
            Pick a design that matches your celebration's vibe
          </p>
        </motion.div>
      </div>

      {/* ─── Template Grid ─── */}
      <div style={{ flex: 1, padding: '0 24px 140px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 24,
        }}>
          {TEMPLATES.map((template, i) => {
            const isSelected = selectedId === template.id;
            return (
              <motion.button
                key={template.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                onClick={() => setSelectedId(template.id)}
                style={{
                  position: 'relative',
                  borderRadius: 16,
                  overflow: 'hidden',
                  background: '#fff',
                  border: isSelected ? '3px solid #B8405E' : '3px solid transparent',
                  boxShadow: isSelected
                    ? '0 8px 24px rgba(184, 64, 94, 0.2)'
                    : '0 2px 12px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  padding: 0,
                  textAlign: 'left',
                  transition: 'box-shadow 0.3s, border-color 0.3s',
                }}
              >
                {/* Image */}
                <div style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
                  <img
                    src={template.image}
                    alt={template.name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                      transition: 'transform 0.4s',
                    }}
                  />
                </div>

                {/* Checkmark */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #B8405E, #D4548F)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(184, 64, 94, 0.4)',
                    }}
                  >
                    <Check size={16} color="#fff" strokeWidth={3} />
                  </motion.div>
                )}

                {/* Name */}
                <div style={{ padding: '14px 16px' }}>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#2D2A26',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {template.name}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ─── Fixed Bottom Action Bar ─── */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(255, 251, 248, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid #F0E6DC',
      }}>
        <div style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              borderRadius: 12,
              border: '2px solid #F0E6DC',
              background: '#fff',
              color: '#4A4744',
              fontWeight: 700,
              fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
              cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div style={{ flex: 1, textAlign: 'center' }}>
            {selectedTemplate ? (
              <motion.p
                key={selectedTemplate.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  color: '#6B6560',
                  margin: 0,
                }}
              >
                Selected: <strong style={{ color: '#2D2A26' }}>{selectedTemplate.name}</strong>
              </motion.p>
            ) : (
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: '#9A938D',
                margin: 0,
              }}>No template selected</p>
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
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 28px',
              borderRadius: 12,
              border: 'none',
              background: selectedTemplate ? 'linear-gradient(135deg, #B8405E, #D4548F)' : '#E0D8D0',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
              cursor: selectedTemplate ? 'pointer' : 'not-allowed',
              boxShadow: selectedTemplate ? '0 6px 24px rgba(184, 64, 94, 0.35)' : 'none',
              opacity: selectedTemplate ? 1 : 0.5,
              transition: 'all 0.2s',
            }}
          >
            Continue
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
