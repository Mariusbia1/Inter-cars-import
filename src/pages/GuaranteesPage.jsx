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
        'Contrôle de soubassement sur pont élévateur et état des longerons',
        'Vérification d’absence de trace de marbre ou de choc antérieur'
      ]
    },
    {
      title: 'Moteur & Organes Mécaniques (50 points)',
      points: [
        'Analyse des calculateurs moteur (plages de surrégimes Porsche / DME)',
        'Contrôle d’étanchéité des turbocompresseurs et du circuit de refroidissement',
        'Mesure d’usure des disques de freins céramiques (PCCB) ou acier',
        'Test dynamique de la boîte de vitesses (PDK / S-Tronic / M Steptronic)'
      ]
    },
    {
      title: 'Historique & Kilométrage Certifié (30 points)',
      points: [
        'Rapprochement de l’historique des serveurs centraux constructeur',
        'Contrôle de conformité du carnet d’entretien physique et numérique',
        'Audit de cohérence des heures d’utilisation moteur vs kilomètres',
        'Vérification du certificat de non-gage européen et absence d’opposition'
      ]
    },
    {
      title: 'Électronique & Habitacle (25 points)',
      points: [
        'Passage complet de la valise diagnostique multimarque officielle',
        'Test de santé des batteries de traction (PHEV & 100% Électriques SOH)',
        'Vérification de l’intégralité des équipements de confort et de sécurité',
        'Contrôle de l’état d’origine des cuirs, alcantara et inserts carbone'
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
            <span className="text-gold-gradient">Strict et Inconditionnel</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            Une protection juridique, financière et mécanique totale pour faire de l'achat de votre véhicule de prestige une expérience d'une sérénité absolue.
          </p>
        </div>
      </section>

      {/* Le Protocole d'Audit 150 Points */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Expertise Technique"
            title="L'Audit 150 Points en Détail"
            subtitle="Chaque véhicule sélectionné est passé au crible par nos techniciens sur le lieu de vente avant validation de l'achat."
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

      {/* Sécurité Financière & Compte Séquestre */}
      <section className="py-20 bg-rolex-dark text-white border-y border-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <SectionHeader
                dark
                align="left"
                badge="Sécurité Bancaire"
                title="Votre Capital Protégé à 100% par Séquestre"
                subtitle="Vous ne transférez aucun euro à l'étranger sans garanties contractuelles étanches."
                className="mb-4"
              />

              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                <p>
                  Dans l'importation classique, envoyer des fonds à un concessionnaire étranger suscite de légitimes inquiétudes. Chez Inter Cars Import, la totalité des paiements transite par un <strong>compte séquestre dédié</strong>.
                </p>
                <p>
                  Les fonds ne sont débloqués auprès de la concession vendeuse qu'une fois le contrat de vente validé, le rapport d'audit 150 points signé et la conformité administrative certifiée. En cas de non-conformité constatée lors de l'inspection sur place, vos fonds vous sont intégralement restitués sous 24h.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-4 text-xs text-gold font-semibold">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Compte bancaire européen sécurisé</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Contrat de mandat clair et transparent</span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.04] backdrop-blur-md border border-gold/40 shadow-2xl space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-rolex border border-gold flex items-center justify-center text-gold shadow-gold-glow shrink-0">
                    <Landmark className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-serif font-bold text-white">Garantie Financière Totale</h4>
                    <p className="text-xs text-gold">Zéro risque de perte de capital</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-300 border-t border-white/10 pt-4">
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span>Audit non conforme sur place</span>
                    <strong className="text-emerald-400">Remboursement immédiat 100%</strong>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span>Protection & Sécurité Juridique</span>
                    <strong className="text-emerald-400">Dossier administratif certifié</strong>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span>Conformité Mécanique & Électronique</span>
                    <strong className="text-emerald-400">Audit 150 points certifié</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Optimisation du Malus & Démarches */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <SectionHeader
            badge="Fiscalité & Immatriculation"
            title="Maîtrise Fiscale & Optimisation du Malus Écologique"
            subtitle="Nous calculons l'abattement fiscal exact et prenons en charge toutes les formalités auprès de l'administration française."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-surface border border-slate-200">
              <Scale className="w-8 h-8 text-rolex mb-3" />
              <h4 className="font-serif font-bold text-slate-900 mb-2">Abattement Légal -10% / An</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Le malus écologique diminue de 10% par année entamée depuis la 1ère immatriculation. Nous optimisons le calendrier de dédouanement.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-slate-200">
              <FileCheck2 className="w-8 h-8 text-rolex mb-3" />
              <h4 className="font-serif font-bold text-slate-900 mb-2">Quitus Fiscal & COC Inclus</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Obtention du quitus auprès de la DGFIP et du Certificat de Conformité constructeur sans aucune démarche de votre part.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-slate-200">
              <ShieldCheck className="w-8 h-8 text-rolex mb-3" />
              <h4 className="font-serif font-bold text-slate-900 mb-2">Carte Grise Définitive</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Immatriculation provisoire WW pour rouler immédiatement, suivie de la délivrance de la carte grise française à votre domicile.
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
