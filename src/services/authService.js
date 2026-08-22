import { supabase, isSupabaseConfigured } from '../lib/supabase';

const ADMIN_SESSION_KEY = 'intercars_admin_session';

export const authService = {
  // Connexion Admin
  async login(email, password) {
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanPassword = password || '';

    // 1. Tenter la connexion via Supabase Auth si configuré
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword
        });

        if (!error && data.session) {
          const user = {
            id: data.user.id,
            email: data.user.email,
            role: 'Super Administrateur',
            authenticated_at: new Date().toISOString()
          };
          localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(user));
          return { success: true, user };
        }
      } catch (err) {
        console.warn('Supabase auth check:', err);
      }
    }

    // 2. Identifiants Maître Officiels
    const MASTER_EMAIL = 'contact@inter-cars-import.fr';
    const MASTER_PASSWORD = '@Ulrich00123';

    if (cleanEmail === MASTER_EMAIL && cleanPassword === MASTER_PASSWORD) {
      const user = {
        id: 'admin-master-intercars',
        email: MASTER_EMAIL,
        name: 'Direction Inter Cars Import',
        role: 'Super Administrateur',
        authenticated_at: new Date().toISOString()
      };
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(user));
      return { success: true, user };
    }

    return { 
      success: false, 
      error: 'Identifiants invalides. Veuillez vérifier votre adresse email et votre mot de passe.' 
    };
  },

  // Récupérer la session active
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(ADMIN_SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  // Déconnexion
  async logout() {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signout:', e);
      }
    }
    localStorage.removeItem(ADMIN_SESSION_KEY);
    return true;
  }
};
