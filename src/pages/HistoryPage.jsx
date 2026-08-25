import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Award, HeartHandshake, Eye, Sparkles, ChevronRight, ArrowRight } from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';
import { LuxuryButton } from '../components/common/LuxuryButton';
import { companyMilestones, teamMembers } from '../data/timelineData';
import { FinalCta } from '../components/home/FinalCta';

export const HistoryPage = () => {
  const values = [
    {
      icon: Shield,
      title: 'Intégrité & Transparence',
      text: 'Aucun frais dissimulé, aucun intermédiaire opaque. Chaque véhicule est vendu avec un contrat clair, un historique d’entretien officiel et tous les justificatifs en règle.'
    },
    {
      icon: Award,
      title: 'Excellence & Rigueur Technique',
      text: 'Notre protocole d’audit 150 points ne tolère aucun compromis. Si un véhicule présente le moindre doute kilométrique ou mécanique, nous l’écartons immédiatement.'
    },
    {
      icon: HeartHandshake,
      title: 'Partenariats Exclusifs en France',
      text: 'Nous collaborons étroitement avec les plus grands groupes de concessions officielles en France pour garantir la provenance et l’entretien certifié de nos véhicules.'
    }
  ];

  return (
    <div className="pt-32 sm:pt-36 bg-surface">
      {/* Page Hero Header */}
      <section className="bg-rolex-dark text-white py-14 sm:py-20 relative overflow-hidden border-b border-gold/30">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=75"
            alt="Inter Cars Histoire"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-rolex-dark via-rolex-dark/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Fil d'Ariane */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-4 uppercase tracking-widest">
            <Link to="/" className="hover:text-gold transition-colors">Accueil</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gold" />
            <span className="text-gold font-semibold">Notre Histoire</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">
            La Passion de la Qualité <br />
            <span className="text-gold-gradient">Automobile depuis 2016</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            Découvrez la genèse d'Inter Cars Import, notre engagement envers la transparence et notre réseau de concessions partenaires exclusifs en France.
          </p>
        </div>
      </section>

      {/* Récit Fondateur */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <SectionHeader
                align="left"
                badge="Notre Engagement"
                title="L'Exigence de la Vente Automobile Certifiée"
                subtitle="Une approche axée sur la rigueur technique, la sécurité d'achat et la proximité avec nos clients."
                className="mb-4"
              />

              <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-4">
                <p>
                  Acheter un véhicule d'occasion doit être une expérience sereine, transparente et sécurisée. Trop souvent, le marché de l'occasion manque de clarté sur l'historique réel des entretiens et l'état mécanique approfondi.
                </p>
                <p>
                  Chez <strong>Inter Cars Import</strong>, nous avons fait le choix de la rigueur absolue. Grâce à nos accords avec des concessions officielles partenaires en France, chaque véhicule proposé est rigoureusement audité sur 150 points de contrôle, révisé et garanti avec son carnet constructeur à jour.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-rolex-50 border border-rolex/20 text-rolex-900 font-serif italic text-sm">
                "Notre engagement est simple : offrir à chaque acheteur un véhicule parfaitement contrôlé et garanti, avec un service clé en main."
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-gold/40">
                <img
                  src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=75"
                  alt="Sélection de véhicules chez Inter Cars"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-[450px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-20 bg-rolex-dark text-white border-y border-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            dark
            badge="Nos Valeurs"
            title="Les Principes qui Guident Chacun de nos Pas"
            subtitle="Une éthique de travail inébranlable au service de nos clients et partenaires."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="p-8 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-gold/30 hover:border-gold transition-colors"
                >
                  <div className="w-14 h-14 rounded-xl bg-rolex border border-gold flex items-center justify-center text-gold mb-6 shadow-gold-glow">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white mb-3">
                    {val.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                    {val.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Frise Chronologique */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Notre Parcours"
            title="Les Jalons d'une Croissance Maîtrisée"
            subtitle="Près d'une décennie d'exigence, de partenariats exclusifs en France et d'innovations de service."
          />

          <div className="relative border-l-2 border-gold/40 ml-4 sm:ml-64 space-y-12 pl-6 sm:pl-10">
            {companyMilestones.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative"
              >
                {/* Pastille dorée centrée sur la ligne */}
                <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-5 h-5 rounded-full bg-rolex border-4 border-gold shadow-gold-glow z-10" />

                {/* Année / Libellé avec espacement généreux et sécurisé avant la pastille */}
                <div className="sm:absolute sm:-left-64 sm:w-48 text-left sm:text-right font-serif font-bold text-base sm:text-lg text-rolex mb-2 sm:mb-0 top-1 whitespace-nowrap pr-7 tracking-wide">
                  {m.year}
                </div>

                <div className="p-6 rounded-xl bg-surface border border-slate-200 shadow-sm hover:border-gold/60 transition-colors">
                  <h4 className="text-lg font-serif font-bold text-slate-900 mb-2">
                    {m.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                    {m.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="py-20 bg-surface border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="L'Équipe"
            title="Des Spécialistes Dévoués à Votre Projet"
            subtitle="Chaque membre d'Inter Cars Import apporte une expertise pointue en mécanique automobile, gestion de dossiers et accompagnement client."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-luxury-card hover:shadow-luxury-hover transition-all text-center group"
              >
                <div className="h-64 overflow-hidden bg-slate-900">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-serif font-bold text-slate-900 mb-1">{member.name}</h4>
                  <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">{member.role}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <FinalCta />
    </div>
  );
};
