import React from 'react';
import { motion } from 'framer-motion';
import { Gauge, Zap, Calendar, MapPin, ArrowUpRight, ShieldCheck, CheckCircle2, Award } from 'lucide-react';
import { LuxuryButton } from './LuxuryButton';

export const VehicleCard = ({ vehicle, onSelect, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`group bg-white rounded-xl overflow-hidden border border-slate-200/80 hover:border-gold/60 shadow-luxury-card hover:shadow-luxury-hover transition-all duration-300 flex flex-col ${className}`}
    >
      {/* Image Container */}
      <div className="relative h-60 sm:h-64 overflow-hidden bg-slate-900">
        <img
          src={vehicle.image_url}
          alt={vehicle.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Badges Flottants */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="px-2.5 py-1 rounded bg-rolex/90 backdrop-blur-md text-white text-[11px] font-semibold tracking-wider uppercase border border-gold/40">
            {vehicle.category}
          </span>
          {vehicle.is_featured && (
            <span className="px-2.5 py-1 rounded bg-gold/90 backdrop-blur-md text-rolex-950 text-[11px] font-bold tracking-wider uppercase">
              Exclusivité
            </span>
          )}
        </div>

        {/* Pays de Provenance */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {vehicle.origin_country.split(' ')[0]}
          </span>
        </div>

        {/* Badge Certification & Sécurité (Zéro prix) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="bg-rolex-forest/90 backdrop-blur-md border border-gold/40 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gold" />
            <div>
              <p className="text-[10px] text-gold font-bold uppercase tracking-wider">Audit 150 Points</p>
              <p className="text-xs font-semibold text-white">{vehicle.certification || 'Concession Officielle'}</p>
            </div>
          </div>
          <span className="text-white/80 text-xs flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-gold" />
            {vehicle.delivery_city}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between bg-white">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold tracking-widest text-gold-dark">{vehicle.brand}</span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-rolex" /> {vehicle.warranty || 'Garantie Incluse'}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 group-hover:text-rolex transition-colors line-clamp-1 mb-4">
            {vehicle.title}
          </h3>

          {/* Grille des caractéristiques */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 mb-4 text-xs text-slate-600">
            <div className="flex flex-col items-center justify-center p-2 rounded bg-slate-50 text-center">
              <Calendar className="w-4 h-4 text-rolex mb-1" />
              <span className="font-semibold text-slate-900">{vehicle.year}</span>
              <span className="text-[10px] text-slate-400">Mise en circ.</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded bg-slate-50 text-center">
              <Gauge className="w-4 h-4 text-rolex mb-1" />
              <span className="font-semibold text-slate-900">{vehicle.mileage?.toLocaleString('fr-FR')} km</span>
              <span className="text-[10px] text-slate-400">Kilométrage certifié</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded bg-slate-50 text-center">
              <Zap className="w-4 h-4 text-gold mb-1" />
              <span className="font-semibold text-slate-900">{vehicle.power_hp} ch</span>
              <span className="text-[10px] text-slate-400">Puissance</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <LuxuryButton
            onClick={() => onSelect && onSelect(vehicle)}
            variant="rolex"
            size="sm"
            className="w-full justify-between font-semibold"
            icon={ArrowUpRight}
          >
            Fiche de livraison & audit
          </LuxuryButton>
        </div>
      </div>
    </motion.div>
  );
};
