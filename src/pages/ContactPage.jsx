import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Phone, Mail, MapPin, Building2, Clock, ShieldCheck, Award, FileCheck, Truck, ArrowRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { LuxuryButton } from '../components/common/LuxuryButton';
import { SEO } from '../components/common/SEO';

export const ContactPage = () => {
  const { settings } = useSettings();

  const phoneRaw = settings.phoneRaw || '+33493000000';
  const commercialAddr = settings.commercialAddress || settings.address || "Siège Commercial, Axe Cannes — Monaco";
  const headquartersAddr = settings.headquartersAddress || "Siège Social, France";
  const emailAddr = settings.email || 'contact@inter-cars-import.fr';
  const hours = settings.businessHours || "Du Lundi au Samedi : 08h30 - 19h30";

  const contactStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    'mainEntity': {
      '@type': 'AutoDealer',
      'name': 'Inter Cars Import',
      'telephone': phoneRaw,
      'email': emailAddr,
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': commercialAddr,
        'addressCountry': 'FR'
      },
      'openingHours': 'Mo-Sa 08:30-19:30'
    }
  };

  return (
    <div className="pt-32 sm:pt-36 bg-surface min-h-screen">
      <SEO
        title="Contact & Conciergerie Automobile | Inter Cars Import"
        description="Contactez nos conseillers automobiles Inter Cars Import par téléphone, email ou rendez-vous en agence pour votre projet d'achat de véhicule d'occasion certifié."
        structuredData={contactStructuredData}
      />
      {/* Hero Page Header */}
      <section className="bg-rolex-dark text-white py-14 sm:py-20 relative overflow-hidden border-b border-gold/30">
        <div className="absolute inset-0 bg-[radial-gradient(#C6A15B_1px,transparent_1px)] [background-size:32px_32px] opacity-5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-4 uppercase tracking-widest">
            <Link to="/" className="hover:text-gold transition-colors">Accueil</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gold" />
            <span className="text-gold font-semibold">Contact & Coordonnées</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">
            Contact & <span className="text-gold-gradient">Conciergerie Automobile</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Notre équipe est à votre disposition pour vous conseiller, répondre à vos questions et organiser l'acquisition de votre véhicule dans les meilleures conditions.
          </p>
        </div>
      </section>

      {/* Main Content : Grille des Coordonnées & Adresses */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Cartes Principales de Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Adresse Commerciale */}
            <div className="p-7 rounded-3xl bg-surface border border-slate-200/90 shadow-luxury-card hover:border-gold/50 transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rolex text-gold border border-gold/30 flex items-center justify-center shadow-gold-glow/20 group-hover:scale-105 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold/15 text-rolex-dark border border-gold/30 inline-block mb-2">
                    Siège Commercial
                  </span>
                  <h3 className="font-serif font-bold text-slate-900 text-lg">
                    Siège Commercial
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {commercialAddr}
                </p>
              </div>
              <div className="pt-6 border-t border-slate-200/60 mt-6 text-xs text-slate-400">
                Sur rendez-vous personnalisé
              </div>
            </div>

            {/* 2. Siège Social */}
            <div className="p-7 rounded-3xl bg-surface border border-slate-200/90 shadow-luxury-card hover:border-gold/50 transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rolex-forest text-gold border border-gold/30 flex items-center justify-center shadow-gold-glow/20 group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 inline-block mb-2">
                    Siège Juridique
                  </span>
                  <h3 className="font-serif font-bold text-slate-900 text-lg">
                    Siège Social
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {headquartersAddr}
                </p>
              </div>
              <div className="pt-6 border-t border-slate-200/60 mt-6 text-xs text-slate-400">
                Administration & Direction
              </div>
            </div>

            {/* 3. Téléphone Direct */}
            <div className="p-7 rounded-3xl bg-surface border border-slate-200/90 shadow-luxury-card hover:border-gold/50 transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rolex text-gold border border-gold/30 flex items-center justify-center shadow-gold-glow/20 group-hover:scale-105 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 inline-block mb-2">
                    Ligne Directe
                  </span>
                  <h3 className="font-serif font-bold text-slate-900 text-lg">
                    Téléphone
                  </h3>
                </div>
                <div>
                  <a
                    href={`tel:${phoneRaw}`}
                    className="text-base font-bold text-rolex hover:text-rolex-dark transition-colors block"
                  >
                    {settings.phone}
                  </a>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span>{hours}</span>
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-200/60 mt-6">
                <a
                  href={`tel:${phoneRaw}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rolex hover:text-gold transition-colors"
                >
                  <span>Appeler maintenant</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 4. Courriel Électronique */}
            <div className="p-7 rounded-3xl bg-surface border border-slate-200/90 shadow-luxury-card hover:border-gold/50 transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rolex-forest text-gold border border-gold/30 flex items-center justify-center shadow-gold-glow/20 group-hover:scale-105 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold/15 text-rolex-dark border border-gold/30 inline-block mb-2">
                    Échanges Écrits
                  </span>
                  <h3 className="font-serif font-bold text-slate-900 text-lg">
                    Courriel
                  </h3>
                </div>
                <div>
                  <a
                    href={`mailto:${emailAddr}`}
                    className="text-sm font-bold text-rolex hover:text-rolex-dark transition-colors break-all block"
                  >
                    {emailAddr}
                  </a>
                  <p className="text-xs text-slate-500 mt-1">
                    Réponse rapide assurée
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-200/60 mt-6">
                <a
                  href={`mailto:${emailAddr}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rolex hover:text-gold transition-colors"
                >
                  <span>Envoyer un courriel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Grand Panneau de Réassurance & Services */}
          <div className="rounded-3xl bg-gradient-to-br from-rolex-dark via-rolex-900 to-rolex-forest text-white p-8 sm:p-12 border border-gold/40 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-bold uppercase tracking-wider border border-gold/30">
                <Award className="w-3.5 h-3.5" />
                <span>Accompagnement Automobile Haut de Gamme</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white leading-tight">
                Un Service Transparent & Sécurisé <br />
                <span className="text-gold-gradient">À Chaque Étape de Votre Projet</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left pt-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-2">
                  <ShieldCheck className="w-6 h-6 text-gold" />
                  <h4 className="font-serif font-bold text-white text-sm">Audit 150 Points</h4>
                  <p className="text-xs text-slate-300 font-light leading-relaxed">
                    Inspection physique complète et traçabilité certifiée de l'historique constructeur.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-2">
                  <Award className="w-6 h-6 text-gold" />
                  <h4 className="font-serif font-bold text-white text-sm">Réseau Officiel</h4>
                  <p className="text-xs text-slate-300 font-light leading-relaxed">
                    Véhicules issus directement des concessions partenaires officielles en France.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-2">
                  <FileCheck className="w-6 h-6 text-gold" />
                  <h4 className="font-serif font-bold text-white text-sm">Carte Grise Incluse</h4>
                  <p className="text-xs text-slate-300 font-light leading-relaxed">
                    Gestion intégrale des démarches administratives françaises d'immatriculation.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-2">
                  <Truck className="w-6 h-6 text-gold" />
                  <h4 className="font-serif font-bold text-white text-sm">Livraison Sécurisée</h4>
                  <p className="text-xs text-slate-300 font-light leading-relaxed">
                    Acheminement soigné et remise en main propre partout en France.
                  </p>
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={`tel:${phoneRaw}`}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gold hover:bg-gold-light text-rolex-950 font-bold text-xs uppercase tracking-wider transition-all shadow-gold-glow flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Appeler la Conciergerie</span>
                </a>

                <Link
                  to="/vehicules-disponibles"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/20 flex items-center justify-center gap-2"
                >
                  <span>Consulter le Catalogue</span>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
