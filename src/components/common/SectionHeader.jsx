import React from 'react';
import { motion } from 'framer-motion';

export const SectionHeader = ({
  badge,
  title,
  subtitle,
  centered,
  align = 'center', // 'center' | 'left'
  theme = 'light', // 'light' | 'dark'
  dark = false,
  className = '',
}) => {
  const isDark = dark || theme === 'dark';
  const isCentered = centered !== undefined ? centered : align === 'center';

  return (
    <div
      className={`max-w-3xl mb-8 sm:mb-12 ${
        isCentered ? 'mx-auto text-center' : 'text-left'
      } ${className}`}
    >
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-widest uppercase mb-2.5 border shadow-xs"
          style={{
            backgroundColor: isDark ? 'rgba(0, 96, 57, 0.4)' : 'rgba(0, 96, 57, 0.08)',
            borderColor: isDark ? '#C6A15B' : 'rgba(0, 96, 57, 0.25)',
            color: isDark ? '#E5C17B' : '#006039',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          {badge}
        </motion.div>
      )}

      {title && (
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className={`text-xl sm:text-2xl md:text-3xl lg:text-[2rem] font-serif font-bold tracking-normal leading-snug ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          {title}
        </motion.h2>
      )}

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={`mt-2.5 text-xs sm:text-sm md:text-[15px] leading-relaxed font-light ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};
