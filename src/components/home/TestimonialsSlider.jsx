import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2, Award } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { testimonialsList } from '../../data/testimonialsData';

// Import des styles Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export const TestimonialsSlider = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="py-20 lg:py-28 bg-rolex-dark text-white relative overflow-hidden border-t border-gold/20">
      {/* Motifs géométriques subtils */}
      <div className="absolute inset-0 bg-[radial-gradient(#C6A15B_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeader
            dark
            align="left"
            badge="Témoignages Clients"
            title="La Confiance de nos Acquéreurs"
            subtitle="Découvrez les retours d'expérience de passionnés et dirigeants qui ont franchi le pas de l'importation à nos côtés."
            className="mb-0 max-w-2xl"
          />

          {/* Boutons de navigation personnalisés */}
          <div className="flex items-center gap-3 mt-6 md:mt-0">
            <button
              ref={prevRef}
              className="w-12 h-12 rounded-full bg-white/5 hover:bg-rolex border border-white/20 hover:border-gold text-white flex items-center justify-center transition-all duration-200 shadow-md group cursor-pointer"
              aria-label="Témoignage précédent"
            >
              <ChevronLeft className="w-5 h-5 text-slate-300 group-hover:text-gold transition-colors" />
            </button>
            <button
              ref={nextRef}
              className="w-12 h-12 rounded-full bg-white/5 hover:bg-rolex border border-white/20 hover:border-gold text-white flex items-center justify-center transition-all duration-200 shadow-md group cursor-pointer"
              aria-label="Témoignage suivant"
            >
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-gold transition-colors" />
            </button>
          </div>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true, // Pause automatique au survol de la souris !
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          loop={true}
          className="pb-16"
        >
          {testimonialsList.map((item) => (
            <SwiperSlide key={item.id} className="h-auto">
              <div className="h-full p-6 sm:p-8 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-gold/30 hover:border-gold transition-all duration-300 flex flex-col justify-between shadow-xl">
                <div>
                  {/* Étoiles & Badge de vérification */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-gold gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                      ))}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-rolex/80 text-gold-light text-[10px] font-semibold border border-gold/30">
                      {item.tag}
                    </span>
                  </div>

                  {/* Modèle de voiture importé */}
                  <div className="mb-4 text-xs font-serif font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>{item.vehicle_model}</span>
                  </div>

                  {/* Commentaire client */}
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic mb-6">
                    "{item.comment}"
                  </p>
                </div>

                {/* Profil Client */}
                <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.client_name}
                    className="w-11 h-11 rounded-full object-cover border border-gold/40 shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {item.client_name}
                      {item.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </h4>
                    <p className="text-xs text-slate-400">{item.client_city} • {item.date}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
