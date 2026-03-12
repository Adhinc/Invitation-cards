import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Search, MapPin, Navigation, Check } from 'lucide-react';

interface MapPickerProps {
  onConfirm: (location: string, address: string) => void;
  onCancel: () => void;
}

const MapPicker: React.FC<MapPickerProps> = ({ onConfirm, onCancel }) => {
  const [search, setSearch] = useState('');
  const [selectedLocation] = useState({
    name: 'The Grand Palace',
    address: 'Panampilly Nagar, Kochi, Kerala, India'
  });

  const handleConfirm = () => {
    onConfirm(selectedLocation.name, selectedLocation.address);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-xl bg-white rounded-[32px] overflow-hidden flex flex-col shadow-2xl h-[80vh]">
        {/* Header with Search */}
        <div className="p-6 bg-white border-b border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="serif text-xl font-black text-slate-800">Select Venue Location</h2>
            <button onClick={onCancel} className="p-2 hover:bg-rose-50 rounded-full transition-colors text-slate-400">
              <X size={20} />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search for venue or landmark..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-[#C85C6C]/30 transition-all font-bold"
            />
          </div>
        </div>

        {/* Map Area (Simulated) */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200" 
            className="w-full h-full object-cover opacity-50 grayscale"
            alt="Map Background"
          />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#C85C6C_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
          
          {/* Pulse Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <div className="relative">
               <motion.div 
                 animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="absolute inset-0 bg-[#C85C6C] rounded-full"
               />
               <div className="relative w-4 h-4 bg-[#C85C6C] rounded-full border-2 border-white shadow-lg"></div>
               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-white px-4 py-2 rounded-xl shadow-xl border border-slate-100 flex flex-col items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#C85C6C] mb-0.5">Drop Pin Here</span>
                  <div className="w-2 h-2 bg-white rotate-45 border-r border-b border-slate-100 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
               </div>
             </div>
          </div>

          <button className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-[#C85C6C] hover:scale-105 transition-all">
             <Navigation size={20} />
          </button>
        </div>

        {/* Footer Info */}
        <div className="p-8 bg-white border-t border-slate-100">
           <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-[#C85C6C] flex-shrink-0">
                 <MapPin size={24} />
              </div>
              <div className="flex-1">
                 <h4 className="font-black text-slate-800 leading-tight">{selectedLocation.name}</h4>
                 <p className="text-xs text-slate-400 font-bold mt-1">{selectedLocation.address}</p>
              </div>
           </div>

           <div className="flex gap-4">
              <button onClick={onCancel} className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all">
                Change
              </button>
              <button 
                onClick={handleConfirm}
                className="flex-3 py-4 bg-[#C85C6C] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-rose-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Confirm Venue <Check size={18} />
              </button>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MapPicker;
