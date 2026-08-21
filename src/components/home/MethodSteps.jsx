import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search, ShieldCheck, Truck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { LuxuryButton } from '../common/LuxuryButton';

export const MethodSteps = () => {
  const steps = [
    {
      number: '01',
      title: 'Échange & Cahier des Charges',
      description: 'Audit précis de vos souhaits : modèle, motorisation, options indispensables, budget maximal et tolérance kilométrique.',
      icon: MessageSquare,
      detail: 'Entretien téléphonique ou physique avec votre conseiller dédié sous 24h.'
    },
    {
      number: '02',
      title: 'Sélection Ciblée & Négociation',
      description: 'Recherche rigoureuse parmi nos réseaux officiels partenaires avec vérification complète de l’historique et négociation des meilleures conditions.',
      icon: Search,
      detail: 'Présentation d’un dossier comparatif complet avec photos et historique.'
    },
    {
      number: '03',
      title: 'Audit 150 Points & Sécurisation',
      description: 'Contrôle technique approfondi sur place, vérification des calculateurs électroniques et paiement via compte séquestre garanti.',
      icon: ShieldCheck,
      detail: 'Rapport d’inspection de 40 pages transmis avant tout engagement financier.'
    },
    {
      number: '04',
      title: 'Homologation & Livraison VIP',
      description: 'Gestion intégrale du quitus fiscal, de la carte grise française et livraison à votre porte par transporteur confidentiel fermé.',
      icon: Truck,
      detail: 'Plaques d’immatriculation posées et véhicule préparé dans un état concours.'
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-surface relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Notre Méthode"
          title="Un Processus Linéaire & Rigoureux en 4 Étapes"
          subtitle="De la première prise de contact jusqu'à la remise des clés dans votre allée, chaque jalon est maîtrisé avec une précision chirurgicale."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 hover:border-gold/60 shadow-luxury-card hover:shadow-luxury-hover transition-all duration-300 flex flex-col justify-between"
              >
                {/* Numéro Doré Géant */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif font-black text-3xl sm:text-4xl text-gold/30 group-hover:text-gold transition-colors">
                    {step.number}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-rolex-50 group-hover:bg-rolex text-rolex group-hover:text-gold border border-rolex/20 group-hover:border-gold/50 flex items-center justify-center transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-serif font-bold text-slate-900 mb-2 group-hover:text-rolex transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 text-[11px] text-rolex-600 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>{step.detail}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center">
          <LuxuryButton
            to="/notre-methode"
            variant="rolex"
            size="lg"
            icon={ArrowRight}
          >
            Découvrir le détail complet de notre méthode
          </LuxuryButton>
        </div>
      </div>
    </section>
  );
};
