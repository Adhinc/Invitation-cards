import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, CreditCard } from 'lucide-react';

interface ShagunProps {
  upiId: string;
  recipientName: string;
}

const Shagun: React.FC<ShagunProps> = ({ upiId, recipientName }) => {
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(recipientName)}&cu=INR`;

  return (
    <div className="shagun-container bg-white border border-rose-100 p-8 text-center mt-12 rounded-[32px] shadow-sm">
      <h3 className="serif text-4xl mb-6 text-[#C85C6C] font-black italic">Gifts & Shagun</h3>
      <p className="text-slate-400 mb-10 max-w-xs mx-auto text-sm font-bold leading-relaxed">
        Your presence is the greatest gift, but if you wish to send a token of love:
      </p>
      
      <div className="flex flex-col gap-6">
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href={upiUrl}
          className="btn-premium flex items-center justify-center gap-3 py-5 shadow-lg shadow-rose-100"
        >
          <Smartphone size={20} className="stroke-[3]" /> Send via UPI
        </motion.a>
        
        <div className="text-[10px] text-slate-300 font-black uppercase tracking-[0.3em] mt-2">
          Scan or Click to Pay
        </div>
        
        <div className="bg-slate-50 p-6 rounded-[32px] w-48 h-48 mx-auto mt-4 border border-slate-100 flex items-center justify-center relative overflow-hidden">
           <div className="absolute inset-0 bg-[#C85C6C]/5 opacity-20"></div>
           <div className="relative z-10 text-slate-300 text-[10px] text-center font-bold">
              <CreditCard size={48} className="mx-auto mb-3 opacity-30 text-[#C85C6C]" />
              Secure Payment Gateway
           </div>
        </div>
        
        <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase mt-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
           {upiId}
        </p>
      </div>
    </div>
  );
};

export default Shagun;
