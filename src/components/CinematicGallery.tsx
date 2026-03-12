import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface GalleryProps {
  images: string[];
}

const CinematicGallery: React.FC<GalleryProps> = ({ images }) => {
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
        {images.map((src, index) => (
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
                <h3 className="serif text-3xl text-white">Moments of Love</h3>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CinematicGallery;
