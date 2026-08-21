import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';

export const LegalPage = () => {
  const { pathname } = useLocation();

  const isPrivacy = pathname.includes('confidentialite');
  const isCgv = pathname.includes('cgv');

  const title = isPrivacy
    ? 'Politique de Confidentialité'
    : isCgv
    ? 'Conditions Générales de Vente'
    : 'Mentions Légales';

  return (
    <div className="pt-32 sm:pt-36 bg-surface min-h-screen">
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
                  Dans le cadre de son activité de conciergerie et de courtage automobile, <strong>Inter Cars Import</strong> collecte exclusivement les données strictement nécessaires au traitement des demandes de devis et à l'établissement des certificats d'immatriculation (Nom, prénom, email, téléphone, adresse postale).
                </p>
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">2. Confidentialité & Non-Cession</h3>
                <p>
                  Vos coordonnées privées ne font l'objet d'aucune cession, revente ou transfert à des tiers à des fins publicitaires. Elles sont conservées sous chiffrement sécurisé.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">3. Vos Droits (RGPD)</h3>
                <p>
                  Conformément au Règlement Général sur la Protection des Données, vous disposez d'un droit d'accès, de rectification et de suppression de vos données sur simple demande par email à : <strong className="text-slate-900">contact@intercarsimport.fr</strong>.
                </p>
              </div>
            </>
          ) : isCgv ? (
            <>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">1. Objet du Mandat de Recherche</h3>
                <p>
                  Inter Cars Import agit en qualité de mandataire et curateur automobile indépendant. Le mandat définit les critères exclusifs de recherche convenus avec le mandant (marque, modèle, tolérance kilométrique, budget plafond).
                </p>
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">2. Audit & Sécurisation des Fonds</h3>
                <p>
                  Toute transaction d'achat est subordonnée à la validation préalable du rapport d'audit 150 points de contrôle. Les fonds sont déposés sur un compte séquestre bancaire dédié et ne sont transférés qu'après accord formel du client.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">3. Délais & Livraison</h3>
                <p>
                  La livraison s'effectue sous 7 à 14 jours ouvrés suivant la validation de l'audit et l'obtention des documents d'immatriculation provisoires.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">1. Éditeur de la Plateforme</h3>
                <p>
                  Le site web <strong>Inter Cars Import</strong> est édité par la société Inter Cars Import SAS, au capital de 100 000 €, immatriculée au RCS de Cannes.<br />
                  Siège social : Showroom Privé, Axe Cannes — Monaco.<br />
                  Directeur de la publication : Julien Marciano.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">2. Hébergement</h3>
                <p>
                  Plateforme hébergée sur des infrastructures cloud haute disponibilité et conformes aux exigences européennes de souveraineté des données.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">3. Propriété Intellectuelle</h3>
                <p>
                  L'ensemble des visuels, logos, textes et éléments graphiques sont la propriété exclusive d'Inter Cars Import. Toute reproduction sans autorisation est formellement prohibée.
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};
