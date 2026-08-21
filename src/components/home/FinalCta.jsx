import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import { LuxuryButton } from '../common/LuxuryButton';

export const FinalCta = () => {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-rolex-forest via-rolex to-rolex-forest text-white relative overflow-hidden shadow-2xl border-t border-gold/40">
      {/* Texture de fond dorée */}
      <div className="absolute inset-0 bg-[radial-gradient(#C6A15B_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-gold/40 text-gold text-xs font-semibold uppercase tracking-widest backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold animate-spin" style={{ animationDuration: '6s' }} />
          <span>Votre Projet Automobile Clé en Main</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight"
        >
          Prêt à trouver la configuration de vos rêves <br className="hidden sm:inline" />
          <span className="text-gold-gradient">au meilleur prix européen ?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-light leading-relaxed"
        >
          Confiez-nous votre cahier des charges. Notre équipe de curateurs vous présente les premières opportunités vérifiées sous 48 heures ouvrées.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <LuxuryButton
            to="/contact"
            variant="gold"
            size="lg"
            icon={ArrowRight}
            className="w-full sm:w-auto shadow-gold-glow"
          >
            Lancer ma recherche personnalisée
          </LuxuryButton>

          <a
            href="tel:+33493000000"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-sm bg-white/10 hover:bg-white/20 border border-white/30 text-white text-sm font-semibold uppercase tracking-wider transition-colors"
          >
            <Phone className="w-4 h-4 text-gold" />
            <span>Échanger par téléphone</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
