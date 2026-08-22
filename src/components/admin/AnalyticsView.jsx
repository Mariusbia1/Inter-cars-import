import React, { useState, useEffect, useMemo } from 'react';
import { Globe, Users, Clock, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
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
        <p className="text-xs text-slate-500">Chargement des métriques...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 4 Mini Cartes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Visites Aujourd'hui</span>
          <div className="text-2xl font-serif font-bold text-rolex">+{data.todayVisits}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">+14.2% vs hier</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Visiteurs Uniques</span>
          <div className="text-2xl font-serif font-bold text-slate-900">{data.uniqueVisitors.toLocaleString('fr-FR')}</div>
          <span className="text-[10px] text-slate-400">Total cumulé</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Taux de Conversion Devis</span>
          <div className="text-2xl font-serif font-bold text-gold-dark">{data.conversionRate}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Excellente performance</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Temps Moyen par Session</span>
          <div className="text-2xl font-serif font-bold text-slate-900">3m 42s</div>
          <span className="text-[10px] text-slate-400">Engagement élevé</span>
        </div>
      </div>

      {/* Grille Pays & Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Répartition Géographique */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h4 className="font-serif font-bold text-slate-900 text-base flex items-center gap-2">
            <Globe className="w-4 h-4 text-rolex" /> Origine Géographique des Visiteurs
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
                    style={{ width: `${c.count}%` }}
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

      {/* Journal des Dernières Visites avec Pagination */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h4 className="font-serif font-bold text-slate-900 text-base flex items-center gap-2">
          <Clock className="w-4 h-4 text-rolex" /> Journal des Visites Récentes (Temps Réel)
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Heure / Date</th>
                <th className="py-2.5 px-4">Page Consultée</th>
                <th className="py-2.5 px-4">Provenance</th>
                <th className="py-2.5 px-4">Appareil & Navigateur</th>
                <th className="py-2.5 px-4">Durée</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {paginatedVisits.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                    {new Date(v.visited_at).toLocaleTimeString('fr-FR')}
                  </td>
                  <td className="py-3 px-4 font-semibold text-rolex">
                    {v.page_name || "Page d'Accueil"}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">{v.country} ({v.city || 'Direct'})</td>
                  <td className="py-3 px-4 text-slate-500">{v.device} • {v.browser}</td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold">{v.duration}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
