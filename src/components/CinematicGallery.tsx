import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface GalleryProps {
  images: string[];
  maxPhotos?: number;
  tier?: 'Basic' | 'Standard' | 'Premium';
}

const CinematicGallery: React.FC<GalleryProps> = ({ images, maxPhotos = 50, tier = 'Premium' }) => {
  const limitedImages = images.slice(0, maxPhotos);

  return (
    <div className="cinematic-gallery-container w-full overflow-hidden rounded-3xl glass-card">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        className="h-[500px] w-full"
      >
        {limitedImages.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full">
              <img
                src={src}
                alt={`Gallery ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute bottom-10 left-10"
              >
                <h3 className="text-3xl text-white font-bold">Moments of Love</h3>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Photo count & tier info */}
      <div className="px-6 py-3 flex items-center justify-between bg-white/80 border-t border-gray-100">
        <div className="flex items-center gap-2 text-slate-400">
          <ImageIcon size={14} />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {limitedImages.length} / {maxPhotos} photos
          </span>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider text-gray-900/60">
          {tier} Gallery
        </span>
      </div>
    </div>
  );
};

export default CinematicGallery;
