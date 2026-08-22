import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, MapPin, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { useVehicles } from '../../context/VehicleContext';
import { VehicleFormModal } from './VehicleFormModal';
import { LuxuryButton } from '../common/LuxuryButton';

export const VehicleManager = () => {
  const { vehicles, loading, addVehicle, updateVehicle, deleteVehicle } = useVehicles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [search, setSearch] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filtered = useMemo(() => {
    return vehicles.filter(
      (v) =>
        (v.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (v.brand || '').toLowerCase().includes(search.toLowerCase()) ||
        (v.delivery_city || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [vehicles, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleSaveVehicle = (vehicleData) => {
    if (editingVehicle) {
      updateVehicle(editingVehicle.id, vehicleData);
    } else {
      addVehicle(vehicleData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un véhicule au catalogue..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-surface outline-none focus:border-rolex"
          />
        </div>

        <LuxuryButton
          onClick={handleOpenAdd}
          variant="gold"
          size="sm"
          icon={Plus}
          iconPosition="left"
          className="font-bold tracking-wider text-xs"
        >
          Ajouter un véhicule livré
        </LuxuryButton>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-3 border-rolex border-t-gold rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Chargement des véhicules...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 p-6 bg-white rounded-2xl border border-slate-200">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700">Aucun véhicule trouvé</h4>
          <p className="text-xs text-slate-400 mb-4">Modifiez votre recherche ou ajoutez un nouveau véhicule.</p>
          <LuxuryButton onClick={handleOpenAdd} variant="gold" size="sm" icon={Plus}>
            Ajouter un premier véhicule
          </LuxuryButton>
        </div>
      ) : (
        <>
          {/* Grille des Véhicules en Gestion */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 bg-slate-900 overflow-hidden">
                    <img
                      src={vehicle.image_url}
                      alt={vehicle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className="px-2 py-0.5 rounded bg-rolex text-white text-[10px] font-bold uppercase">
                        {vehicle.category}
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-gold text-[10px] font-bold">
                      {vehicle.certification || 'Audit 150 Pts'}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gold-dark">{vehicle.brand}</span>
                    <h4 className="font-serif font-bold text-slate-900 text-base line-clamp-1">{vehicle.title}</h4>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                      <span>{vehicle.year} • {vehicle.mileage?.toLocaleString('fr-FR')} km</span>
                      <span>{vehicle.power_hp} ch</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rolex" /> Livré à {vehicle.delivery_city}
                    </div>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {typeof vehicle.id === 'string' && vehicle.id.length > 12 ? `${vehicle.id.slice(0, 8)}...` : vehicle.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(vehicle)}
                      className="px-2.5 py-1 rounded bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Edit2 className="w-3 h-3" /> Modifier
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Supprimer "${vehicle.title}" du catalogue ?`)) {
                          deleteVehicle(vehicle.id);
                        }
                      }}
                      className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Affichage de {(currentPage - 1) * ITEMS_PER_PAGE + 1} à {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} sur {filtered.length} véhicules
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Précédent
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        currentPage === pageNum
                          ? 'bg-rolex text-gold border border-gold/40'
                          : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition-colors"
                >
                  Suivant <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal Formulaire */}
      <VehicleFormModal
        vehicle={editingVehicle}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveVehicle}
      />
    </div>
  );
};
