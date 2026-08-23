import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Star, ChevronLeft, ChevronRight, CheckCircle2, Award, Quote } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { testimonialsService } from '../../services/testimonialsService';

// Import des styles Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export const TestimonialsSlider = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const loadTestimonials = async () => {
      const data = await testimonialsService.getAllTestimonials();
      setTestimonials(data || []);
    };
    loadTestimonials();
  }, []);

  return (
    <section className="py-20 lg:py-28 bg-rolex-dark text-white relative overflow-hidden border-t border-gold/20">
      {/* Motifs géométriques subtils */}
      <div className="absolute inset-0 bg-[radial-gradient(#C6A15B_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeader
            dark
            align="left"
            badge="Avis & Témoignages"
            title="La Confiance de nos Clients en France"
            subtitle="Découvrez les retours d'expérience authentiques d'acquéreurs partout en France qui ont concrétisé leur achat à nos côtés."
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

        {/* Swiper Carousel Défilant */}
        {testimonials.length > 0 && (
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            speed={750}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
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
            loop={testimonials.length >= 3}
            className="pb-16"
          >
            {testimonials.map((item) => (
              <SwiperSlide key={item.id || item.client_name} className="h-auto">
                <div className="h-full p-6 sm:p-8 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-gold/30 hover:border-gold transition-all duration-300 flex flex-col justify-between shadow-xl relative group">
                  <div>
                    {/* Étoiles & Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex text-gold gap-1">
                        {[...Array(item.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                        ))}
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-rolex/80 text-gold-light text-[10px] font-semibold border border-gold/30">
                        {item.tag || 'Achat Vérifié'}
                      </span>
                    </div>

                    {/* Modèle de voiture */}
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
                      src={item.avatar_url || item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=75'}
                      alt={item.client_name}
                      loading="lazy"
                      decoding="async"
                      width="44"
                      height="44"
                      className="w-11 h-11 rounded-full object-cover border border-gold/40 shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        {item.client_name}
                        {(item.is_verified || item.verified) && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </h4>
                      <p className="text-xs text-slate-400">{item.client_city} • {item.date || 'Février 2026'}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};
