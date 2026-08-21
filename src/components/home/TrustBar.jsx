import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Wrench, Clock, Star, Award, CheckCircle2 } from 'lucide-react';
import { StatCounter } from '../common/StatCounter';

export const TrustBar = () => {
  const highlights = [
    {
      icon: Award,
      count: 185,
      suffix: '+',
      title: 'Véhicules Livrés',
      subtitle: 'Partout en France & Monaco'
    },
    {
      icon: Star,
      count: 100,
      suffix: '%',
      title: 'Clients Satisfaits',
      subtitle: 'Avis 5 étoiles vérifiés'
    },
    {
      icon: Wrench,
      count: 150,
      suffix: ' pts',
      title: 'Points de Contrôle',
      subtitle: 'Audit physique certifié'
    },
    {
      icon: Clock,
      count: 48,
      suffix: 'h',
      title: 'Délai de Sourcing',
      subtitle: 'Premières opportunités ciblées'
    }
  ];

  return (
    <section className="bg-gradient-to-r from-rolex-forest via-rolex to-rolex-forest text-white py-10 sm:py-12 border-y border-gold/30 relative overflow-hidden shadow-rolex-glow">
      {/* Texture de fond */}
      <div className="absolute inset-0 bg-[radial-gradient(#C6A15B_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-gold/20 hover:border-gold/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-gold/15 border border-gold/40 flex items-center justify-center text-gold group-hover:scale-110 transition-transform shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-white group-hover:text-gold-light transition-colors">
                    <StatCounter value={item.count} suffix={item.suffix} />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-gold uppercase tracking-wider">{item.title}</p>
                  <p className="text-[11px] text-slate-300 hidden sm:block">{item.subtitle}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
