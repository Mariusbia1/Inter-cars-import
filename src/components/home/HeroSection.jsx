import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, Award, Sparkles, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { LuxuryButton } from '../common/LuxuryButton';

export const HeroSection = () => {
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1400&q=75',
      badge: "Vente de Véhicules d'Occasion Certifiés",
      title: "L'Exigence Automobile",
      highlight: 'En France.',
      subtitle: "Vente de véhicules d'occasion audités en 150 points de contrôle, issus de notre réseau exclusif de concessions partenaires en France."
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1400&q=75',
      badge: 'Réseau Partenaire Exclusif en France',
      title: 'Des Véhicules Sélectionnés',
      highlight: 'Avec Rigueur.',
      subtitle: "Sportives, berlines et SUV soigneusement contrôlés, garantis avec historique constructeur vérifié et prêts à prendre la route."
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1400&q=75',
      badge: 'Service Clé en Main',
      title: 'La Sérénité Absolue',
      highlight: 'De A à Z.',
      subtitle: "Prise en charge intégrale des formalités administratives, carte grise et livraison sécurisée directement chez vous ou en showroom."
    }
  ];

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[current];

  return (
    <section
      className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center pt-32 sm:pt-36 pb-16 overflow-hidden bg-rolex-dark select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Carousel - Lumineux et net */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide.id}
            src={currentSlide.image}
            alt={currentSlide.title}
            decoding="async"
            fetchPriority="high"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.05]"
          />
        </AnimatePresence>

        {/* Dégradé fluide sombre sans flash */}
        <div className="absolute inset-0 bg-gradient-to-r from-rolex-dark/90 via-rolex-dark/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-rolex-dark/80 via-transparent to-rolex-dark/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl space-y-5 sm:space-y-6">
          {/* Badge Supérieur */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`badge-${currentSlide.id}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rolex-forest/90 border border-gold/50 text-gold text-xs font-bold uppercase tracking-widest shadow-gold-glow backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>{currentSlide.badge}</span>
            </motion.div>
          </AnimatePresence>

          {/* Titre Principal */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`title-${currentSlide.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight tracking-tight"
            >
              {currentSlide.title} <br />
              <span className="text-gold-gradient">{currentSlide.highlight}</span>
            </motion.h1>
          </AnimatePresence>

          {/* Sous-titre */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${currentSlide.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed font-light max-w-2xl"
            >
              {currentSlide.subtitle}
            </motion.p>
          </AnimatePresence>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2"
          >
            <LuxuryButton
              to="/contact"
              variant="gold"
              size="md"
              icon={ArrowRight}
              className="shadow-gold-glow font-bold tracking-wider text-xs sm:text-sm"
            >
              Démarrer mon projet
            </LuxuryButton>

            <LuxuryButton
              to="/vehicules-livres"
              variant="outline-white"
              size="md"
              className="font-semibold tracking-wider text-xs sm:text-sm"
            >
              Explorer les véhicules disponibles
            </LuxuryButton>
          </motion.div>

          {/* Micro-piliers de réassurance */}
          <div className="pt-4 sm:pt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-white/15 text-xs text-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
              <span>Achat & Vente Sécurisés</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
              <span>Audit 150 points certifié</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <Award className="w-4 h-4 text-gold shrink-0" />
              <span>180+ véhicules livrés</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Flèches & Indicateurs */}
      <div className="absolute bottom-6 sm:bottom-10 right-4 sm:right-10 z-20 flex items-center gap-3">
        <button
          onClick={prevSlide}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-rolex border border-white/20 hover:border-gold text-white flex items-center justify-center transition-all backdrop-blur-sm shadow-sm"
          aria-label="Slide précédent"
        >
          <ChevronLeft className="w-4 h-4 text-gold" />
        </button>

        <div className="flex items-center gap-1.5">
          {slides.map((s, index) => (
            <button
              key={s.id}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === index
                  ? 'w-7 bg-gold shadow-gold-glow'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-rolex border border-white/20 hover:border-gold text-white flex items-center justify-center transition-all backdrop-blur-sm shadow-sm"
          aria-label="Slide suivant"
        >
          <ChevronRight className="w-4 h-4 text-gold" />
        </button>
      </div>
    </section>
  );
};
