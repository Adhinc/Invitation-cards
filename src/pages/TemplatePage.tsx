import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowLeft, ArrowRight, Sparkles, Star, Crown } from 'lucide-react';
import { getEventByType } from '../constants/events';

type Category = 'basic' | 'standard' | 'premium';

interface Template {
  id: string;
  name: string;
  image: string;
  category: Category;
}

const TEMPLATES: Template[] = [
  // Basic
  { id: 'midnight', name: 'Midnight Constellation', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400', category: 'basic' },
  { id: 'blossom', name: 'Simple Blossom', image: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=400', category: 'basic' },
  { id: 'ivory', name: 'Ivory Classic', image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400', category: 'basic' },
  { id: 'pastel', name: 'Pastel Dreams', image: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400', category: 'basic' },

  // Standard
  { id: 'lavender', name: 'Lavender Fields', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400', category: 'standard' },
  { id: 'minimal', name: 'Modern Minimal', image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400', category: 'standard' },
  { id: 'rustic', name: 'Rustic Charm', image: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=400', category: 'standard' },
  { id: 'botanical', name: 'Botanical Garden', image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400', category: 'standard' },
  { id: 'ocean', name: 'Ocean Breeze', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400', category: 'standard' },

  // Premium
  { id: 'golden', name: 'Golden Hour', image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400', category: 'premium' },
  { id: 'royal', name: 'Royal Elegance', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', category: 'premium' },
  { id: 'velvet', name: 'Velvet Rose', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400', category: 'premium' },
  { id: 'dynasty', name: 'Dynasty Gold', image: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=400', category: 'premium' },
  { id: 'enchanted', name: 'Enchanted Night', image: 'https://images.unsplash.com/photo-1470290378698-263fa7ca60ab?w=400', category: 'premium' },
];

const CATEGORIES: { key: Category; label: string; icon: typeof Star; description: string; color: string; bg: string; border: string }[] = [
  { key: 'basic', label: 'Basic', icon: Star, description: 'Clean & simple designs', color: '#6B7280', bg: '#F3F4F6', border: '#D1D5DB' },
  { key: 'standard', label: 'Standard', icon: Sparkles, description: 'Elegant & refined styles', color: '#B8405E', bg: '#FFF0F4', border: 'rgba(184, 64, 94, 0.3)' },
  { key: 'premium', label: 'Premium', icon: Crown, description: 'Luxury & exclusive designs', color: '#B8860B', bg: '#FFF8E7', border: 'rgba(184, 134, 11, 0.3)' },
];

export function Component() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, eventType } = (location.state as { formData?: unknown; eventType?: string }) || {};

  const stored = !formData ? JSON.parse(sessionStorage.getItem('inviteFormData') || 'null') : null;
  const actualFormData = formData || stored;
  const actualEventType = eventType || stored?.eventType;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('basic');

  if (!actualFormData) return <Navigate to="/" replace />;

  const event = getEventByType(actualEventType as Parameters<typeof getEventByType>[0]);
  const selectedTemplate = TEMPLATES.find((t) => t.id === selectedId);
  const filteredTemplates = TEMPLATES.filter((t) => t.category === activeCategory);
  const activeCat = CATEGORIES.find((c) => c.key === activeCategory)!;

  return (
    <div style={{ background: '#FFFBF8', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: '80px 24px 24px', textAlign: 'center' }}>
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
              fontFamily: "'Nunito Sans', sans-serif",
              background: '#FFF0F4',
              color: '#B8405E',
              border: '1px solid rgba(184, 64, 94, 0.2)',
            }}>
              {event.label}
            </span>
          )}
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 36,
            fontWeight: 600,
            color: '#1F1A1B',
            marginBottom: 8,
          }}>
            Choose Your <span style={{ color: '#B8405E' }}>Template</span>
          </h1>
          <p style={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: 16,
            color: '#4A4044',
            maxWidth: 420,
            margin: '0 auto',
          }}>
            Pick a design that matches your celebration's vibe
          </p>
        </motion.div>
      </div>

      {/* Category Tabs */}
      <div style={{ padding: '0 24px 8px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <div style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;
            const Icon = cat.icon;
            return (
              <motion.button
                key={cat.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveCategory(cat.key)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 24px',
                  borderRadius: 14,
                  border: `2px solid ${isActive ? cat.color : '#E8E0D8'}`,
                  background: isActive ? cat.bg : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  boxShadow: isActive ? `0 4px 16px ${cat.color}22` : '0 1px 4px rgba(0,0,0,0.04)',
                }}
              >
                <Icon size={18} color={isActive ? cat.color : '#9A938D'} strokeWidth={2.2} />
                <div style={{ textAlign: 'left' }}>
                  <p style={{
                    fontFamily: "'Nunito Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    color: isActive ? cat.color : '#4A4044',
                    margin: 0,
                    lineHeight: 1.2,
                  }}>
                    {cat.label}
                  </p>
                  <p style={{
                    fontFamily: "'Nunito Sans', sans-serif",
                    fontSize: 11,
                    color: isActive ? cat.color : '#9A938D',
                    margin: 0,
                    opacity: 0.8,
                    lineHeight: 1.2,
                  }}>
                    {cat.description}
                  </p>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="categoryIndicator"
                    style={{
                      position: 'absolute',
                      bottom: -2,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 32,
                      height: 3,
                      borderRadius: 2,
                      background: cat.color,
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Template count */}
        <p style={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: 13,
          color: '#9A938D',
          textAlign: 'center',
          margin: '16px 0 0',
        }}>
          {filteredTemplates.length} templates in <span style={{ color: activeCat.color, fontWeight: 600 }}>{activeCat.label}</span>
        </p>
      </div>

      {/* Template Grid */}
      <div style={{ flex: 1, padding: '16px 24px 140px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 24,
            }}
          >
            {filteredTemplates.map((template, i) => {
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
                    border: isSelected ? `3px solid ${activeCat.color}` : '3px solid transparent',
                    boxShadow: isSelected
                      ? `0 8px 24px ${activeCat.color}33`
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

                  {/* Category badge */}
                  <div style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    padding: '4px 10px',
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(8px)',
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    fontFamily: "'Nunito Sans', sans-serif",
                    color: activeCat.color,
                  }}>
                    {activeCat.label}
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
                        background: activeCategory === 'premium'
                          ? 'linear-gradient(135deg, #B8860B, #DAA520)'
                          : activeCategory === 'basic'
                            ? 'linear-gradient(135deg, #6B7280, #9CA3AF)'
                            : 'linear-gradient(135deg, #B8405E, #D4548F)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 12px ${activeCat.color}66`,
                      }}
                    >
                      <Check size={16} color="#fff" strokeWidth={3} />
                    </motion.div>
                  )}

                  {/* Name */}
                  <div style={{ padding: '14px 16px' }}>
                    <p style={{
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#1F1A1B',
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
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Action Bar */}
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
              fontFamily: "'Nunito Sans', sans-serif",
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
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontSize: 14,
                  color: '#4A4044',
                  margin: 0,
                }}
              >
                Selected: <strong style={{ color: '#1F1A1B' }}>{selectedTemplate.name}</strong>
                <span style={{
                  marginLeft: 8,
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  background: activeCat.bg,
                  color: activeCat.color,
                  border: `1px solid ${activeCat.border}`,
                }}>
                  {selectedTemplate.category}
                </span>
              </motion.p>
            ) : (
              <p style={{
                fontFamily: "'Nunito Sans', sans-serif",
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
              fontFamily: "'Nunito Sans', sans-serif",
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
