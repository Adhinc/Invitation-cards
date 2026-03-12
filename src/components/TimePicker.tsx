import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronUp, ChevronDown } from 'lucide-react';

interface TimePickerProps {
  onSelect: (timeStr: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ onSelect }) => {
  const [hour, setHour] = useState(10);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  const incHour = () => setHour(h => h >= 12 ? 1 : h + 1);
  const decHour = () => setHour(h => h <= 1 ? 12 : h - 1);
  const incMin = () => setMinute(m => m >= 55 ? 0 : m + 5);
  const decMin = () => setMinute(m => m <= 0 ? 55 : m - 5);

  const handleConfirm = () => {
    const hh = String(hour).padStart(2, '0');
    const mm = String(minute).padStart(2, '0');
    onSelect(`${hh}:${mm} ${period}`);
  };

  const SpinButton = ({ direction, onClick }: { direction: 'up' | 'down'; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="p-1 rounded-lg hover:bg-rose-50 text-slate-300 hover:text-[#C85C6C] transition-colors"
    >
      {direction === 'up' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 bg-white rounded-2xl border border-rose-100 p-5 shadow-sm max-w-[280px]"
    >
      <div className="flex items-center justify-center gap-3">
        {/* Hour */}
        <div className="flex flex-col items-center gap-1">
          <SpinButton direction="up" onClick={incHour} />
          <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-2xl font-black text-slate-700">
            {String(hour).padStart(2, '0')}
          </div>
          <SpinButton direction="down" onClick={decHour} />
          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider mt-0.5">Hour</span>
        </div>

        <span className="text-2xl font-black text-slate-300 mb-6">:</span>

        {/* Minute */}
        <div className="flex flex-col items-center gap-1">
          <SpinButton direction="up" onClick={incMin} />
          <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-2xl font-black text-slate-700">
            {String(minute).padStart(2, '0')}
          </div>
          <SpinButton direction="down" onClick={decMin} />
          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider mt-0.5">Min</span>
        </div>

        {/* AM/PM Toggle */}
        <div className="flex flex-col gap-1.5 ml-2 mb-6">
          <button
            onClick={() => setPeriod('AM')}
            className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              period === 'AM'
                ? 'bg-[#C85C6C] text-white shadow-sm'
                : 'bg-slate-50 text-slate-300 border border-slate-100 hover:border-[#C85C6C]/30 hover:text-[#C85C6C]'
            }`}
          >
            AM
          </button>
          <button
            onClick={() => setPeriod('PM')}
            className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              period === 'PM'
                ? 'bg-[#C85C6C] text-white shadow-sm'
                : 'bg-slate-50 text-slate-300 border border-slate-100 hover:border-[#C85C6C]/30 hover:text-[#C85C6C]'
            }`}
          >
            PM
          </button>
        </div>
      </div>

      {/* Confirm */}
      <button
        onClick={handleConfirm}
        className="mt-4 w-full py-2.5 bg-[#C85C6C] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:bg-[#b04b5a] active:scale-[0.98] transition-all"
      >
        Set Time <Check size={12} />
      </button>
    </motion.div>
  );
};

export default TimePicker;
