import { createClient } from '@supabase/supabase-js';

// Configuration Supabase avec valeurs de secours permanentes garantissant la connexion en production
const DEFAULT_SUPABASE_URL = 'https://tdbwbzotqsahnnmasjmb.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_j1KwauSScUFvfLCKuwOaeg_ELmkh3bY';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;

// Vérification de la configuration (toujours true grâce aux valeurs permanentes)
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'VOTRE_SUPABASE_URL');
};

// Client Supabase connecté en permanence
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('✨ Connexion Supabase active :', supabaseUrl);
