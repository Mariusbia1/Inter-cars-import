import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Shield, LogOut, ArrowUpRight } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminFloatingBar = () => {
  const { isAuthenticated, logout } = useAdminAuth();
  const location = useLocation();

  // Ne pas afficher sur les pages d'administration
  if (!isAuthenticated || location.pathname.startsWith('/admin') || location.pathname === '/login') {
    return null;
  }

  return (
    <aside
      aria-label="Contrôle Administrateur"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#072418] border border-[#c6a15b]/60 p-1.5 pl-3.5 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.5)] text-white text-xs font-semibold transition-all duration-300"
    >
      <div className="flex items-center gap-2 pr-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <Shield className="w-3.5 h-3.5 text-[#c6a15b]" />
        <span className="text-white hidden sm:inline">Connecté Admin</span>
      </div>

      <Link
        to="/admin"
        className="px-3.5 py-1.5 rounded-full bg-[#c6a15b] hover:bg-[#e2c285] text-[#072418] font-bold uppercase tracking-wider text-[11px] transition-all flex items-center gap-1.5 shadow-sm"
      >
        <LayoutDashboard className="w-3.5 h-3.5" />
        <span>Dashboard</span>
        <ArrowUpRight className="w-3 h-3" />
      </Link>

      <button
        type="button"
        onClick={logout}
        title="Se déconnecter"
        className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
      >
        <LogOut className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};
