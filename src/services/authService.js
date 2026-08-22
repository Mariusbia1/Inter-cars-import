import { supabase, isSupabaseConfigured } from '../lib/supabase';

const ADMIN_SESSION_KEY = 'intercars_admin_session';

// Hachage cryptographique SHA-256 standard Web Crypto API
const computeHash = async (value) => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } catch {
    return '';
  }
};

// Signatures cryptographiques SHA-256 (aucun mot de passe ni email en clair dans le code)
const AUTH_IDENTITY_HASH = '0129df8c44a3c200a441ce1d0dda3b258db259d7e9141265ef45d4318ccfc21f';
const AUTH_SECRET_HASH = '2d93d9c5ab8ea64037fc02f35c60a358d13e9bf8317f7e4de1db4de62be3d3cc';

export const authService = {
  // Connexion sécurisée
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

        if (!error && data?.session) {
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
        console.warn('Supabase auth validation:', err);
      }
    }

    // 2. Vérification par empreinte cryptographique SHA-256
    const [inputEmailHash, inputPasswordHash] = await Promise.all([
      computeHash(cleanEmail),
      computeHash(cleanPassword)
    ]);

    if (inputEmailHash === AUTH_IDENTITY_HASH && inputPasswordHash === AUTH_SECRET_HASH) {
      const user = {
        id: 'admin-master-intercars',
        email: cleanEmail,
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
