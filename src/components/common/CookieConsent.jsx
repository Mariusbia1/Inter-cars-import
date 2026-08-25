import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, ShieldCheck, Check, X } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'intercars_cookie_consent_v1';

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Vérifier si le choix a déjà été enregistré
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Déclencher après un court délai pour une apparition fluide
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-lg z-50"
        >
          <div className="p-6 rounded-2xl bg-[#072418]/95 backdrop-blur-xl border border-gold/50 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-white relative overflow-hidden">
            {/* Décoration d'arrière-plan */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rolex border border-gold/60 flex items-center justify-center text-gold shadow-gold-glow shrink-0 mt-0.5">
                <Cookie className="w-5 h-5" />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
                    Cookies & Confidentialité
                  </h4>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/10 text-gold border border-gold/30">
                    RGPD Conforme
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Nous utilisons des cookies afin d'assurer le bon fonctionnement du site, la sécurité de vos données et l'analyse anonyme des visites pour améliorer nos services.
                </p>

                <div className="text-[11px] text-slate-400">
                  En savoir plus sur notre{' '}
                  <Link
                    to="/confidentialite"
                    className="text-gold underline hover:text-gold-light transition-colors font-medium"
                  >
                    politique de protection des données
                  </Link>.
                </div>

                {/* Boutons d'Action */}
                <div className="pt-3 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleAccept}
                    className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-gold hover:bg-gold-light text-rolex-950 font-bold uppercase tracking-wider text-[11px] transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Tout Accepter</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDecline}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-[11px] font-semibold transition-all border border-white/10 flex items-center justify-center gap-1 active:scale-95"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Refuser</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
