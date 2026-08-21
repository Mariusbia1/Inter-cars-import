import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, CheckCircle2, MapPin, Gauge, Zap, Calendar, Award, ExternalLink, Wrench } from 'lucide-react';
import { LuxuryButton } from './LuxuryButton';

export const VehicleModal = ({ vehicle, onClose, onOpenQuotation }) => {
  if (!vehicle) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-gold/30 my-8 max-h-[90vh] flex flex-col"
        >
          {/* Header Image */}
          <div className="relative h-72 sm:h-96 w-full bg-black shrink-0">
            <img
              src={vehicle.image_url}
              alt={vehicle.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            {/* Bouton Fermer */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-rolex text-white border border-white/20 flex items-center justify-center transition-all duration-200"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badges & Titre */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-3 py-1 rounded bg-rolex text-white text-xs font-semibold uppercase tracking-wider border border-gold/40">
                  {vehicle.category}
                </span>
                <span className="px-3 py-1 rounded bg-black/60 backdrop-blur-md text-gold text-xs font-semibold border border-gold/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Audit 150 Points Validé
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-2">
                {vehicle.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gold" /> Provenance : {vehicle.origin_country}
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-gold" /> Livré à : {vehicle.delivery_city}
                </span>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
            {/* Bloc Certification & Garantie (Zéro Prix) */}
            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-rolex-dark to-rolex-forest text-white border border-gold/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-rolex border border-gold/40 flex items-center justify-center shrink-0 text-gold shadow-gold-glow">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gold uppercase tracking-wider">Certification & Traçabilité</h4>
                  <p className="text-lg sm:text-xl font-serif font-bold text-white">
                    {vehicle.certification || 'Concession Officielle Agréée'}
                  </p>
                </div>
              </div>
              <div className="text-xs text-slate-300 sm:text-right">
                <p className="text-emerald-400 font-semibold">{vehicle.warranty || 'Historique & Carnet Certifiés'}</p>
                <p className="text-slate-300 font-light">Audit 150 points d'inspection certifié</p>
              </div>
            </div>

            {/* Grille des caractéristiques techniques */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rolex" /> Fiche Technique Certifiée
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-xs text-slate-400 block mb-1">Mise en circulation</span>
                  <span className="font-bold text-slate-800">{vehicle.year}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-xs text-slate-400 block mb-1">Kilométrage certifié</span>
                  <span className="font-bold text-slate-800">{vehicle.mileage?.toLocaleString('fr-FR')} km</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-xs text-slate-400 block mb-1">Motorisation</span>
                  <span className="font-bold text-slate-800">{vehicle.engine}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-xs text-slate-400 block mb-1">Puissance</span>
                  <span className="font-bold text-gold-dark">{vehicle.power_hp} chevaux</span>
                </div>
              </div>
            </div>

            {/* Avis du client */}
            {vehicle.client_review && (
              <div className="p-5 rounded-xl bg-surface border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-rolex text-gold font-serif font-bold text-xs flex items-center justify-center">
                      {vehicle.client_name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">{vehicle.client_name}</h5>
                      <p className="text-xs text-slate-500">Acquéreur Inter Cars Import ({vehicle.client_city})</p>
                    </div>
                  </div>
                  <div className="flex text-gold">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  "{vehicle.client_review}"
                </p>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 text-center sm:text-left">
              Vous recherchez une configuration similaire ? Notre conciergerie lance la recherche sous 48h.
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <LuxuryButton
                onClick={() => {
                  onClose();
                  if (onOpenQuotation) onOpenQuotation(vehicle);
                }}
                to="/contact"
                variant="gold"
                size="md"
                className="w-full sm:w-auto font-bold tracking-wider"
                icon={ExternalLink}
              >
                Rechercher un modèle similaire
              </LuxuryButton>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
