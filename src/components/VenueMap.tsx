import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface VenueMapProps {
  address: string;
  locationName: string;
  mapUrl: string;
}

const VenueMap: React.FC<VenueMapProps> = ({ address, locationName, mapUrl }) => {
  return (
    <div className="venue-map-container glass-card overflow-hidden mt-10">
      <div className="p-6 border-b border-white/10 flex justify-between items-center">
        <div>
          <h3 className="serif text-2xl text-gradient">{locationName}</h3>
          <p className="text-secondary text-sm flex items-center mt-1">
            <MapPin size={14} className="mr-1 text-accent" /> {address}
          </p>
        </div>
        <a 
          href={mapUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-premium text-xs py-2 px-4 flex items-center"
        >
          Directions <ExternalLink size={12} className="ml-1" />
        </a>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="relative h-[300px] w-full bg-dark/40 grayscale contrast-125"
      >
        <iframe
          title="Venue Location"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)" }}
          src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(address)}`}
          allowFullScreen
        />
        {/* Overlay for Aesthetic Grayscale Map Effect if API Key is missing */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-bg-dark/80 to-transparent" />
      </motion.div>
    </div>
  );
};

export default VenueMap;
