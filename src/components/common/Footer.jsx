import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Shield, CheckCircle2, Award } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useSettings } from '../../context/SettingsContext';

export const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-rolex-dark text-slate-300 border-t border-gold/30 relative overflow-hidden">
      {/* Texture de fond discrète */}
      <div className="absolute inset-0 bg-[radial-gradient(#C6A15B_1px,transparent_1px)] [background-size:32px_32px] opacity-5 pointer-events-none" />

      {/* Bannière de réassurance supérieure (sans garantie 12/24 mois) */}
      <div className="border-b border-white/10 bg-rolex-forest/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Shield className="w-6 h-6 text-gold shrink-0" />
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Audit 150 Points</p>
                <p className="text-[11px] text-slate-400">Contrôle physique certifié</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Award className="w-6 h-6 text-gold shrink-0" />
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Achat & Vente</p>
                <p className="text-[11px] text-slate-400">Véhicules d'exception vérifiés</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Shield className="w-6 h-6 text-gold shrink-0" />
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Paiement Sécurisé</p>
                <p className="text-[11px] text-slate-400">Transactions 100% sécurisées</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-gold shrink-0" />
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Livraison Clé en Main</p>
                <p className="text-[11px] text-slate-400">À domicile ou au showroom</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Corps Principal du Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Colonne 1 & 2 : Présentation & Wordmark */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="inline-block group" aria-label="Accueil Inter Cars Import">
              <BrandLogo size="lg" />
            </Link>

            <p className="text-sm text-slate-300 leading-relaxed max-w-md font-light">
              Maison spécialisée dans l'achat, la vente, la recherche sur mesure, l'audit technique rigoureux en 150 points et la livraison de véhicules de prestige et sportifs.
            </p>
          </div>

          {/* Colonne 3 : Navigation Rapide */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" /> Navigation
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li>
                <Link to="/" className="text-slate-300 hover:text-gold transition-colors flex items-center gap-1.5">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/notre-histoire" className="text-slate-300 hover:text-gold transition-colors flex items-center gap-1.5">
                  Notre Histoire
                </Link>
              </li>
              <li>
                <Link to="/notre-methode" className="text-slate-300 hover:text-gold transition-colors flex items-center gap-1.5">
                  Notre Méthode
                </Link>
              </li>
              <li>
                <Link to="/garanties" className="text-slate-300 hover:text-gold transition-colors flex items-center gap-1.5">
                  Garanties & Confiance
                </Link>
              </li>
              <li>
                <Link to="/vehicules-livres" className="text-slate-300 hover:text-gold transition-colors flex items-center gap-1.5">
                  Véhicules Disponibles
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-gold transition-colors flex items-center gap-1.5">
                  Devis & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Nos Services & Prestations */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" /> Nos Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-gold">›</span> Achat de Véhicules de Prestige
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold">›</span> Vente & Dépôt-Vente VIP
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold">›</span> Recherche Personnalisée sur Mesure
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold">›</span> Audit Technique 150 Points
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold">›</span> Livraison Sécurisée à Domicile
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold">›</span> Démarches Administratives Clé en Main
              </li>
            </ul>
          </div>

          {/* Colonne 5 : Coordonnées & Showroom (Sans Horaires) */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" /> Contact & Showroom
            </h4>
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a href={`tel:${settings.phoneRaw || '+33493000000'}`} className="hover:text-gold transition-colors font-semibold">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-gold transition-colors">
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne de séparation dorée */}
        <div className="gold-divider my-10" />

        {/* Barre Inférieure : Mentions Légales & Droits */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Inter Cars Import. Tous droits réservés.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link to="/mentions-legales" className="hover:text-gold transition-colors">
              Mentions Légales
            </Link>
            <span className="text-white/20">•</span>
            <Link to="/confidentialite" className="hover:text-gold transition-colors">
              Politique de Confidentialité
            </Link>
            <span className="text-white/20">•</span>
            <Link to="/cgv" className="hover:text-gold transition-colors">
              Conditions Générales de Vente
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
