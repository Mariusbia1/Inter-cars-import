import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageSquare, X, Send, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

export const ConciergeBubble = () => {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  // Ouverture automatique discrète après 2.5 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
      setHasAutoOpened(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const phoneRaw = settings.phoneRaw || '+33493000000';

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="mb-3 w-[320px] sm:w-[360px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.28)] border border-gold/40 overflow-hidden text-slate-800"
          >
            {/* Header de la bulle avec Vert Rolex & Or */}
            <div className="bg-gradient-to-r from-rolex-dark via-rolex to-rolex-forest p-4 text-white relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold flex items-center justify-center text-gold font-serif font-bold text-sm shadow-inner">
                      IC
                    </div>
                    {/* Indicateur En Ligne */}
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-rolex-dark" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-serif font-bold text-sm text-white">Conciergerie Inter Cars</h4>
                      <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
                    </div>
                    <span className="text-[11px] text-emerald-300 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Conseiller en ligne • Réponse &lt; 24h
                    </span>
                  </div>
                </div>

                {/* Bouton Fermer la bulle */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Corps du message d'accueil */}
            <div className="p-4 space-y-3.5 bg-gradient-to-b from-white to-slate-50">
              <div className="p-3.5 rounded-xl bg-rolex-50/80 border border-rolex/15 text-slate-800 space-y-1 shadow-2xs">
                <p className="text-sm font-semibold text-rolex-950 flex items-center gap-1.5">
                  👋 Bonjour ! Comment pouvons-nous vous aider ?
                </p>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  Vous recherchez un véhicule précis ou souhaitez des informations sur nos modèles disponibles ? Notre équipe est à votre disposition.
                </p>
              </div>

              {/* Actions Rapides */}
              <div className="space-y-2 pt-1">
                {/* 1. Bouton Devis / Formulaire */}
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-rolex hover:bg-rolex-forest text-gold hover:text-white border border-gold/40 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between shadow-xs group"
                >
                  <span className="flex items-center gap-2">
                    <Send className="w-3.5 h-3.5 text-gold group-hover:translate-x-0.5 transition-transform" />
                    Demander un devis personnalisé
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                </Link>

                {/* 2. Bouton Appel Direct */}
                <a
                  href={`tel:${phoneRaw}`}
                  className="w-full py-2 px-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold transition-all flex items-center justify-between hover:border-gold/60"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-rolex" />
                    Appeler un conseiller : <span className="font-bold text-rolex">{settings.phone}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton déclencheur flottant */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-rolex to-rolex-forest text-gold flex items-center justify-center shadow-[0_6px_25px_rgba(0,96,57,0.55)] border-2 border-gold/70 transition-all focus:outline-none"
        aria-label="Ouvrir le contact conciergerie"
      >
        {/* Pastille pulsante */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-gold text-[9px] font-bold text-rolex-950 items-center justify-center">
              1
            </span>
          </span>
        )}

        {isOpen ? (
          <X className="w-6 h-6 text-gold" />
        ) : (
          <MessageSquare className="w-6 h-6 text-gold animate-pulse" />
        )}
      </motion.button>
    </div>
  );
};
