import React from 'react';
import { ChevronUp, Phone, ShieldCheck, CheckCircle2, Truck, FileCheck, Award, Sparkles, ArrowRight, Clock } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const VehicleBuyBox = ({
  vehicle,
  selectedColor,
  onSelectColor,
  onRequestQuoteClick
}) => {
  const { settings } = useSettings();

  const formattedPrice = vehicle?.price
    ? vehicle.price.toLocaleString('fr-FR') + ' €'
    : '17 998 €';

  const discountPercent = vehicle?.discount_percent || 12;
  const monthlyEstimate = vehicle?.monthly_price || Math.round((vehicle?.price || 29990) / 110);

  const colors = vehicle?.colors && vehicle.colors.length > 0
    ? vehicle.colors
    : [
        { name: 'Dover White', hex: '#FFFFFF', status: 'ARRIVAGE', isDefault: true },
        { name: 'Noir Intense', hex: '#1A1A1A', status: 'EN STOCK' },
        { name: 'Gris Minéral', hex: '#7D848C', status: 'DISPONIBLE' }
      ];

  const currentColor = selectedColor || colors[0];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-md p-5 sm:p-6 flex flex-col justify-between space-y-5">
      
      {/* 1. Bloc Prix & Remise (Style exact de la capture) */}
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              {formattedPrice}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Badge Remise Jaune comme sur la capture */}
            <span className="bg-[#fcd34d] text-slate-900 font-extrabold text-xs sm:text-sm px-2.5 py-1 rounded-md flex items-center gap-1 shadow-xs">
              {discountPercent}%
            </span>
            <button
              onClick={onRequestQuoteClick}
              className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              title="Détails du prix"
              aria-label="Détails du prix"
            >
              <ChevronUp className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        </div>

        {/* Mention clé en main & Financement */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-1 text-xs text-slate-500">
          <span className="font-medium text-slate-700">TTC • Prix clé en main certifié</span>
          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Dès {monthlyEstimate} € / mois
          </span>
        </div>
      </div>

      {/* 2. Bloc Couleur Disponible & Variantes (Style exact de la capture) */}
      <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50 space-y-3">
        <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
          Couleur disponible
        </span>

        {/* Pastilles de sélection couleur */}
        <div className="flex flex-wrap items-center gap-3">
          {colors.map((col, idx) => {
            const isSelected = currentColor.name === col.name;
            return (
              <button
                key={idx}
                onClick={() => onSelectColor && onSelectColor(col)}
                className={`relative w-8 h-8 rounded-full transition-all focus:outline-none flex items-center justify-center ${
                  isSelected
                    ? 'ring-2 ring-[#4ea81e] ring-offset-2 scale-110 shadow-xs'
                    : 'ring-1 ring-slate-300 hover:scale-105 opacity-80 hover:opacity-100'
                }`}
                title={col.name}
                aria-label={`Couleur ${col.name}`}
              >
                <span
                  className="w-6 h-6 rounded-full border border-slate-200 shadow-inner"
                  style={{ backgroundColor: col.hex }}
                />
              </button>
            );
          })}
        </div>

        {/* Nom de la couleur sélectionnée & Statut (ARRIVAGE en orange comme sur la capture) */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs font-bold">
          <span className="text-slate-800 font-medium">
            {currentColor.name}
          </span>
          <span className={`px-2 py-0.5 rounded uppercase tracking-wider text-[11px] font-extrabold ${
            (currentColor.status || 'ARRIVAGE').includes('ARRIVAGE')
              ? 'text-[#f59e0b] bg-amber-50 border border-amber-200'
              : 'text-[#16a34a] bg-emerald-50 border border-emerald-200'
          }`}>
            {currentColor.status || 'ARRIVAGE'}
          </span>
        </div>
      </div>

      {/* 3. Gros Bouton d'Action Principal Vert (Style exact de la capture : ">> RECEVEZ UN DEVIS DÉTAILLÉ") */}
      <div className="space-y-2.5">
        <button
          onClick={onRequestQuoteClick}
          className="w-full py-4 px-6 rounded-lg bg-[#55a214] hover:bg-[#498e10] active:scale-[0.99] text-white font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-lg shadow-emerald-900/15 flex items-center justify-center gap-2.5 transition-all duration-200 group"
        >
          <span className="text-lg font-black tracking-tighter group-hover:translate-x-0.5 transition-transform">
            &gt;&gt;
          </span>
          <span>RECEVEZ UN DEVIS DÉTAILLÉ</span>
        </button>

        {/* Bouton secondaire d'appel direct */}
        <a
          href={`tel:${settings.phoneRaw || '+33493000000'}`}
          className="w-full py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-200"
        >
          <Phone className="w-3.5 h-3.5 text-rolex" />
          <span>Conseiller dédié : {settings.phone}</span>
        </a>
      </div>

      {/* 4. Badges de Réassurance & Garanties Clés */}
      <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold text-slate-800">Audit 150 points d'inspection certifié</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-gold shrink-0" />
          <span>Réseau Concessions Officielles en France</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-rolex shrink-0" />
          <span>Livraison clé en main à domicile sous 7 à 10 jours</span>
        </div>
        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Gestion complète de la carte grise & formalités</span>
        </div>
      </div>

      {/* 5. Délai de réservation */}
      <div className="p-3 rounded-lg bg-rolex/5 border border-rolex/15 text-[11px] text-rolex-dark flex items-center gap-2">
        <Clock className="w-4 h-4 text-rolex shrink-0" />
        <span>Ce véhicule bénéficie d'une option de réservation exclusive de 48h.</span>
      </div>
    </div>
  );
};
