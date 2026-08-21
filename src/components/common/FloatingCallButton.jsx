import React from 'react';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const FloatingCallButton = () => {
  const { settings } = useSettings();
  const phoneRaw = settings.phoneRaw || '+33493000000';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="fixed bottom-6 right-6 z-50 flex items-center group"
    >
      {/* Tooltip au survol */}
      <span className="hidden sm:inline-block mr-3 px-3.5 py-1.5 rounded-full bg-rolex-dark/95 text-white text-xs font-semibold shadow-xl border border-gold/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none backdrop-blur-md">
        Appel Direct Conciergerie : {settings.phone}
      </span>

      {/* Bouton Flottant Téléphone d'Or & Vert Rolex */}
      <a
        href={`tel:${phoneRaw}`}
        aria-label="Appeler la conciergerie"
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-rolex to-rolex-forest text-gold flex items-center justify-center shadow-[0_4px_25px_rgba(0,96,57,0.55)] hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-gold/70"
      >
        {/* Anneau Pulsant */}
        <span className="absolute inset-0 rounded-full bg-gold opacity-30 animate-ping pointer-events-none" />

        {/* Icône Téléphone */}
        <Phone className="w-6 h-6 animate-pulse text-gold relative z-10" />
      </a>
    </motion.div>
  );
};
