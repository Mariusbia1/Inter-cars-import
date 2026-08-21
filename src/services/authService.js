import { supabase, isSupabaseConfigured } from '../lib/supabase';

const ADMIN_SESSION_KEY = 'intercars_admin_session';

export const authService = {
  // Connexion Admin
  async login(email, password) {
    // Si Supabase est branché, tenter Supabase Auth
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error && data.session) {
          const user = {
            id: data.user.id,
            email: data.user.email,
            role: 'Super Admin',
            authenticated_at: new Date().toISOString()
          };
          localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(user));
          return { success: true, user };
        }
      } catch (err) {
        console.warn('Supabase auth failed, fallbacking to demo credentials', err);
      }
    }

    // Identifiants Administrateur Démo
    const DEMO_EMAIL = 'admin@intercarsimport.fr';
    const DEMO_PASSWORD = 'AdminRolex2026!';

    if (email.toLowerCase().trim() === DEMO_EMAIL.toLowerCase() && password === DEMO_PASSWORD) {
      const user = {
        id: 'admin-master-01',
        email: DEMO_EMAIL,
        name: 'Directeur Sourcing & Conciergerie',
        role: 'Super Administrateur',
        authenticated_at: new Date().toISOString()
      };
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(user));
      return { success: true, user };
    }

    return { 
      success: false, 
      error: 'Identifiants incorrects. Utilisez admin@intercarsimport.fr et AdminRolex2026! pour tester.' 
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
        console.warn('Supabase signout failed', e);
      }
    }
    localStorage.removeItem(ADMIN_SESSION_KEY);
    return true;
  }
};
