import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileCheck, Landmark, CheckCircle2, ArrowRight } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { LuxuryButton } from '../common/LuxuryButton';

export const GuaranteesPreview = () => {
  const guaranteeCards = [
    {
      icon: ShieldCheck,
      title: 'Charte d’Audit 150 Points',
      subtitle: 'Contrôle Technique & Esthétique',
      desc: 'Mesure de peinture au micromètre, contrôle du carnet d’entretien numérique constructeur, passage de la valise diagnostique et essai dynamique complet sur route.'
    },
    {
      icon: Landmark,
      title: 'Sécurité Financière & Séquestre',
      subtitle: 'Protection Totale de vos Fonds',
      desc: 'Aucun acompte n’est versé au vendeur étranger avant la validation pleine et entière du rapport d’audit technique. Virement sur compte bancaire séquestre agréé.'
    },
    {
      icon: FileCheck,
      title: 'Conformité Administrative & Fiscale',
      subtitle: 'Immatriculation Française Définitive',
      desc: 'Délivrance du Certificat de Conformité Européen (COC), obtention du quitus fiscal auprès du centre des impôts et certificat d’immatriculation sécurisé.'
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-rolex-dark text-white relative overflow-hidden border-y border-gold/30">
      {/* Texture & lumières */}
      <div className="absolute inset-0 bg-[radial-gradient(#C6A15B_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          dark
          badge="Sécurité & Confiance"
          title="Nos Garanties Contractuelles"
          subtitle="Acheter un véhicule à l'étranger ne doit comporter aucun doute. Nous engageons notre responsabilité sur chaque véhicule livré."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {guaranteeCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="p-6 sm:p-8 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-gold/30 hover:border-gold shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-xl bg-rolex border border-gold/50 flex items-center justify-center text-gold mb-6 shadow-gold-glow">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-xs uppercase font-bold tracking-widest text-gold block mb-1">
                    {card.subtitle}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white mb-3">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>100% garanti par contrat</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center">
          <LuxuryButton
            to="/garanties"
            variant="gold"
            size="md"
            icon={ArrowRight}
          >
            Consulter le protocole d'inspection 150 points
          </LuxuryButton>
        </div>
      </div>
    </section>
  );
};
