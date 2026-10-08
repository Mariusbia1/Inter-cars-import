import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { VehicleCard } from '../common/VehicleCard';
import { LuxuryButton } from '../common/LuxuryButton';
import { useVehicles } from '../../context/VehicleContext';

export const RecentDeliveries = () => {
  const { vehicles, loading } = useVehicles();
  const [activeCategory, setActiveCategory] = useState('Tous');

  const categories = ['Tous', 'Citadine', 'Berline & Break', 'SUV & 4x4'];

  const filteredVehicles = vehicles
    .filter(v => activeCategory === 'Tous' || v.category === activeCategory)
    .slice(0, 6);

  // Restauration automatique du défilement vers le véhicule cliqué en faisant retour vers l'accueil
  useEffect(() => {
    if (loading) return;
    const lastVehicleId = sessionStorage.getItem('last_viewed_vehicle_id');
    if (lastVehicleId) {
      const timer = setTimeout(() => {
        const targetEl = document.getElementById(`vehicle-card-${lastVehicleId}`);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        sessionStorage.removeItem('last_viewed_vehicle_id');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Stock & Nouveaux Arrivages"
          title="Nos Véhicules Disponibles à la Vente"
          subtitle="Découvrez notre sélection de véhicules d'occasion récents rigoureusement inspectés, révisés et livrés clés en main partout en France."
        />

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-rolex text-gold border border-gold/50 shadow-md scale-105 font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grille des véhicules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
            />
          ))}
        </div>

        {/* CTA vers le catalogue complet */}
        <div className="text-center">
          <LuxuryButton
            to="/vehicules-disponibles"
            variant="rolex"
            size="lg"
            icon={ArrowRight}
          >
            Consulter tous les véhicules disponibles en stock ({vehicles.length}+ modèles)
          </LuxuryButton>
        </div>
      </div>
    </section>
  );
};
