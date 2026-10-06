import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X, Eye, ShieldCheck, Car } from 'lucide-react';

export const VehicleGallery = ({ vehicle, activeColor }) => {
  const photos = (vehicle?.gallery && vehicle.gallery.length > 0)
    ? vehicle.gallery
    : [vehicle?.image_url].filter(Boolean);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Reset active index if vehicle changes
  useEffect(() => {
    setActiveIndex(0);
  }, [vehicle?.id]);

  const handlePrev = (e) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, photos.length]);

  if (!photos || photos.length === 0) {
    return (
      <div className="w-full h-80 sm:h-96 md:h-[480px] bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-slate-400 p-8 text-center border border-slate-800 shadow-sm space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-gold shadow-inner">
          <Car className="w-8 h-8 text-gold" />
        </div>
        <div>
          <h4 className="font-serif font-bold text-lg text-white">Photos en cours de prise de vue</h4>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Les clichés détaillés de ce véhicule sont en cours de traitement par notre équipe en concession.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col select-none">
      {/* Container Galerie : Miniatures verticales à gauche + Grande image à droite (comme sur la capture) */}
      <div className="flex flex-col-reverse md:flex-row gap-3 sm:gap-4 items-stretch">
        
        {/* Colonne des miniatures à gauche (Verticale sur desktop, Horizontale sur mobile) */}
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[500px] lg:max-h-[560px] pb-2 md:pb-0 md:pr-1 shrink-0 scrollbar-thin scrollbar-thumb-slate-300">
          {photos.map((photoUrl, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative w-20 h-14 sm:w-24 sm:h-16 md:w-24 md:h-16 rounded-md overflow-hidden bg-slate-100 shrink-0 transition-all duration-200 group focus:outline-none ${
                  isActive
                    ? 'ring-2 ring-[#4ea81e] ring-offset-1 ring-offset-white opacity-100 scale-[1.02] shadow-sm'
                    : 'opacity-70 hover:opacity-100 hover:ring-1 hover:ring-slate-300'
                }`}
                aria-label={`Photo ${idx + 1}`}
              >
                <img
                  src={photoUrl}
                  alt={`${vehicle?.title || 'Véhicule'} - Vue ${idx + 1}`}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {isActive && (
                  <div className="absolute inset-0 border-2 border-[#4ea81e] rounded-md pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>

        {/* Grande Image Principale */}
        <div className="relative flex-1 bg-slate-900 rounded-xl overflow-hidden min-h-[320px] sm:min-h-[420px] md:min-h-[480px] lg:min-h-[540px] flex items-center justify-center group shadow-md border border-slate-200/80">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={photos[activeIndex]}
              alt={`${vehicle?.title} - Vue principale`}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.2 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full object-cover object-center max-h-[580px] cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}
            />
          </AnimatePresence>

          {/* Badge 360° et Zoom (comme sur la capture en bas à droite) */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10 pointer-events-auto">
            <div className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1 border border-white/20 shadow-sm">
              <span className="text-white font-mono">360°</span>
              <span className="text-[10px] text-slate-300">EXT.</span>
            </div>
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="w-8 h-8 rounded-md bg-black/60 hover:bg-black/90 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-colors shadow-sm"
              title="Agrandir en plein écran"
              aria-label="Plein écran"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Badge Certification en haut à gauche */}
          <div className="absolute top-3 left-3 z-10 pointer-events-none flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-rolex/90 backdrop-blur-md text-gold text-xs font-bold uppercase tracking-wider border border-gold/40 shadow-sm flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Audit 150 Points Validé
            </span>
            {vehicle?.warranty && (
              <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium border border-white/10 hidden sm:inline-block">
                {vehicle.warranty}
              </span>
            )}
          </div>

          {/* Flèches de navigation Suivant / Précédent */}
          {photos.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-sm flex items-center justify-center transition-all opacity-80 hover:opacity-100 z-10"
                aria-label="Photo précédente"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-sm flex items-center justify-center transition-all opacity-80 hover:opacity-100 z-10"
                aria-label="Photo suivante"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          {/* Indicateur 1 / 8 photos */}
          <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-xs font-mono">
            {activeIndex + 1} / {photos.length} photos
          </div>
        </div>
      </div>

      {/* Lightbox / Plein écran Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg p-2 sm:p-6">
            {/* Bouton Fermer */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center transition-colors"
              aria-label="Fermer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Titre & Compteur */}
            <div className="absolute top-4 left-6 z-50 text-white">
              <h3 className="font-serif font-bold text-lg sm:text-xl text-white">
                {vehicle?.title}
              </h3>
              <p className="text-xs text-slate-400">
                Photo {activeIndex + 1} sur {photos.length}
              </p>
            </div>

            {/* Grande image Lightbox */}
            <div className="relative max-w-6xl w-full max-h-[85vh] flex items-center justify-center p-2">
              <img
                src={photos[activeIndex]}
                alt={`${vehicle?.title} - Agrandissement`}
                className="max-w-full max-h-[82vh] object-contain rounded-lg shadow-2xl"
              />

              {/* Navigation Lightbox */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 sm:-left-14 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md flex items-center justify-center transition-all"
                    aria-label="Précédent"
                  >
                    <ChevronLeft className="w-7 h-7" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 sm:-right-14 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md flex items-center justify-center transition-all"
                    aria-label="Suivant"
                  >
                    <ChevronRight className="w-7 h-7" />
                  </button>
                </>
              )}
            </div>

            {/* Miniatures au bas de la Lightbox */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-3xl w-full px-4 flex justify-center gap-2 overflow-x-auto py-2">
              {photos.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-14 h-10 rounded overflow-hidden shrink-0 transition-all ${
                    activeIndex === idx
                      ? 'ring-2 ring-[#4ea81e] scale-110 opacity-100'
                      : 'opacity-50 hover:opacity-90'
                  }`}
                >
                  <img src={p} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
