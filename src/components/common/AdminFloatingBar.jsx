import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Shield, LogOut, ArrowUpRight } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminFloatingBar = () => {
  const { isAuthenticated, logout, user } = useAdminAuth();
  const location = useLocation();

  // Ne pas afficher sur les pages d'administration
  if (!isAuthenticated || location.pathname.startsWith('/admin') || location.pathname === '/login') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#072418]/95 backdrop-blur-xl border border-gold/60 p-1.5 pl-3.5 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.4)] text-white text-xs font-semibold"
    >
      <div className="flex items-center gap-2 pr-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <Shield className="w-3.5 h-3.5 text-gold" />
        <span className="text-white hidden sm:inline">Connecté Admin</span>
      </div>

      <Link
        to="/admin"
        className="px-3.5 py-1.5 rounded-full bg-gold hover:bg-gold-light text-rolex-950 font-bold uppercase tracking-wider text-[11px] transition-all flex items-center gap-1.5 shadow-sm"
      >
        <LayoutDashboard className="w-3.5 h-3.5" />
        <span>Dashboard</span>
        <ArrowUpRight className="w-3 h-3" />
      </Link>

      <button
        onClick={logout}
        title="Se déconnecter"
        className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors"
      >
        <LogOut className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};
