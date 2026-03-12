import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface DatePickerProps {
  onSelect: (dateStr: string) => void;
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const DatePicker: React.FC<DatePickerProps> = ({ onSelect }) => {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selected, setSelected] = useState<Date | null>(null);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const isPast = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return d < t;
  };

  const isSelected = (day: number) =>
    selected?.getDate() === day && selected?.getMonth() === viewMonth && selected?.getFullYear() === viewYear;

  const isToday = (day: number) =>
    today.getDate() === day && today.getMonth() === viewMonth && today.getFullYear() === viewYear;

  const handleConfirm = () => {
    if (!selected) return;
    const yyyy = selected.getFullYear();
    const mm = String(selected.getMonth() + 1).padStart(2, '0');
    const dd = String(selected.getDate()).padStart(2, '0');
    onSelect(`${yyyy}-${mm}-${dd}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 bg-white rounded-2xl border border-rose-100 p-4 shadow-sm max-w-[300px]"
    >
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-rose-50 transition-colors text-slate-400 hover:text-[#C85C6C]">
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-bold text-slate-700">{MONTHS[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-rose-50 transition-colors text-slate-400 hover:text-[#C85C6C]">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-slate-300 uppercase">{d}</div>
        ))}
      </div>

      {/* Day Grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
          <button
            key={day}
            disabled={isPast(day)}
            onClick={() => setSelected(new Date(viewYear, viewMonth, day))}
            className={`w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center
              ${isPast(day) ? 'text-slate-200 cursor-not-allowed' : 'hover:bg-rose-50 hover:text-[#C85C6C] cursor-pointer'}
              ${isSelected(day) ? 'bg-[#C85C6C] text-white hover:bg-[#b04b5a] hover:text-white shadow-sm' : ''}
              ${isToday(day) && !isSelected(day) ? 'border border-[#C85C6C]/30 text-[#C85C6C]' : 'text-slate-600'}
            `}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Confirm */}
      {selected && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400">
            {selected.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 bg-[#C85C6C] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#b04b5a] active:scale-95 transition-all"
          >
            Confirm <Check size={12} />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DatePicker;
