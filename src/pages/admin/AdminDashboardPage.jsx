import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { KpiCard } from '../../components/admin/KpiCard';
import { LeadsTable } from '../../components/admin/LeadsTable';
import { VehicleManager } from '../../components/admin/VehicleManager';
import { AnalyticsView } from '../../components/admin/AnalyticsView';
import { SettingsManager } from '../../components/admin/SettingsManager';
import { MessageSquare, Car, Award, Clock, ArrowUpRight, Plus, Eye, Settings } from 'lucide-react';
import { useLeads } from '../../context/LeadsContext';
import { useVehicles } from '../../context/VehicleContext';

export const AdminDashboardPage = () => {
  const { isAuthenticated, loading } = useAdminAuth();
  const { leads } = useLeads();
  const { vehicles } = useVehicles();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-rolex-dark flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-rolex border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Calculs KPI (strictement sans prix ni CA)
  const newLeadsCount = leads.filter((l) => l.status === 'Nouveau').length;
  const inProgressLeadsCount = leads.filter((l) => l.status === 'En cours' || l.status === 'Devis envoyé').length;
  const totalVehiclesCount = vehicles.length;

  return (
    <AdminLayout activeTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* KPI Header Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard
              title="Demandes Reçues"
              value={leads.length}
              subtitle={`${newLeadsCount} nouvelle(s) à traiter`}
              change="+3 cette semaine"
              icon={MessageSquare}
            />
            <KpiCard
              title="Véhicules en Vitrine"
              value={totalVehiclesCount}
              subtitle="Modèles audités 150 points"
              change="Catalogue actif"
              icon={Car}
            />
            <KpiCard
              title="Délai de Traitement"
              value="< 48h"
              subtitle="Audit et premier sourcing"
              change="Délai garanti"
              icon={Clock}
            />
            <KpiCard
              title="Indice de Satisfaction"
              value="100%"
              subtitle="180+ livraisons sans litige"
              change="5.0 ★ sur avis"
              icon={Award}
            />
          </div>

          {/* Deux Blocs : Derniers Leads & Actions Rapides */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Boîte de Réception Récente */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  Dernières Demandes de Recherche
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('leads')}
                  className="text-xs font-semibold text-rolex hover:underline flex items-center gap-1"
                >
                  Gérer toutes les demandes ({leads.length}) <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {leads.slice(0, 4).map((lead) => (
                  <div key={lead.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">{lead.full_name}</h5>
                      <p className="text-xs text-slate-500">
                        {lead.brand_sought} {lead.model_sought} • {lead.vehicle_type}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          lead.status === 'Nouveau'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {lead.status || 'Nouveau'}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {new Date(lead.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Rapides & Raccourcis */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-gradient-to-br from-rolex-dark to-rolex p-6 sm:p-7 rounded-2xl text-white border border-gold/30 shadow-xl space-y-4">
                <h4 className="font-serif font-bold text-lg text-white">
                  Actions Rapides
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed font-light">
                  Gérez vos demandes de conciergerie, actualisez la vitrine de véhicules ou modifiez vos coordonnées.
                </p>
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('vehicles')}
                    className="w-full py-2.5 px-4 rounded-xl bg-gold hover:bg-gold-bright text-rolex-950 text-xs font-bold uppercase tracking-wider transition-colors text-center block shadow-gold-glow"
                  >
                    + Ajouter un véhicule livré
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('leads')}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-colors text-center block border border-white/20"
                  >
                    Voir les demandes entrantes
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gold text-xs font-semibold uppercase tracking-wider transition-colors text-center block border border-gold/30 flex items-center justify-center gap-1.5"
                  >
                    <Settings className="w-3.5 h-3.5" /> Réglages Coordonnées & Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'leads' && <LeadsTable />}
      {activeTab === 'vehicles' && <VehicleManager />}
      {activeTab === 'analytics' && <AnalyticsView />}
      {activeTab === 'settings' && <SettingsManager />}
    </AdminLayout>
  );
};
