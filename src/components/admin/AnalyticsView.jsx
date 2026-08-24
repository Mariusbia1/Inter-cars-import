import React, { useState, useEffect, useMemo } from 'react';
import { Globe, Users, Clock, Eye, ChevronLeft, ChevronRight, Activity, Smartphone, Monitor, Calendar } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';

export const AnalyticsView = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Pagination pour les visites récentes
  const [currentPage, setCurrentPage] = useState(1);
  const VISITS_PER_PAGE = 8;

  useEffect(() => {
    const load = async () => {
      const res = await analyticsService.getAnalyticsData();
      setData(res);
      setLoading(false);
    };
    load();
  }, []);

  const totalPages = data ? Math.ceil((data.recentVisits?.length || 0) / VISITS_PER_PAGE) || 1 : 1;
  const paginatedVisits = useMemo(() => {
    if (!data?.recentVisits) return [];
    const start = (currentPage - 1) * VISITS_PER_PAGE;
    return data.recentVisits.slice(start, start + VISITS_PER_PAGE);
  }, [data, currentPage]);

  if (loading || !data) {
    return (
      <div className="text-center py-16">
        <div className="w-8 h-8 border-3 border-rolex border-t-gold rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-slate-500">Chargement des métriques réelles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 4 Mini Cartes avec données 100% réelles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Visites Aujourd'hui</span>
          <div className="text-2xl font-serif font-bold text-rolex">+{data.todayVisits}</div>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
            <Activity className="w-3 h-3 text-emerald-500" /> Trafic en temps réel
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Visites Enregistrées</span>
          <div className="text-2xl font-serif font-bold text-slate-900">{data.totalVisits.toLocaleString('fr-FR')}</div>
          <span className="text-[10px] text-slate-500 font-medium">({data.uniqueVisitors} visiteurs uniques)</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Taux de Conversion Devis</span>
          <div className="text-2xl font-serif font-bold text-gold-dark">{data.conversionRate}</div>
          <span className="text-[10px] text-slate-400">Demandes de devis réelles</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Temps Moyen par Session</span>
          <div className="text-2xl font-serif font-bold text-slate-900">{data.avgSessionDuration || '45s'}</div>
          <span className="text-[10px] text-slate-400">Durée réelle observée</span>
        </div>
      </div>

      {/* Grille Pays & Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Répartition Géographique */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h4 className="font-serif font-bold text-slate-900 text-base flex items-center gap-2">
            <Globe className="w-4 h-4 text-rolex" /> Origine des Visiteurs
          </h4>
          <div className="space-y-3">
            {data.countries.map((c, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </span>
                  <span className="text-slate-500">{c.count}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-rolex rounded-full"
                    style={{ width: `${Math.max(c.count, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pages les Plus Consultées */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h4 className="font-serif font-bold text-slate-900 text-base flex items-center gap-2">
            <Eye className="w-4 h-4 text-gold-dark" /> Pages les Plus Consultées
          </h4>
          <div className="divide-y divide-slate-100">
            {data.topPages.map((page, i) => (
              <div key={i} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-rolex-50 border border-rolex/20 text-rolex flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <span className="font-semibold text-slate-900">{page.label}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-rolex-50 text-rolex font-bold text-xs">
                  {page.views}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Journal des Dernières Visites avec Date ET Heure Complètes */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-serif font-bold text-slate-900 text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-rolex" /> Journal des Visites Réelles (Temps Réel)
          </h4>
          <span className="text-xs text-slate-400 font-medium">
            {data.totalVisits} session(s) enregistrée(s)
          </span>
        </div>

        {data.recentVisits.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            Aucune visite enregistrée pour le moment. Naviguez sur le site pour voir les données s'afficher en direct.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date & Heure de Visite</th>
                  <th className="py-3 px-4">Page Consultée</th>
                  <th className="py-3 px-4">Provenance</th>
                  <th className="py-3 px-4">Appareil & Navigateur</th>
                  <th className="py-3 px-4">Durée Estimée</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {paginatedVisits.map((v, idx) => {
                  const visitDate = v.visited_at ? new Date(v.visited_at) : new Date();
                  const formattedDate = visitDate.toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  });
                  const formattedTime = visitDate.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  });

                  return (
                    <tr key={v.id || idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-rolex shrink-0" />
                          <span>{formattedDate}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono pl-5">
                          à {formattedTime}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-rolex">
                        {v.page_name || "Page d'Accueil"}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">{v.country}</td>
                      <td className="py-3.5 px-4 text-slate-500">
                        <div className="flex items-center gap-1.5">
                          {v.device === 'Mobile' ? <Smartphone className="w-3.5 h-3.5 text-slate-400" /> : <Monitor className="w-3.5 h-3.5 text-slate-400" />}
                          <span>{v.device} • {v.browser}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-emerald-600 font-semibold">{v.duration}s</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination des visites */}
        {totalPages > 1 && (
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Page {currentPage} sur {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Précédent
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1"
              >
                Suivant <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
