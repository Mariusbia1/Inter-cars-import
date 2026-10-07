import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Check, X, ShieldCheck } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'intercars_cookie_consent_v1';

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Écouteur pour réouverture manuelle (via footer ou paramètres)
    const handleOpen = () => setIsVisible(true);
    window.addEventListener('open-cookie-settings', handleOpen);

    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1000);
        return () => {
          clearTimeout(timer);
          window.removeEventListener('open-cookie-settings', handleOpen);
        };
      }
    } catch {
      // Si localStorage restreint, afficher par défaut
      setIsVisible(true);
    }

    return () => window.removeEventListener('open-cookie-settings', handleOpen);
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    } catch {}
    setIsVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    } catch {}
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          aria-label="Gestion des cookies et confidentialité"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-[60]"
        >
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#071510] via-rolex-dark to-[#0B2218] border border-gold/40 shadow-[0_20px_60px_rgba(0,0,0,0.65)] text-white relative overflow-hidden backdrop-blur-xl">
            {/* Halo lumineux subtil */}
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-gold/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start gap-3.5 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-rolex/60 border border-gold/40 flex items-center justify-center text-gold shadow-inner shrink-0 mt-0.5">
                <Cookie className="w-5 h-5" />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
                    Cookies & Confidentialité
                  </h4>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gold/15 text-gold-light border border-gold/30 shrink-0 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-gold" /> RGPD
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Nous utilisons des cookies essentiels afin d'assurer le fonctionnement optimal du site, la sécurité de vos données et l'analyse de navigation.
                </p>

                <div className="text-[11px] text-slate-400">
                  En savoir plus dans notre{' '}
                  <Link
                    to="/confidentialite"
                    onClick={() => setIsVisible(false)}
                    className="text-gold underline hover:text-gold-light transition-colors font-medium"
                  >
                    politique de confidentialité
                  </Link>.
                </div>

                {/* Boutons d'Action */}
                <div className="pt-3 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleAccept}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-dark hover:from-gold-light hover:to-gold text-rolex-950 font-bold uppercase tracking-wider text-[11px] transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accepter tout</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDecline}
                    className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-[11px] font-semibold transition-all border border-white/10 flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Refuser</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
