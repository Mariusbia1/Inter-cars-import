import React from 'react';
import { Link } from 'react-router-dom';
import { LuxuryButton } from '../components/common/LuxuryButton';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-rolex-dark flex items-center justify-center px-4 py-24 text-white text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#C6A15B_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

      <div className="relative z-10 max-w-lg space-y-6">
        <span className="font-serif font-black text-7xl sm:text-9xl text-gold-gradient block">
          404
        </span>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
          Trajectoire Non Trouvée
        </h1>

        <p className="text-sm text-slate-300 font-light leading-relaxed">
          La page que vous recherchez semble introuvable ou a été déplacée dans notre catalogue privé.
        </p>

        <div className="pt-4 flex items-center justify-center gap-4">
          <LuxuryButton to="/" variant="gold" size="md" icon={Home}>
            Retour à l'Accueil
          </LuxuryButton>
        </div>
      </div>
    </div>
  );
};
