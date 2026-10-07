import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, MapPin, ChevronLeft, ChevronRight, AlertCircle, ExternalLink, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useVehicles } from '../../context/VehicleContext';
import { VehicleEditorView } from './VehicleEditorView';
import { LuxuryButton } from '../common/LuxuryButton';
import { useToast } from '../../context/ToastContext';

export const VehicleManager = () => {
  const { vehicles, loading, addVehicle, updateVehicle, deleteVehicle } = useVehicles();
  const { addToast } = useToast();
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'editor'
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
        (v.delivery_city || '').toLowerCase().includes(search.toLowerCase()) ||
        (v.category || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [vehicles, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setViewMode('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setViewMode('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveVehicle = async (vehicleData) => {
    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, vehicleData);
      } else {
        await addVehicle(vehicleData);
      }
      setViewMode('list');
      setEditingVehicle(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error saving vehicle in manager:', err);
      addToast("Erreur lors de l'enregistrement du véhicule", 'error');
    }
  };

  const handleCancelEditor = () => {
    setViewMode('list');
    setEditingVehicle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Si on est en mode Éditeur (Page Complète, PAS de popup !)
  if (viewMode === 'editor') {
    return (
      <VehicleEditorView
        vehicle={editingVehicle}
        onSave={handleSaveVehicle}
        onCancel={handleCancelEditor}
      />
    );
  }

  // Sinon Mode Liste
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
            placeholder="Rechercher par marque, titre, catégorie..."
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
          Ajouter un véhicule
        </LuxuryButton>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-3 border-rolex border-t-gold rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Connexion à la base de données Supabase...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <div>
            <h4 className="text-base font-bold text-slate-800">
              {search ? 'Aucun véhicule ne correspond à votre recherche' : 'Votre catalogue est actuellement vide'}
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              {search
                ? 'Essayez de modifier vos termes de recherche.'
                : 'Ajoutez votre premier véhicule avec sa fiche technique et ses photos, ou chargez les modèles d\'exemples.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <LuxuryButton onClick={handleOpenAdd} variant="gold" size="sm" icon={Plus}>
              Ajouter un véhicule
            </LuxuryButton>
          </div>
        </div>
      ) : (
        <>
          {/* Grille des Véhicules en Gestion */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedVehicles.map((vehicle) => {
              const status = vehicle.availability_status || 'ARRIVAGE';
              const statusColor = status === 'EN STOCK' 
                ? 'bg-emerald-600 text-white' 
                : status === 'DISPONIBLE EN CONCESSION' || status === 'DISPONIBLE'
                ? 'bg-blue-600 text-white'
                : status === 'RÉSERVÉ'
                ? 'bg-amber-600 text-white'
                : 'bg-rolex text-gold';

              return (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="relative h-48 bg-slate-900 overflow-hidden">
                      <img
                        src={vehicle.image_url}
                        alt={vehicle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className="px-2 py-0.5 rounded bg-rolex-dark/90 text-gold text-[10px] font-bold uppercase border border-gold/30">
                          {vehicle.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusColor}`}>
                          {status}
                        </span>
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-gold text-[10px] font-bold">
                        {vehicle.certification || 'Audit 150 Pts'}
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gold-dark">{vehicle.brand}</span>
                        {vehicle.price ? (
                          <span className="text-sm font-extrabold text-rolex font-sans">
                            {Number(vehicle.price).toLocaleString('fr-FR')} €
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                            En arrivage
                          </span>
                        )}
                      </div>

                      <h4 className="font-serif font-bold text-slate-900 text-base line-clamp-1 hover:text-rolex transition-colors">
                        <Link to={`/vehicules/${vehicle.id}`} target="_blank" rel="noopener noreferrer">
                          {vehicle.title}
                        </Link>
                      </h4>

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                        <span>{vehicle.year} • {vehicle.mileage ? `${Number(vehicle.mileage).toLocaleString('fr-FR')} km` : 'Faible km'}</span>
                        <span>{vehicle.power_hp ? `${vehicle.power_hp} ch` : vehicle.engine}</span>
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rolex" /> {vehicle.delivery_city || 'France'}
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">
                          {vehicle.fuel_type || 'Diesel'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      to={`/vehicules/${vehicle.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-slate-600 hover:text-rolex flex items-center gap-1 transition-colors"
                      title="Voir la fiche client en direct"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Fiche produit
                    </Link>

                    <div className="flex items-center gap-1.5">
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
                            addToast('Véhicule supprimé du catalogue', 'info');
                          }
                        }}
                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
    </div>
  );
};


