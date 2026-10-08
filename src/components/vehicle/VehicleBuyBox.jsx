import React from 'react';
import { ShieldCheck, Truck, FileCheck, Award, Phone } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const VehicleBuyBox = ({
  vehicle,
  onRequestQuoteClick
}) => {
  const { settings } = useSettings();

  const hasPrice = Boolean(vehicle?.price && Number(vehicle.price) > 0);
  const formattedPrice = hasPrice
    ? Number(vehicle.price).toLocaleString('fr-FR') + ' €'
    : null;

  const status = vehicle?.availability_status || 'ARRIVAGE';
  const statusColor = status === 'EN STOCK' 
    ? 'text-[#16a34a] bg-emerald-50 border-emerald-200' 
    : status === 'DISPONIBLE EN CONCESSION' || status === 'DISPONIBLE'
    ? 'text-blue-700 bg-blue-50 border-blue-200'
    : status === 'RÉSERVÉ'
    ? 'text-amber-700 bg-amber-50 border-amber-200'
    : 'text-[#f59e0b] bg-amber-50 border-amber-200';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-md p-5 sm:p-6 flex flex-col justify-between space-y-5">
      
      {/* 1. Bloc Prix & Statut */}
      <div className="border-b border-slate-100 pb-4">
        {hasPrice ? (
          <div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
                  {formattedPrice}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded text-xs font-extrabold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-300 shadow-xs">
                  En Arrivage
                </span>
              </div>
            </div>

            {/* Mention clé en main */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-1 text-xs text-slate-500">
              <span className="font-medium text-slate-700">TTC • Prix clé en main certifié</span>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                En Arrivage
              </span>
              <span className="px-2.5 py-1 rounded text-[11px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-300">
                Arrivage
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Véhicule en cours d'acheminement • Tarif et détails sur demande
            </p>
          </div>
        )}
      </div>

      {/* 2. Statut & Caractéristiques Clés */}
      <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/60 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Disponibilité :</span>
          <span className={`px-2.5 py-0.5 rounded uppercase tracking-wider text-[11px] font-extrabold border ${statusColor}`}>
            {status}
          </span>
        </div>

        {vehicle?.color_ext && (
          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200/60">
            <span className="text-slate-500 font-medium">Couleur extérieure :</span>
            <span className="font-bold text-slate-800">{vehicle.color_ext}</span>
          </div>
        )}

        {vehicle?.engine && (
          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200/60">
            <span className="text-slate-500 font-medium">Motorisation :</span>
            <span className="font-bold text-slate-800">{vehicle.engine} ({vehicle.power_hp || 0} ch)</span>
          </div>
        )}

        {vehicle?.transmission && (
          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200/60">
            <span className="text-slate-500 font-medium">Transmission :</span>
            <span className="font-bold text-slate-800">{vehicle.transmission}</span>
          </div>
        )}
      </div>

      {/* 3. Gros Bouton d'Action Principal Vert */}
      <div className="space-y-2.5">
        <button
          onClick={onRequestQuoteClick}
          className="w-full py-4 px-6 rounded-lg bg-[#55a214] hover:bg-[#498e10] active:scale-[0.99] text-white font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-lg shadow-emerald-900/15 flex items-center justify-center gap-2.5 transition-all duration-200 group cursor-pointer"
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
          <span>Livraison clé en main partout en France</span>
        </div>
        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Gestion complète de la carte grise & formalités</span>
        </div>
      </div>
    </div>
  );
};
