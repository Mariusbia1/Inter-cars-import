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
      className="fixed bottom-6 right-6 z-50 flex items-center"
    >
      {/* Bouton Flottant Téléphone (Icône seule propre sans aucun texte) */}
      <a
        href={`tel:${phoneRaw}`}
        aria-label="Appeler Inter Cars Import"
        className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-rolex to-rolex-forest text-gold flex items-center justify-center shadow-[0_4px_25px_rgba(0,96,57,0.55)] hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-gold/70 group"
      >
        {/* Anneau Pulsant Discret */}
        <span className="absolute inset-0 rounded-full bg-gold opacity-25 animate-ping pointer-events-none" />

        {/* Icône Téléphone Dorée */}
        <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-gold relative z-10" />
      </a>
    </motion.div>
  );
};
