import React from 'react';
import { motion } from 'framer-motion';

export const KpiCard = ({ title, value, change, subtitle, icon: Icon, color = 'rolex' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        <div className="w-10 h-10 rounded-xl bg-rolex-50 text-rolex border border-rolex/20 flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-1">
          {value}
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">{subtitle}</span>
          {change && (
            <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {change}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
