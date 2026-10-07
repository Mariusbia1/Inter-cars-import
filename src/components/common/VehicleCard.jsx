import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gauge, Zap, Calendar, MapPin, ArrowUpRight, ShieldCheck, CheckCircle2, Tag } from 'lucide-react';
import { LuxuryButton } from './LuxuryButton';

export const VehicleCard = ({ vehicle, onSelect, className = '' }) => {
  if (!vehicle) return null;

  const vehicleUrl = `/vehicules/${vehicle.id}`;

  const hasPrice = Boolean(vehicle.price && Number(vehicle.price) > 0);
  const formattedPrice = hasPrice
    ? Number(vehicle.price).toLocaleString('fr-FR') + ' €'
    : null;

  const discount = vehicle.discount_percent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`group bg-white rounded-xl overflow-hidden border border-slate-200/80 hover:border-gold/60 shadow-luxury-card hover:shadow-luxury-hover transition-all duration-300 flex flex-col ${className}`}
    >
      {/* Image du véhicule - Lien cliquable vers la page produit */}
      <Link to={vehicleUrl} className="relative h-60 sm:h-64 overflow-hidden bg-slate-900 block">
        <img
          src={vehicle.image_url}
          alt={vehicle.title}
          loading="lazy"
          decoding="async"
          width="600"
          height="340"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Badge Prix & Remise superposé */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10 pointer-events-none">
          {hasPrice ? (
            <>
              <span className="bg-slate-950/80 backdrop-blur-md text-white font-extrabold text-xs px-2.5 py-1 rounded-md border border-white/20 shadow-md">
                {formattedPrice}
              </span>
              {discount && (
                <span className="bg-[#fcd34d] text-slate-950 font-extrabold text-[11px] px-2 py-1 rounded-md shadow-md">
                  -{discount}%
                </span>
              )}
            </>
          ) : (
            <span className="bg-slate-950/85 backdrop-blur-md text-amber-300 font-extrabold text-xs px-2.5 py-1 rounded-md border border-amber-300/30 shadow-md">
              En Arrivage
            </span>
          )}
        </div>
      </Link>

      {/* Contenu Texte sous l'image */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Ligne catégorie & localisation */}
          <div className="flex items-center justify-between gap-2 mb-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-rolex bg-rolex-50 px-2.5 py-1 rounded border border-rolex/20">
              {vehicle.category}
            </span>
            <span className="text-slate-500 flex items-center gap-1 font-medium truncate">
              <MapPin className="w-3.5 h-3.5 text-gold shrink-0" /> {vehicle.delivery_city || 'France'}
            </span>
          </div>

          <Link to={vehicleUrl} className="block group-hover:text-rolex transition-colors">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 line-clamp-1 mb-3 hover:text-rolex">
              {vehicle.title}
            </h3>
          </Link>

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
              <span className="text-[10px] text-slate-400">Kilométrage</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded bg-slate-50 text-center">
              <Zap className="w-4 h-4 text-gold mb-1" />
              <span className="font-semibold text-slate-900">{vehicle.power_hp} ch</span>
              <span className="text-[10px] text-slate-400">Puissance</span>
            </div>
          </div>

          {/* Badge Audit & Garantie sous les specs */}
          <div className="flex items-center justify-between text-xs text-slate-600 mb-4 px-1">
            <span className="flex items-center gap-1.5 font-semibold text-rolex-900">
              <ShieldCheck className="w-4 h-4 text-gold" /> Audit 150 points validé
            </span>
            <span className="flex items-center gap-1 text-slate-400 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {vehicle.warranty || 'Garantie incluse'}
            </span>
          </div>
        </div>

        <div className="pt-1">
          <LuxuryButton
            to={vehicleUrl}
            onClick={() => onSelect && onSelect(vehicle)}
            variant="rolex"
            size="sm"
            className="w-full justify-between font-semibold"
            icon={ArrowUpRight}
          >
            Fiche détaillée du véhicule
          </LuxuryButton>
        </div>
      </div>
    </motion.div>
  );
};
