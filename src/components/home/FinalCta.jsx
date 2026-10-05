import React from 'react';
import { ArrowRight, Phone, MessageSquare, ShieldCheck, CheckCircle2, UserCheck } from 'lucide-react';
import { LuxuryButton } from '../common/LuxuryButton';
import { useSettings } from '../../context/SettingsContext';

export const FinalCta = () => {
  const { settings } = useSettings();

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-slate-900 to-rolex-dark text-white relative overflow-hidden">
      {/* Halo lumineux subtil */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rolex/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-gold/40 text-gold text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            <UserCheck className="w-3.5 h-3.5 text-gold" />
            <span>Votre Conseiller Commercial Dédié</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
            Vous Avez Trouvé Votre Véhicule ? <br />
            <span className="text-gold-gradient">Échangeons Directement Par Téléphone.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
            Nos conseillers automobiles vous répondent du lundi au samedi pour vous présenter les véhicules en stock, organiser une visite ou préparer votre devis personnalisé.
          </p>

          {/* Boutons d'Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <LuxuryButton
              to="/contact"
              variant="gold"
              size="lg"
              icon={ArrowRight}
              className="w-full sm:w-auto shadow-gold-glow font-bold tracking-wider"
            >
              Demander un devis personnalisé
            </LuxuryButton>

            <a
              href={`tel:${settings.phoneRaw || '+33493000000'}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all backdrop-blur-sm"
            >
              <Phone className="w-4 h-4 text-gold" />
              <span>Appeler le {settings.phone}</span>
            </a>
          </div>

          {/* Garanties rassurantes en bas */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
              <span>Audit 150 points certifié</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Véhicules garantis 12 à 24 mois</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4 text-gold shrink-0" />
              <span>Réponse garantie sous 2h ouvrées</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
