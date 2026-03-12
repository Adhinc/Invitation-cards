import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, MapPin, Navigation, Check, Loader2 } from 'lucide-react';

interface MapPickerProps {
  onConfirm: (location: string, address: string, coords: { lat: number; lng: number }) => void;
  onCancel: () => void;
}

interface SearchResult {
  place_id: number;
  display_name: string;
  name: string;
  lat: string;
  lon: string;
}

const MapPicker: React.FC<MapPickerProps> = ({ onConfirm, onCancel }) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<{ name: string; address: string; lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchPlaces = useCallback(async (query: string) => {
    if (query.length < 3) { setResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data: SearchResult[] = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    }
    setSearching(false);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchPlaces(value), 400);
  };

  const selectResult = (r: SearchResult) => {
    const parts = r.display_name.split(', ');
    const name = r.name || parts[0];
    setSelected({ name, address: r.display_name, lat: parseFloat(r.lat), lng: parseFloat(r.lon) });
    setResults([]);
    setSearch(name);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const name = data.name || data.address?.road || 'My Location';
          setSelected({ name, address: data.display_name, lat: latitude, lng: longitude });
          setSearch(name);
        } catch {
          setSelected({ name: 'My Location', address: `${latitude}, ${longitude}`, lat: latitude, lng: longitude });
        }
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true }
    );
  };

  const handleConfirm = () => {
    if (!selected) return;
    onConfirm(selected.name, selected.address, { lat: selected.lat, lng: selected.lng });
  };

  const mapEmbedUrl = selected
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${selected.lng - 0.005},${selected.lat - 0.003},${selected.lng + 0.005},${selected.lat + 0.003}&layer=mapnik&marker=${selected.lat},${selected.lng}`
    : null;

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
          <div className="flex justify-between items-center mb-4">
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
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-[#C85C6C]/30 transition-all font-bold"
            />
            {searching && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C85C6C] animate-spin" size={18} />
            )}
          </div>

          {/* Search Results */}
          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-2 bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-lg max-h-[200px] overflow-y-auto"
              >
                {results.map((r) => (
                  <button
                    key={r.place_id}
                    onClick={() => selectResult(r)}
                    className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-rose-50/50 transition-colors border-b border-slate-50 last:border-0"
                  >
                    <MapPin size={14} className="text-[#C85C6C] mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-700 truncate">{r.name || r.display_name.split(',')[0]}</p>
                      <p className="text-[11px] text-slate-400 truncate">{r.display_name}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Map Area */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden">
          {mapEmbedUrl ? (
            <iframe
              title="Selected Location"
              src={mapEmbedUrl}
              className="w-full h-full border-0"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-4">
              <MapPin size={40} strokeWidth={1} />
              <p className="text-sm font-bold">Search for a venue above</p>
            </div>
          )}

          {/* My Location Button */}
          <button
            onClick={useMyLocation}
            disabled={locating}
            className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-[#C85C6C] hover:scale-105 transition-all disabled:opacity-50"
          >
            {locating ? <Loader2 size={20} className="animate-spin" /> : <Navigation size={20} />}
          </button>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-slate-100">
          {selected ? (
            <>
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-[#C85C6C] flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-slate-800 text-sm leading-tight">{selected.name}</h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5 line-clamp-2">{selected.address}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setSelected(null); setSearch(''); }} className="flex-1 py-3.5 bg-slate-50 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">
                  Change
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-[2] py-3.5 bg-[#C85C6C] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Confirm Venue <Check size={16} />
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-sm text-slate-300 font-bold py-2">Search or use your current location to pick a venue</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MapPicker;
