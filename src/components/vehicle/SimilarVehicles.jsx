import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ArrowRight } from 'lucide-react';
import { VehicleCard } from '../common/VehicleCard';

export const SimilarVehicles = ({ currentVehicle, allVehicles }) => {
  if (!allVehicles || allVehicles.length <= 1) return null;

  // Filtrer les véhicules similaires : même catégorie ou même marque, en excluant le véhicule courant
  const similar = allVehicles
    .filter((v) => v.id !== currentVehicle?.id)
    .sort((a, b) => {
      if (a.category === currentVehicle?.category && b.category !== currentVehicle?.category) return -1;
      if (b.category === currentVehicle?.category && a.category !== currentVehicle?.category) return 1;
      if (a.brand === currentVehicle?.brand && b.brand !== currentVehicle?.brand) return -1;
      return 0;
    })
    .slice(0, 3);

  if (similar.length === 0) return null;

  return (
    <div className="space-y-6 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gold flex items-center gap-1.5 mb-1">
            <Car className="w-3.5 h-3.5" /> Également en Stock
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Véhicules Similaires Disponibles
          </h3>
        </div>
        <Link
          to="/vehicules-livres"
          className="text-xs font-bold text-rolex hover:text-gold flex items-center gap-1 transition-colors uppercase tracking-wider"
        >
          Voir tout le stock <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {similar.map((veh) => (
          <VehicleCard key={veh.id} vehicle={veh} />
        ))}
      </div>
    </div>
  );
};
