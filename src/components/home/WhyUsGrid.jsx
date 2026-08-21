import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, Network, UserCheck, Award, Smile, ArrowRight } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';

export const WhyUsGrid = () => {
  const pillars = [
    {
      icon: Network,
      title: 'Réseau Concessionnaire Privilégié',
      description: 'Accès direct aux plus beaux stocks de concessions officielles et aux modèles de prestige rigoureusement sélectionnés.'
    },
    {
      icon: Eye,
      title: 'Transparence Absolue',
      description: 'Dossier limpide dès le premier échange, historique vérifié et tarification claire de notre prestation d\'accompagnement.'
    },
    {
      icon: ShieldCheck,
      title: 'Audit 150 Points & Zéro Vice',
      description: 'Chaque véhicule fait l’objet d’une inspection physique intransigeante avant achat, avec contrôle des calculateurs et de la carrosserie.'
    },
    {
      icon: UserCheck,
      title: 'Conseiller Dédié',
      description: 'Un interlocuteur unique, expert automobile passionné, qui vous informe en temps réel de chaque avancée de votre dossier.'
    },
    {
      icon: Award,
      title: 'Traçabilité & Historique Limpide',
      description: 'Contrôle systématique du carnet d’entretien, des révisions constructeur et de l’authenticité kilométrique certifiée.'
    },
    {
      icon: Smile,
      title: 'Sérénité Clé en Main',
      description: 'Prise en charge complète des formalités administratives, immatriculation définitive et livraison soignée à votre adresse.'
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Pourquoi Nous Choisir"
          title="L'Excellence d'une Conciergerie Indépendante"
          subtitle="Découvrez pourquoi plus de 180 passionnés et collectionneurs nous confient la recherche et l'importation de leurs véhicules de prestige."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group p-6 sm:p-8 rounded-2xl bg-surface border border-slate-200/80 hover:border-gold hover:bg-white shadow-sm hover:shadow-luxury-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-rolex-50 group-hover:bg-rolex text-rolex group-hover:text-gold border border-rolex/20 group-hover:border-gold/40 flex items-center justify-center mb-6 transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-slate-900 mb-2 group-hover:text-rolex transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100/80 flex items-center text-xs font-semibold text-gold group-hover:text-gold-dark">
                  <span>Engagement Inter Cars Import</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
