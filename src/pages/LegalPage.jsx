import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { SEO } from '../components/common/SEO';

export const LegalPage = () => {
  const { pathname } = useLocation();
  const { settings } = useSettings();

  const isPrivacy = pathname.includes('confidentialite');
  const isCgv = pathname.includes('cgv');

  const title = isPrivacy
    ? 'Politique de Confidentialité'
    : isCgv
    ? 'Conditions Générales de Vente'
    : 'Mentions Légales';

  return (
    <div className="pt-32 sm:pt-36 bg-surface min-h-screen">
      <SEO
        title={title}
        description={`${title} de la société Inter Cars Import SAS, spécialiste de la vente de véhicules d'occasion en France.`}
        noIndex={false}
      />
      <section className="bg-rolex-dark text-white py-12 sm:py-16 relative overflow-hidden border-b border-gold/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-4 uppercase tracking-widest">
            <Link to="/" className="hover:text-gold transition-colors">Accueil</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gold" />
            <span className="text-gold font-semibold">{title}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-black text-white">
            {title}
          </h1>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate text-sm leading-relaxed text-slate-600 space-y-8">
          {isPrivacy ? (
            <>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">1. Collecte des Données Personnelles</h3>
                <p>
                  Dans le cadre de son activité de vente automobile et de relation client, <strong>Inter Cars Import SAS</strong> collecte exclusivement les données strictement nécessaires au traitement des demandes d'information, à l'établissement des devis et aux formalités administratives d'immatriculation (Nom, prénom, email, téléphone, ville de livraison).
                </p>
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">2. Confidentialité & Non-Cession</h3>
                <p>
                  Vos coordonnées restent strictement confidentielles et protégées. Elles ne font l'objet d'aucune cession, revente ou transfert à des tiers à des fins publicitaires.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">3. Vos Droits (RGPD)</h3>
                <p>
                  Conformément au Règlement Général sur la Protection des Données (RGPD n° 2016/679) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de portabilité et de suppression de vos données sur simple demande par email à : <strong className="text-slate-900">{settings.email}</strong>.
                </p>
              </div>
            </>
          ) : isCgv ? (
            <>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">1. Objet du Contrat & Bon de Commande Officiel</h3>
                <p>
                  Les présentes Conditions Générales de Vente (CGV) régissent l'ensemble des ventes de véhicules d'occasion conclues entre la société <strong>INTER CARS IMPORT SAS</strong> (immatriculée sous le SIREN 927 942 847 au RCS de Toulouse) et ses acquéreurs.<br /><br />
                  Toute commande donne obligatoirement lieu à l'émission préalable d'un <strong>Bon de Commande officiel nominatif</strong> détaillant l'identification technique précise du véhicule (marque, modèle, motorisation, kilométrage certifié, options, numéro de série VIN), le prix total TTC clés en main, les modalités de livraison, ainsi que les mentions légales d'INTER CARS IMPORT SAS.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">2. Audit 150 Points & Transparence</h3>
                <p>
                  Chaque véhicule vendu bénéficie impérativement de notre protocole d'inspection certifié en 150 points de contrôle (mécanique, diagnostic électronique, carrosserie, freinage, trains roulants) et de la remise d'un historique constructeur et administratif transparent.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">3. Modalités de Règlement & Sécurisation Bancaire</h3>
                <p>
                  Afin de garantir une traçabilité totale et la sécurité des fonds conformément aux réglementations financières françaises, les règlements sont effectués exclusivement par virement bancaire sur le <strong>compte bancaire professionnel officiel ouvert au nom d'INTER CARS IMPORT SAS</strong> auprès d'un établissement bancaire habilité en France.<br />
                  <strong>Aucun versement n'est exigible avant la signature préalable d'un Bon de Commande en bonne et due forme</strong> signé par les deux parties.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">4. Modalités de Livraison & Immatriculation</h3>
                <p>
                  La livraison soignée du véhicule s'effectue partout en France métropolitaine via nos transporteurs logistiques spécialisés après confirmation des formalités administratives et émission du certificat d'immatriculation.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">5. Droit de Rétractation & Garanties Légales</h3>
                <p>
                  Pour toute vente conclue à distance, l'acquéreur particulier dispose d'un délai légal de rétractation de 14 jours francs à compter de la livraison du véhicule, conformément aux articles L. 221-18 et suivants du Code de la Consommation.<br /><br />
                  Tous les véhicules bénéficient de plein droit de la <strong>garantie légale de conformité</strong> (articles L. 217-3 et suivants du Code de la Consommation) et de la <strong>garantie légale contre les vices cachés</strong> (articles 1641 et suivants du Code Civil), en complément de toute garantie constructeur ou commerciale applicable.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-3">1. Éditeur de la Plateforme (Identification Légale)</h3>
                <p className="space-y-1.5">
                  Le présent site web <strong>https://inter-cars-import.fr</strong> est édité et exploité par :<br /><br />
                  <strong>Dénomination sociale :</strong> INTER CARS IMPORT SAS<br />
                  <strong>Forme juridique :</strong> Société par Actions Simplifiée (SAS)<br />
                  <strong>Numéro SIREN :</strong> 927 942 847<br />
                  <strong>Numéro SIRET (Siège) :</strong> 927 942 847 00017<br />
                  <strong>RCS :</strong> Immatriculée au Registre du Commerce et des Sociétés de Toulouse sous le numéro 927 942 847<br />
                  <strong>Numéro de TVA intracommunautaire :</strong> FR42927942847<br />
                  <strong>Activité principale (Code NAF / APE) :</strong> 45.11Z — Commerce de voitures et de véhicules automobiles légers<br />
                  <strong>Siège social officiel :</strong> 36 B Chemin de Belbèze, 31240 Saint-Jean, France<br />
                  <strong>Accueil & Bureau commercial :</strong> 55 Av. Louis Breguet, 31400 Toulouse, France<br />
                  <strong>Téléphone :</strong> {settings.phone}<br />
                  <strong>Email :</strong> {settings.email}<br />
                  <strong>Directeur de la publication :</strong> M. Samuel Romain ULRICH, en qualité de Président d'INTER CARS IMPORT SAS.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">2. Prestataire d'Hébergement</h3>
                <p>
                  Le site est hébergé par :<br /><br />
                  <strong>Hébergeur :</strong> Hostinger International Ltd<br />
                  <strong>Adresse légale :</strong> 61 Lordou Vironos Street, 6023 Larnaca, Chypre<br />
                  <strong>Site web & contact :</strong> <a href="https://www.hostinger.fr" target="_blank" rel="noopener noreferrer" className="text-rolex underline hover:text-gold">https://www.hostinger.fr</a> — Téléphone : +370 645 03378<br />
                  <strong>Gestion du nom de domaine :</strong> Enregistrement auprès de l'AFNIC via BookMyName / Scaleway SAS (8 Rue de la Ville l'Évêque, 75008 Paris).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">3. Activité Professionnelle Automobile</h3>
                <p>
                  INTER CARS IMPORT SAS est une société commerciale agréée spécialisée dans le commerce, l'importation et la vente de véhicules automobiles d'occasion récents et certifiés. L'ensemble des prestations et ventes est réalisé en stricte conformité avec le Code du Commerce et le Code de la Consommation français.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">4. Propriété Intellectuelle</h3>
                <p>
                  L'ensemble des marques, logos, graphismes, photographies et textes figurant sur ce site sont la propriété exclusive d'INTER CARS IMPORT SAS ou de ses partenaires officiels. Toute reproduction, représentation, modification ou diffusion totale ou partielle sans autorisation écrite expresse est strictement interdite.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">5. Règlement des Litiges & Médiation</h3>
                <p>
                  En cas de réclamation, le client est invité à contacter en priorité le service commercial d'INTER CARS IMPORT SAS à l'adresse <strong className="text-slate-900">{settings.email}</strong>. Conformément aux dispositions de l'article L. 612-1 du Code de la Consommation, tout consommateur a le droit de recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable du litige.
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};
