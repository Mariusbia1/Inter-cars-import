import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Check, X } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'intercars_cookie_consent_v1';

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignorer si localStorage restreint
    }
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

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Gestion des cookies"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-lg z-50 transition-all duration-500 ease-out transform translate-y-0 opacity-100"
    >
      <div className="p-6 rounded-2xl bg-[#072418] border border-[#c6a15b]/50 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-white relative overflow-hidden">
        {/* Décoration d'arrière-plan */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#c6a15b]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#004d2e] border border-[#c6a15b]/60 flex items-center justify-center text-[#c6a15b] shadow-sm shrink-0 mt-0.5">
            <Cookie className="w-5 h-5" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
                Cookies & Confidentialité
              </h4>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/10 text-[#e2c285] border border-[#c6a15b]/30">
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
                className="text-[#c6a15b] underline hover:text-[#e2c285] transition-colors font-medium"
              >
                politique de protection des données
              </Link>.
            </div>

            {/* Boutons d'Action */}
            <div className="pt-3 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleAccept}
                className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-[#c6a15b] hover:bg-[#e2c285] text-[#072418] font-bold uppercase tracking-wider text-[11px] transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Tout Accepter</span>
              </button>

              <button
                type="button"
                onClick={handleDecline}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-[11px] font-semibold transition-all border border-white/10 flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Refuser</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
