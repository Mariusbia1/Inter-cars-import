import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Phone, Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuxuryButton } from './LuxuryButton';
import { BrandLogo } from './BrandLogo';
import { useSettings } from '../../context/SettingsContext';

export const Navbar = () => {
  const { settings } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Notre Histoire', path: '/notre-histoire' },
    { name: 'Notre Méthode', path: '/notre-methode' },
    { name: 'Garanties & Confiance', path: '/garanties' },
    { name: 'Véhicules Disponibles', path: '/vehicules-livres' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-[#072418]/85 backdrop-blur-xl border-b border-gold/30 shadow-[0_4px_30px_rgba(0,0,0,0.4)] ${
          isScrolled ? 'py-1 shadow-[0_4px_35px_rgba(0,0,0,0.55)] border-gold/40' : 'py-1.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* LIGNE DU HAUT : Logo officiel à gauche | Téléphone & Bouton d'action à droite */}
          <div className="flex items-center justify-between py-2 sm:py-2.5 border-b border-white/15 transition-colors duration-300">
            {/* Logo Officiel */}
            <Link to="/" className="flex items-center group py-0.5" aria-label="Accueil Inter Cars Import">
              <BrandLogo size="md" />
            </Link>

            {/* Téléphone + CTA "DÉMARRER MON PROJET" */}
            <div className="hidden sm:flex items-center gap-3 md:gap-4">
              <a
                href={`tel:${settings.phoneRaw || '+33493000000'}`}
                className="flex items-center gap-2.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all group border shadow-sm bg-white/10 hover:bg-white/20 border-white/20 hover:border-gold text-white hover:text-gold"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 bg-gold/20 text-gold border border-gold/40">
                  <Phone className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <span className="font-semibold text-white tracking-wide group-hover:text-gold transition-colors">{settings.phone}</span>
              </a>

              <LuxuryButton
                to="/contact"
                variant="gold"
                size="md"
                className="shadow-gold-glow font-bold tracking-widest text-xs"
              >
                Démarrer mon projet
              </LuxuryButton>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-2 sm:hidden">
              <a
                href={`tel:${settings.phoneRaw || '+33493000000'}`}
                className="p-2 rounded-lg border bg-white/10 text-gold border-white/20"
                aria-label="Appeler"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-rolex text-gold border border-gold/40 transition-colors"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* LIGNE DU BAS : Navigation (Texte Blanc, Hover & Focus Or, Trait Or sur page active) */}
          <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-3 py-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onMouseEnter={() => setHoveredPath(link.path)}
                onMouseLeave={() => setHoveredPath(null)}
                className={({ isActive }) =>
                  `px-4 py-1.5 text-xs xl:text-sm tracking-wider uppercase transition-colors duration-200 rounded relative group ${
                    isActive
                      ? 'text-white font-extrabold'
                      : 'text-white/90 hover:text-gold focus:text-gold font-semibold'
                  }`
                }
              >
                {({ isActive }) => {
                  const isHovered = hoveredPath === link.path && !isActive;

                  return (
                    <>
                      <span className={isActive ? 'text-white' : 'group-hover:text-gold group-focus:text-gold transition-colors'}>
                        {link.name}
                      </span>

                      {/* TRAIT OR SI LA PAGE EST ACTIVE */}
                      {isActive && (
                        <motion.span
                          layoutId="navMenuIndicatorActive"
                          className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-gold shadow-gold-glow rounded-full"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}

                      {/* TRAIT OR SI LE LIEN EST EN HOVER / FOCUS */}
                      {isHovered && (
                        <motion.span
                          initial={{ opacity: 0, scaleX: 0 }}
                          animate={{ opacity: 1, scaleX: 1 }}
                          exit={{ opacity: 0, scaleX: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute bottom-0 left-3 right-3 h-[2px] bg-gold/90 shadow-gold-glow rounded-full"
                        />
                      )}
                    </>
                  );
                }}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Menu Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-[65px] z-30 bg-[#072418]/95 backdrop-blur-2xl border-b border-gold/40 lg:hidden overflow-hidden shadow-2xl"
          >
            <div className="px-5 py-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-3 rounded-lg text-sm uppercase tracking-wider transition-colors ${
                        isActive
                          ? 'bg-white/15 text-gold border border-gold/50 font-bold shadow-gold-glow'
                          : 'text-white hover:bg-white/10 hover:text-gold font-semibold'
                      }`
                    }
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-gold" />
                  </NavLink>
                ))}
              </nav>

              <div className="pt-4 border-t border-white/15 space-y-3">
                <a
                  href={`tel:${settings.phoneRaw || '+33493000000'}`}
                  className="flex items-center justify-center gap-2.5 py-3 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-semibold hover:text-gold hover:border-gold transition-colors"
                >
                  <Phone className="w-4 h-4 text-gold" />
                  <span>{settings.phone}</span>
                </a>

                <LuxuryButton
                  to="/contact"
                  variant="gold"
                  size="md"
                  className="w-full justify-center text-xs tracking-widest font-bold"
                >
                  Démarrer mon projet
                </LuxuryButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
