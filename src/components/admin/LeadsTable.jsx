import React, { useState, useMemo, useEffect } from 'react';
import { Search, Download, Filter, Eye, Trash2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLeads } from '../../context/LeadsContext';
import { LeadDetailModal } from './LeadDetailModal';
import { useToast } from '../../context/ToastContext';

export const LeadsTable = () => {
  const { leads, loading, updateLeadStatus, deleteLead } = useLeads();
  const { addToast } = useToast();
  const [selectedLead, setSelectedLead] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus = statusFilter === 'Tous' || lead.status === statusFilter;
      const matchesSearch =
        (lead.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (lead.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (lead.phone || '').toLowerCase().includes(search.toLowerCase()) ||
        (lead.brand_sought || '').toLowerCase().includes(search.toLowerCase()) ||
        (lead.model_sought || '').toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [leads, search, statusFilter]);

  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE) || 1;
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLeads.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLeads, currentPage]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Nouveau':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
      case 'En cours':
        return 'bg-blue-100 text-blue-800 border-blue-300 font-bold';
      case 'Devis envoyé':
        return 'bg-purple-100 text-purple-800 border-purple-300 font-bold';
      case 'Clôturé':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const handleExportCsv = () => {
    if (leads.length === 0) {
      addToast('Aucune donnée à exporter', 'info');
      return;
    }

    const headers = ['ID', 'Date', 'Nom', 'Email', 'Telephone', 'Type', 'Marque', 'Modele', 'Delai', 'Statut'];
    const rows = filteredLeads.map((l) => [
      l.id,
      new Date(l.created_at).toLocaleDateString('fr-FR'),
      `"${l.full_name}"`,
      l.email,
      l.phone,
      l.vehicle_type,
      `"${l.brand_sought || ''}"`,
      `"${l.model_sought || ''}"`,
      `"${l.preferred_timeline || ''}"`,
      l.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_intercars_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Fichier CSV exporté avec succès', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Barre d'outils */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email, modèle..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-surface outline-none focus:border-rolex"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-surface outline-none focus:border-rolex"
            >
              <option value="Tous">Tous les statuts</option>
              <option value="Nouveau">Nouveau</option>
              <option value="En cours">En cours</option>
              <option value="Devis envoyé">Devis envoyé</option>
              <option value="Clôturé">Clôturé</option>
            </select>
          </div>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl bg-surface hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-rolex" />
            <span className="hidden sm:inline">Exporter CSV</span>
          </button>
        </div>
      </div>

      {/* Tableau des Demandes */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-3 border-rolex border-t-gold rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Chargement des demandes...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-16 p-6">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">Aucune demande trouvée</h4>
            <p className="text-xs text-slate-400">Modifiez votre recherche ou attendez de nouveaux prospects.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Prospect / Client</th>
                    <th className="py-3.5 px-4">Véhicule Cible</th>
                    <th className="py-3.5 px-4">Délai Souhaité</th>
                    <th className="py-3.5 px-4">Date Réception</th>
                    <th className="py-3.5 px-4">Statut</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-bold text-slate-900">{lead.full_name}</div>
                        <div className="text-xs text-slate-500">{lead.email} • {lead.phone}</div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-rolex">
                        {lead.brand_sought} {lead.model_sought}
                        <span className="block text-[11px] text-slate-400 font-normal">{lead.vehicle_type}</span>
                      </td>
                      <td className="py-4 px-4 font-medium text-slate-700">
                        {lead.preferred_timeline || 'Sous 30 jours'}
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500">
                        {new Date(lead.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] border ${getStatusBadge(lead.status)}`}>
                          {lead.status || 'Nouveau'}
                        </span>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right space-x-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="px-3 py-1.5 rounded-lg bg-rolex-50 hover:bg-rolex text-rolex hover:text-gold border border-rolex/20 text-xs font-semibold transition-all inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Gérer
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Supprimer cette demande ?")) {
                              deleteLead(lead.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
                <span className="text-xs text-slate-500">
                  Affichage de {(currentPage - 1) * ITEMS_PER_PAGE + 1} à {Math.min(currentPage * ITEMS_PER_PAGE, filteredLeads.length)} sur {filteredLeads.length} demandes
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

      {/* Modal Détails Lead */}
      <LeadDetailModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdateStatus={updateLeadStatus}
        onDelete={deleteLead}
      />
    </div>
  );
};
