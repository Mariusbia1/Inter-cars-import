import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { VehicleCard } from '../components/common/VehicleCard';
import { VehicleModal } from '../components/common/VehicleModal';
import { LuxuryButton } from '../components/common/LuxuryButton';
import { useVehicles } from '../context/VehicleContext';
import { FinalCta } from '../components/home/FinalCta';

export const DeliveredVehiclesPage = () => {
  const { vehicles, loading } = useVehicles();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [sortBy, setSortBy] = useState('recent');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const categories = ['Tous', 'Supercar', 'Sportive', 'SUV Prestige', 'Berline GT'];

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        const matchesCategory = selectedCategory === 'Tous' || v.category === selectedCategory;
        const matchesSearch =
          v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.origin_country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.delivery_city.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'year') return (b.year || 0) - (a.year || 0);
        if (sortBy === 'power') return (b.power_hp || 0) - (a.power_hp || 0);
        if (sortBy === 'mileage') return (a.mileage || 0) - (b.mileage || 0);
        return new Date(b.created_at || b.delivery_date) - new Date(a.created_at || a.delivery_date);
      });
  }, [vehicles, searchQuery, selectedCategory, sortBy]);

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE) || 1;
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredVehicles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredVehicles, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="pt-32 sm:pt-36 bg-surface">
      {/* Hero Page Header */}
      <section className="bg-rolex-dark text-white py-14 sm:py-20 relative overflow-hidden border-b border-gold/30">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=2000&q=80"
            alt="Véhicules Livrés Inter Cars Import"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-4 uppercase tracking-widest">
            <Link to="/" className="hover:text-gold transition-colors">Accueil</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gold" />
            <span className="text-gold font-semibold">Véhicules Livrés</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">
            La Galerie de nos <br />
            <span className="text-gold-gradient">Livraisons de Prestige</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            Parcourez les supercars, GT et SUV haut de gamme sourcés, audités 150 points et livrés à domicile pour le compte de nos acquéreurs en France et à Monaco.
          </p>
        </div>
      </section>

      {/* Barre de Recherche & Filtres Dynamiques */}
      <section className="py-8 bg-white border-b border-slate-200 sticky top-28 sm:top-32 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Champ de recherche texte */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par marque, modèle, ville..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-rolex focus:ring-1 focus:ring-rolex text-sm bg-surface outline-none transition-all"
              />
            </div>

            {/* Tri sélectif sans notion de prix */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-gold" /> Trier par :
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-surface outline-none focus:border-rolex"
              >
                <option value="recent">Livraisons les plus récentes</option>
                <option value="year">Année la plus récente</option>
                <option value="power">Puissance moteur (ch)</option>
                <option value="mileage">Kilométrage le plus faible</option>
              </select>
            </div>
          </div>

          {/* Filtres par Catégorie */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'bg-rolex text-gold border border-gold/50 shadow-md font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
            <span className="text-xs text-slate-400 ml-auto hidden sm:block">
              {filteredVehicles.length} véhicule(s) au total
            </span>
          </div>
        </div>
      </section>

      {/* Grille des Véhicules avec Pagination */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-rolex border-t-gold rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-medium text-slate-600">Chargement de la galerie de prestige...</p>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-20 p-8 rounded-2xl bg-white border border-slate-200 max-w-lg mx-auto">
              <Sparkles className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">Aucun véhicule ne correspond à vos critères</h3>
              <p className="text-xs text-slate-500 mb-6">
                Notre réseau source tous les jours de nouveaux modèles en Europe. Contactez notre conciergerie pour une recherche personnalisée.
              </p>
              <LuxuryButton to="/contact" variant="gold" size="md">
                Lancer une recherche sur mesure
              </LuxuryButton>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {paginatedVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onSelect={(v) => setSelectedVehicle(v)}
                  />
                ))}
              </div>

              {/* Barre de Pagination Luxueuse */}
              {totalPages > 1 && (
                <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-medium">
                    Affichage de {(currentPage - 1) * ITEMS_PER_PAGE + 1} à {Math.min(currentPage * ITEMS_PER_PAGE, filteredVehicles.length)} sur {filteredVehicles.length} véhicules
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" /> Précédent
                    </button>

                    <div className="flex items-center gap-1 px-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                            currentPage === pageNum
                              ? 'bg-rolex text-gold border border-gold/40 shadow-sm'
                              : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition-colors"
                    >
                      Suivant <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Modal Détails Véhicule */}
      <VehicleModal
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
      />

      {/* Final CTA */}
      <FinalCta />
    </div>
  );
};
