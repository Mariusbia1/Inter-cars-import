import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Eye, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { LuxuryButton } from '../common/LuxuryButton';

export const VisionSection = () => {
  const visionPillars = [
    {
      title: 'Une Expérience de Haute Conciergerie',
      text: 'Chaque acquéreur bénéficie d’un interlocuteur unique, joignable 7j/7, qui orchestre l’ensemble des étapes avec le niveau d’exigence des palaces.'
    },
    {
      title: 'La Rupture avec l’Opacité Traditionnelle',
      text: 'Nous fournissons chaque contrat de vente d’origine, chaque relevé douanier et chaque rapport technique sans aucune dissimulation.'
    },
    {
      title: 'La Sérénité Absolue des Investissements',
      text: 'Sélectionner des véhicules rares dont la cote et l’historique préservent la valeur patrimoniale de votre garage au fil des années.'
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-rolex-dark text-white relative overflow-hidden border-t border-gold/20">
      {/* Motifs et reflets de fond */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rolex/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Contenu Texte */}
          <div className="lg:col-span-6 space-y-6">
            <SectionHeader
              dark
              align="left"
              badge="Notre Vision"
              title="Redéfinir les Standards du Courtage Automobile"
              subtitle="Nous croyons en un modèle où la passion mécanique s'associe à la rigueur juridique la plus stricte, pour transformer l'achat transfrontalier en un plaisir pur."
              className="mb-6"
            />

            <div className="space-y-4 pt-2">
              {visionPillars.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="p-5 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/10 hover:border-gold/50 transition-colors"
                >
                  <h4 className="text-base font-serif font-bold text-gold-light mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="pt-4">
              <LuxuryButton
                to="/garanties"
                variant="gold"
                size="md"
                icon={ArrowRight}
              >
                Découvrir nos engagements & garanties
              </LuxuryButton>
            </div>
          </div>

          {/* Visuel Ferrari / Prestige */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gold/40">
              <img
                src="https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1200&q=80"
                alt="Ferrari 296 GTB livrée par Inter Cars Import"
                className="w-full h-[400px] sm:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-rolex-forest/90 backdrop-blur-md border border-gold/30">
                <p className="text-xs uppercase font-bold tracking-widest text-gold mb-1">Curation Personnalisée</p>
                <p className="text-sm font-medium text-white">
                  "Chaque véhicule importé est sélectionné avec la même minutie que s'il rejoignait notre collection personnelle."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
