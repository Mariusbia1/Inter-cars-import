import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck, CheckCircle2, Landmark, FileText, Sparkles, Scale, Wrench, FileCheck2 } from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';
import { LuxuryButton } from '../components/common/LuxuryButton';
import { FinalCta } from '../components/home/FinalCta';

export const GuaranteesPage = () => {
  const inspectionModules = [
    {
      title: 'Carrosserie & Châssis (45 points)',
      points: [
        'Mesure de l’épaisseur de peinture au micromètre (détection de mastic ou repeint)',
        'Alignement millimétrique des panneaux de carrosserie et ouvrants',
        'Contrôle de soubassement sur pont élévateur et état des éléments de structure',
        'Vérification d’absence de trace de marbre ou de choc antérieur'
      ]
    },
    {
      title: 'Moteur & Organes Mécaniques (50 points)',
      points: [
        'Analyse approfondie des calculateurs moteur et des paramètres de fonctionnement',
        'Contrôle d’étanchéité des turbocompresseurs, circuit d’huile et de refroidissement',
        'Mesure d’usure des disques et plaquettes de freins',
        'Test dynamique de la boîte de vitesses (automatique et manuelle)'
      ]
    },
    {
      title: 'Historique & Kilométrage Certifié (30 points)',
      points: [
        'Rapprochement de l’historique auprès des concessions officielles françaises',
        'Contrôle de conformité du carnet d’entretien constructeur à jour',
        'Audit de cohérence des heures d’utilisation moteur vs kilomètres réels',
        'Certificat de situation administrative (non-gage) certifié vierge'
      ]
    },
    {
      title: 'Électronique & Habitacle (25 points)',
      points: [
        'Passage complet de la valise diagnostique officielle',
        'Test de santé des batteries de traction (Hybrides & Électriques SOH)',
        'Vérification de l’intégralité des équipements de sécurité et de bord',
        'Contrôle soigné des finitions intérieures, sellerie et commandes'
      ]
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
            <span className="text-gold font-semibold">Garanties & Confiance</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">
            Un Cadre d'Engagement <br />
            <span className="text-gold-gradient">Strict et Transparent</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            Une protection juridique, financière et mécanique totale pour faire de l'achat de votre véhicule une expérience d'une sérénité absolue.
          </p>
        </div>
      </section>

      {/* Le Protocole d'Audit 150 Points */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Expertise Technique"
            title="L'Audit 150 Points en Détail"
            subtitle="Chaque véhicule proposé fait l'objet d'une inspection complète par nos spécialistes avant sa mise en vente."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {inspectionModules.map((module, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 rounded-2xl bg-surface border border-slate-200 hover:border-gold shadow-sm transition-all"
              >
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-4 flex items-center gap-2 text-rolex">
                  <Wrench className="w-5 h-5 text-gold" />
                  {module.title}
                </h3>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                  {module.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-rolex shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sécurité Financière & Contrat Clair */}
      <section className="py-20 bg-rolex-dark text-white border-y border-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <SectionHeader
                dark
                align="left"
                badge="Sécurité des Transactions"
                title="Des Paiements Sécurisés & un Contrat Transparent"
                subtitle="Vous bénéficiez d'un cadre contractuel clair et conforme à la législation française."
                className="mb-4"
              />

              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                <p>
                  Chez <strong>Inter Cars</strong>, chaque transaction est encadrée par un contrat de vente officiel. Nous vous garantissons une clarté totale sur le prix, les garanties et les caractéristiques du véhicule.
                </p>
                <p>
                  Les fonds sont sécurisés et la vente n'est conclue qu'après validation complète de la conformité technique du véhicule et de son dossier administratif.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-4 text-xs text-gold font-semibold">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Transactions bancaires sécurisées</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Contrat de vente clair et conforme</span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.04] backdrop-blur-md border border-gold/40 shadow-2xl space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-rolex border border-gold flex items-center justify-center text-gold shadow-gold-glow shrink-0">
                    <Landmark className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-serif font-bold text-white">Garantie & Sécurité Achat</h4>
                    <p className="text-xs text-gold">Transactions sécurisées sans mauvaise surprise</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-300 border-t border-white/10 pt-4">
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span>Audit 150 points validé</span>
                    <strong className="text-emerald-400">Rapport certifié remis</strong>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span>Protection & Sécurité Juridique</span>
                    <strong className="text-emerald-400">Dossier administratif en règle</strong>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span>Réseau Partenaire Officiel en France</span>
                    <strong className="text-emerald-400">Historique vérifié</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Démarches Administratives Françaises */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <SectionHeader
            badge="Formalités Administratives"
            title="Gestion Complète de la Carte Grise & Livraison Clé en Main"
            subtitle="Nous prenons en charge toutes les formalités auprès de l'administration française pour une livraison sereine."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-surface border border-slate-200">
              <FileCheck2 className="w-8 h-8 text-rolex mb-3" />
              <h4 className="font-serif font-bold text-slate-900 mb-2">Certificat de Non-Gage</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Vérification systématique du certificat de situation administrative garantissant l'absence de gage ou d'opposition.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-slate-200">
              <Wrench className="w-8 h-8 text-rolex mb-3" />
              <h4 className="font-serif font-bold text-slate-900 mb-2">Contrôle Technique à Jour</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chaque véhicule est livré avec un contrôle technique valide de moins de 6 mois et une révision effectuée.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-slate-200">
              <ShieldCheck className="w-8 h-8 text-rolex mb-3" />
              <h4 className="font-serif font-bold text-slate-900 mb-2">Carte Grise Définitive</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prise en charge de la demande de changement de titulaire en préfecture (SIV) et envoi de votre carte grise à domicile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <FinalCta />
    </div>
  );
};
