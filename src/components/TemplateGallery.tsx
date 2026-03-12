import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, ShieldCheck } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  tier: 'Basic' | 'Standard' | 'Premium';
  price: number;
  previewUrl: string;
  features: string[];
}

const TEMPLATES: Template[] = [
  {
    id: 'midnight',
    name: 'Midnight Constellation',
    tier: 'Premium',
    price: 699,
    previewUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    features: ['Advanced Customization', 'Personalized website link', 'Countdown timer', 'Action buttons & sections', 'Exclusive premium templates', 'Multiple inline components', 'YouTube Integration', 'Photo gallery up to 50 photos', '24/7 Support']
  },
  {
    id: 'lavender',
    name: 'Lavender Fields',
    tier: 'Standard',
    price: 399,
    previewUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
    features: ['Standard Customization', 'Personalized link', 'Countdown timer', 'Photo gallery up to 20 photos']
  }
];

const TemplateGallery: React.FC<{ onFinish: (template: Template) => void }> = ({ onFinish }) => {
  const [selectedTier, setSelectedTier] = useState<'Basic' | 'Standard' | 'Premium'>('Premium');
  const [activeTemplate] = useState<Template>(TEMPLATES[0]);

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 flex flex-col md:flex-row gap-8 bg-[#FFF9F5]">
      {/* Main View Area */}
      <div className="flex-1 flex flex-col items-center">
        <div className="mb-8 flex gap-4">
          {['Basic', 'Standard', 'Premium'].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier as any)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                selectedTier === tier 
                ? 'bg-[#C85C6C] text-white shadow-lg' 
                : 'bg-white text-slate-400 border border-slate-100 hover:border-[#C85C6C]/30'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

        {/* Shadow Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[700px] bg-rose-100/30 blur-[100px] rounded-full z-0" />
        
        {/* Phone Mockup Frame */}
        <motion.div 
          initial={{ opacity: 0, y: 50, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-[340px] h-[680px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-[0_50px_100px_rgba(200,92,108,0.15)] overflow-hidden z-10"
        >
           {/* Screen Content */}
           <div className="absolute inset-0 bg-[#0A0A0A] overflow-y-auto scrollbar-hide">
              <img src={activeTemplate.previewUrl} className="w-full h-[400px] object-cover opacity-80" alt="Preview" />
              <div className="p-8 text-center">
                <h3 className="serif text-white text-3xl mb-4 italic">Two hearts, one love</h3>
                <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto mb-6"></div>
                <p className="text-white/60 uppercase tracking-[0.2em] text-xs font-light">Together with their families</p>
              </div>
           </div>
           {/* Glossy Overlay */}
           <div className="absolute inset-0 pointer-events-none border-[1px] border-white/10 rounded-[2.5rem]"></div>
        </motion.div>
      </div>

      {/* Sidebar Review */}
      <div className="w-full md:w-[420px] bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="serif text-2xl font-black text-slate-800">{activeTemplate.name}</h2>
            <p className="text-slate-400 text-sm mt-1">A romantic design crafted for special souls.</p>
          </div>
          <div className="bg-emerald-500 text-white px-3 py-1 rounded-lg font-bold text-sm shadow-sm">
            ₹{activeTemplate.price}
          </div>
        </div>

        <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-800">Free Trial for 1 day.</p>
            <p className="text-[10px] text-emerald-600">Activate if you like it at ₹{activeTemplate.price} one time payment.</p>
          </div>
        </div>

        <div className="flex-1">
           <h4 className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-6 flex items-center gap-2">
             <Star size={12} className="text-[#C85C6C]" />
             {activeTemplate.tier} experience with all features unlocked
           </h4>
           <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              {activeTemplate.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-md bg-[#C85C6C] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={12} className="text-white stroke-[4]" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 leading-snug">{f}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="mt-12 flex gap-4">
          <button className="flex-1 py-4 bg-white border-2 border-slate-100 rounded-2xl text-slate-800 font-black text-sm uppercase tracking-widest hover:border-rose-200 transition-all">
             Change Theme
          </button>
          <button 
            onClick={() => onFinish(activeTemplate)}
            className="flex-1 py-4 bg-[#C85C6C] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-rose-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
             Continue to Chatbot <Check size={18} className="stroke-[3]" />
          </button>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-2">
          <div className="flex -space-x-2">
            {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"></div>)}
          </div>
          <p className="text-[10px] font-bold text-slate-400 tracking-tight">Trusted by <span className="text-emerald-500">4500+ happy customers</span></p>
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;
