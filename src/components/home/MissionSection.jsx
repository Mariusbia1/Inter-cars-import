import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Award, ArrowRight, Check } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { LuxuryButton } from '../common/LuxuryButton';

export const MissionSection = () => {
  const points = [
    {
      title: 'Partenariats Exclusifs en France',
      description: 'Accords privilégiés avec les réseaux de concessions officielles en France pour un accès direct aux véhicules certifiés et parfaitement entretenus.'
    },
    {
      title: 'Audit physique intransigeant en 150 points',
      description: 'Contrôle châssis, historique d’entretien constructeur, diagnostic électronique et vérification micrométrique de la carrosserie.'
    },
    {
      title: 'Transparence & Vente Directe Sécurisée',
      description: 'Zéro frais caché, tarification claire, conformité administrative garantie et livraison clé en main.'
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Image & Cadre */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-gold/40">
              <img
                src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=75"
                alt="Contrôle technique d'un véhicule chez Inter Cars"
                loading="lazy"
                decoding="async"
                className="w-full h-[400px] sm:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rolex-dark/80 via-transparent to-transparent" />

              {/* Badge Flottant d'Expertise */}
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-rolex-dark/95 backdrop-blur-md border border-gold/40 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rolex border border-gold flex items-center justify-center text-gold shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-gold">Professionnel Automobile Certifié</h4>
                    <p className="text-xs text-slate-300">Réseau de concessions partenaires officielles partout en France.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cadre ornemental doré en arrière-plan */}
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-gold/30 rounded-2xl -z-0 hidden sm:block" />
          </motion.div>

          {/* Contenu Texte */}
          <div className="lg:col-span-6 space-y-6">
            <SectionHeader
              align="left"
              badge="Notre Mission"
              title="L'Excellence Automobile avec nos Partenaires en France"
              subtitle="Inter Cars Import s'engage à vous proposer des véhicules d'occasion rigoureusement contrôlés, issus directement de concessions partenaires officielles en France."
              className="mb-6"
            />

            <div className="space-y-4 pt-2">
              {points.map((point, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-slate-200/80 hover:border-gold/50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-rolex-50 border border-rolex/30 flex items-center justify-center text-rolex shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-rolex font-bold" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">{point.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{point.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-4">
              <LuxuryButton
                to="/notre-histoire"
                variant="rolex"
                size="md"
                icon={ArrowRight}
              >
                En savoir plus sur notre histoire
              </LuxuryButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
