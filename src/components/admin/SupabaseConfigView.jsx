import React, { useState } from 'react';
import { Database, CheckCircle2, AlertCircle, Copy, Check, Terminal, Shield, ExternalLink, Sparkles } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';

export const SupabaseConfigView = () => {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);
  const isConnected = isSupabaseConfigured();

  const envSample = `# Configuration Supabase - Inter Cars Import (.env)
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`;

  const sqlSample = `-- Tables nécessaires générées dans supabase_schema.sql
-- 1. Table leads (Demandes & Devis)
-- 2. Table delivered_vehicles (Catalogue & CRUD)
-- 3. Table visitors_analytics (Tracking & Visites)
-- 4. Table testimonials (Avis clients)`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(envSample);
    setCopied(true);
    addToast('Configuration copiée dans le presse-papier !', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Statut de Connexion */}
      <div className={`p-6 rounded-2xl border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isConnected
          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
          : 'bg-amber-50 border-amber-300 text-amber-950'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            isConnected ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
          }`}>
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-lg">
                {isConnected ? 'Supabase Connecté en Production' : 'Mode Mock LocalStorage Actif'}
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isConnected ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'
              }`}>
                {isConnected ? 'LIVE BACKEND' : 'PRÊT POUR SUPABASE'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {isConnected
                ? 'Toutes les opérations de leads, véhicules et analytiques sont synchronisées avec votre base de données Supabase cloud.'
                : 'L’application fonctionne à 100% de manière autonome avec persistance locale. Renseignez vos clés Supabase ci-dessous dès que vous souhaitez synchroniser en ligne.'}
            </p>
          </div>
        </div>
      </div>

      {/* Guide d'intégration en 2 étapes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Étape 1 : Variables d'environnement */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rolex text-gold text-xs flex items-center justify-center font-bold">1</span>
              Variables d'Environnement (.env)
            </h4>
            <button
              onClick={handleCopySql}
              className="px-3 py-1 rounded bg-surface hover:bg-slate-100 border border-slate-200 text-xs font-semibold flex items-center gap-1 text-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copié' : 'Copier'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Créez un fichier <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-rolex">.env</code> à la racine du projet et collez vos identifiants de projet Supabase :
          </p>

          <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
            {envSample}
          </pre>
        </div>

        {/* Étape 2 : Déploiement SQL */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h4 className="font-serif font-bold text-slate-900 text-sm flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-rolex text-gold text-xs flex items-center justify-center font-bold">2</span>
            Schéma SQL Prêt à l'Emploi
          </h4>

          <p className="text-xs text-slate-500 leading-relaxed">
            Un fichier <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-rolex">supabase_schema.sql</code> a été généré à la racine. Exécutez-le dans l'éditeur SQL Supabase pour créer toutes les tables et politiques RLS en un clic.
          </p>

          <div className="p-4 rounded-xl bg-surface border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-2 text-rolex font-semibold">
              <CheckCircle2 className="w-4 h-4 text-gold" />
              <span>Table `leads` avec statuts & filtres</span>
            </div>
            <div className="flex items-center gap-2 text-rolex font-semibold">
              <CheckCircle2 className="w-4 h-4 text-gold" />
              <span>Table `delivered_vehicles` avec catalogue complet</span>
            </div>
            <div className="flex items-center gap-2 text-rolex font-semibold">
              <CheckCircle2 className="w-4 h-4 text-gold" />
              <span>Table `visitors_analytics` pour le suivi temps réel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
