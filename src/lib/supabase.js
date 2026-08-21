import { createClient } from '@supabase/supabase-js';

// Récupération des variables d'environnement Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Vérification de la configuration
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'VOTRE_SUPABASE_URL');
};

// Client Supabase (initialisé uniquement si les clés sont valides)
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper pour journaliser l'état
if (isSupabaseConfigured()) {
  console.log('✨ Supabase connecté avec succès à :', supabaseUrl);
} else {
  console.info('ℹ️ Supabase non configuré : le mode Mock LocalStorage est activé automatiquement.');
}
