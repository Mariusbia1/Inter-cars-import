import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, X, Shield, Search, FileCheck, Truck, HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';
import { LuxuryButton } from '../components/common/LuxuryButton';
import { salesFaqs } from '../data/faqData';
import { FinalCta } from '../components/home/FinalCta';

export const MethodPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const detailedSteps = [
    {
      step: '01',
      title: 'Définition de Votre Projet Automobile',
      desc: 'Nous débutons par une séance de cadrage approfondie : modèle souhaité, motorisation, options prioritaires, budget tout compris et calendrier.',
      points: [
        'Écoute active et conseils personnalisés sur les modèles',
        'Étude des configurations disponibles et de leur cote',
        'Cadrage clair et transparent sans aucun coût caché'
      ],
      icon: Search
    },
    {
      step: '02',
      title: 'Sélection auprès de nos Partenaires en France',
      desc: 'Nous activons notre réseau exclusif de concessions partenaires officielles en France. Nous sélectionnons uniquement les véhicules certifiés bénéficiant d’un historique d’entretien limpide.',
      points: [
        'Accès direct aux stocks de concessions partenaires en France',
        'Vérification rigoureuse du carnet d’entretien et des révisions constructeur',
        'Garantie de provenance et d’authenticité'
      ],
      icon: Shield
    },
    {
      step: '03',
      title: 'Audit Physique 150 Points & Sécurisation',
      desc: 'Nos techniciens réalisent un contrôle approfondi : mesure au micromètre des épaisseurs de peinture, passage de la valise de diagnostic électronique et contrôle structurel complet.',
      points: [
        'Rapport complet détaillé avec photos HD et contrôle technique',
        'Certification de l’authenticité kilométrique dans les calculateurs',
        'Validation complète de l’état avant finalisation de la vente'
      ],
      icon: FileCheck
    },
    {
      step: '04',
      title: 'Carte Grise & Livraison Clé en Main',
      desc: 'Nous gérons la totalité du volet administratif français (carte grise, certificat de non-gage). Votre véhicule vous est livré préparé avec soin, directement à votre adresse.',
      points: [
        'Démarches administratives et carte grise française assurées',
        'Préparation esthétique et nettoyage professionnel complet',
        'Remise des clés en main propre et activation de votre garantie'
      ],
      icon: Truck
    }
  ];

  const comparisonRows = [
    {
      criteria: "Réseau de concessions partenaires en France",
      intercars: true,
      seul: false,
      concession: "Limité à 1 marque",
    },
    {
      criteria: "Audit physique 150 points certifié",
      intercars: true,
      seul: false,
      concession: false,
    },
    {
      criteria: "Transparence totale de l'historique d'entretien",
      intercars: true,
      seul: "Rarement vérifiable",
      concession: true,
    },
    {
      criteria: "Garantie mécanique & contrôle technique valide",
      intercars: true,
      seul: false,
      concession: true,
    },
    {
      criteria: "Prise en charge intégrale de la carte grise",
      intercars: true,
      seul: false,
      concession: true,
    },
    {
      criteria: "Sécurisation totale de la transaction",
      intercars: true,
      seul: false,
      concession: true,
    },
    {
      criteria: "Livraison soignée à domicile partout en France",
      intercars: true,
      seul: false,
      concession: "Option payante",
    }
  ];

  return (
    <div className="pt-32 sm:pt-36 bg-surface">
      {/* Hero Page */}
      <section className="bg-rolex-dark text-white py-14 sm:py-20 relative overflow-hidden border-b border-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-4 uppercase tracking-widest">
            <Link to="/" className="hover:text-gold transition-colors">Accueil</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gold" />
            <span className="text-gold font-semibold">Notre Méthode</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">
            Un Parcours d'Achat Sécurisé <br />
            <span className="text-gold-gradient">en 4 Étapes Clés</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            Une approche méthodique et éprouvée pour acheter votre véhicule en toute confiance, grâce à notre réseau de concessions partenaires en France.
          </p>
        </div>
      </section>

      {/* Le Détail des 4 Étapes */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {detailedSteps.map((s, index) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`p-8 sm:p-12 rounded-3xl bg-surface border border-slate-200/80 hover:border-gold/60 shadow-luxury-card transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center`}
              >
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="font-serif font-black text-2xl text-gold px-3 py-1 rounded bg-rolex-dark border border-gold/40">
                      ÉTAPE {s.step}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                      {s.title}
                    </h3>
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
                    {s.desc}
                  </p>

                  <ul className="space-y-2.5 pt-2">
                    {s.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                        <div className="w-5 h-5 rounded-full bg-rolex-50 text-rolex border border-rolex/30 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 font-bold" />
                        </div>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-4 flex items-center justify-center">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-br from-rolex to-rolex-800 border-2 border-gold/40 shadow-rolex-glow flex flex-col items-center justify-center text-gold group">
                    <Icon className="w-14 h-14 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-serif font-bold tracking-widest uppercase text-white/90">Inter Cars</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Tableau Comparatif */}
      <section className="py-20 bg-rolex-dark text-white border-y border-gold/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            dark
            badge="Comparatif du Marché"
            title="Pourquoi Choisir Inter Cars ?"
            subtitle="Analyse comparative objective entre notre service avec partenaires exclusifs, l'achat entre particuliers et d'autres circuits."
          />

          <div className="overflow-x-auto rounded-2xl border border-gold/30 shadow-2xl bg-white/[0.03] backdrop-blur-md">
            <table className="w-full text-left text-sm">
              <thead className="bg-rolex-forest/80 border-b border-gold/30 text-xs font-serif uppercase tracking-wider text-gold">
                <tr>
                  <th className="p-4 sm:p-6">Critère de Vente</th>
                  <th className="p-4 sm:p-6 text-center text-gold-light font-bold bg-rolex/60 border-x border-gold/30">
                    Inter Cars
                  </th>
                  <th className="p-4 sm:p-6 text-center text-slate-300">Achat entre Particuliers</th>
                  <th className="p-4 sm:p-6 text-center text-slate-300">Vendeur Traditionnel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 sm:p-6 font-medium text-white">{row.criteria}</td>
                    
                    {/* Colonne Inter Cars */}
                    <td className="p-4 sm:p-6 text-center bg-rolex/30 border-x border-gold/20 font-semibold text-emerald-400">
                      {row.intercars === true ? (
                        <div className="inline-flex items-center gap-1.5 text-gold-light font-bold">
                          <Check className="w-5 h-5 text-gold" /> Inclus & Garanti
                        </div>
                      ) : (
                        row.intercars
                      )}
                    </td>

                    {/* Colonne Particuliers */}
                    <td className="p-4 sm:p-6 text-center text-slate-400">
                      {row.seul === true ? (
                        <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                      ) : row.seul === false ? (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      ) : (
                        row.seul
                      )}
                    </td>

                    {/* Colonne Vendeur Traditionnel */}
                    <td className="p-4 sm:p-6 text-center text-slate-400">
                      {row.concession === true ? (
                        <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                      ) : row.concession === false ? (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      ) : (
                        row.concession
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Foire Aux Questions (FAQ) */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="FAQ & Réponses"
            title="Questions Fréquemment Posées"
            subtitle="Toutes les réponses à vos interrogations sur nos véhicules, nos garanties et les démarches d'immatriculation."
          />

          <div className="space-y-4">
            {salesFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-surface overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-serif font-bold text-slate-900 hover:text-rolex transition-colors"
                >
                  <span className="text-base sm:text-lg">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gold shrink-0 transition-transform duration-300 ${
                      openFaq === idx ? 'rotate-180 text-rolex' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed font-light border-t border-slate-200/60 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <FinalCta />
    </div>
  );
};
