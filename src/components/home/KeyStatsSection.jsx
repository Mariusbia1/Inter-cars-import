import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '../common/SectionHeader';
import { StatCounter } from '../common/StatCounter';
import { keyStats } from '../../data/statsData';

export const KeyStatsSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-surface relative overflow-hidden border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Bilan Chiffré"
          title="Les Chiffres de la Performance"
          subtitle="Notre réputation s'est bâtie sur la constance de nos résultats, la rigueur de nos audits et la satisfaction absolue de nos acquéreurs."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {keyStats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-gold/60 shadow-luxury-card hover:shadow-luxury-hover transition-all text-center group"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-rolex group-hover:text-gold-dark transition-colors mb-2">
                <StatCounter
                  value={stat.value}
                  prefix={stat.prefix || ''}
                  suffix={stat.suffix || ''}
                />
              </div>
              <h3 className="text-base font-serif font-bold text-slate-900 mb-2">
                {stat.label}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
