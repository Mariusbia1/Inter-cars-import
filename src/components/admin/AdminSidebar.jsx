import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Car, BarChart3, Settings, LogOut, ArrowLeft } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { BrandLogo } from '../common/BrandLogo';

export const AdminSidebar = ({ activeTab, onSelectTab }) => {
  const { user, logout } = useAdminAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
    { id: 'leads', label: 'Demandes & Devis', icon: MessageSquare },
    { id: 'vehicles', label: 'Catalogue Véhicules', icon: Car },
    { id: 'analytics', label: 'Visiteurs & Statistiques', icon: BarChart3 },
    { id: 'settings', label: 'Réglages du Site', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-rolex-dark text-slate-300 border-r border-gold/20 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="p-4 border-b border-white/10 shrink-0 flex justify-center">
          <BrandLogo size="md" />
        </div>

        {/* Navigation Tabs */}
        <nav className="p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors text-left ${
                  isActive
                    ? 'bg-rolex text-gold border border-gold/40 shadow-sm font-bold'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-gold' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Info & Actions Footer */}
      <div className="p-4 border-t border-white/10 space-y-3 shrink-0">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrateur'}</p>
          <p className="text-[10px] text-gold truncate">{user?.email || 'admin@intercarsimport.fr'}</p>
        </div>

        <Link
          to="/"
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Voir le site public
        </Link>

        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-500/30 text-red-300 text-xs font-semibold transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> Déconnexion
        </button>
      </div>
    </aside>
  );
};
