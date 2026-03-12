import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface VenueMapProps {
  address: string;
  locationName: string;
  coords?: { lat: number; lng: number };
}

const VenueMap: React.FC<VenueMapProps> = ({ address, locationName, coords }) => {
  const mapSrc = coords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.008},${coords.lat - 0.005},${coords.lng + 0.008},${coords.lat + 0.005}&layer=mapnik&marker=${coords.lat},${coords.lng}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=76.27,9.96,76.30,9.99&layer=mapnik`;

  const directionsUrl = coords
    ? `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

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
          href={directionsUrl}
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
        className="relative h-[300px] w-full"
      >
        <iframe
          title="Venue Location"
          width="100%"
          height="100%"
          frameBorder="0"
          src={mapSrc}
          className="border-0"
        />
      </motion.div>
    </div>
  );
};

export default VenueMap;
