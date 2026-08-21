import React from 'react';
import { AdminSidebar } from './AdminSidebar';

export const AdminLayout = ({ activeTab, onSelectTab, children }) => {
  const tabTitles = {
    dashboard: "Tableau de Bord & Vue d'Ensemble",
    leads: "Gestion des Demandes & Devis Entrants",
    vehicles: "Gestionnaire du Catalogue des Véhicules Livrés",
    analytics: "Statistiques de Fréquentation & Visiteurs",
    settings: "Réglages du Site & Coordonnées",
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row antialiased">
      {/* Sidebar Navigation Fixe */}
      <AdminSidebar activeTab={activeTab} onSelectTab={onSelectTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Bar Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-xs">
          <div>
            <h1 className="text-base sm:text-lg font-serif font-bold text-slate-900">
              {tabTitles[activeTab] || 'Espace Administration'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rolex-50 text-rolex text-xs font-semibold border border-rolex/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Plateforme Opérationnelle
            </span>
          </div>
        </header>

        {/* Tab Content - Pleine largeur */}
        <main className="p-6 sm:p-8 w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
