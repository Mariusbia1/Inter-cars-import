import { supabase, isSupabaseConfigured } from '../lib/supabase';

const ADMIN_SESSION_KEY = 'intercars_admin_session_v1';

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

// Liste des emails administrateurs autorisés
const AUTHORIZED_ADMIN_EMAILS = [
  'contact@inter-cars-import.fr',
  'direction@intercarsimport.fr',
  'admin@intercarsimport.fr',
  'contact@intercars.fr'
];

// Mots de passe d'administration acceptés
const VALID_PASSWORD_HASHES = [
  '2d93d9c5ab8ea64037fc02f35c60a358d13e9bf8317f7e4de1db4de62be3d3cc', // Empreinte d'origine
  'c3d505577ec35d3be7f5097822274971ca8e8af3457e989e410dc3278a5f47cf', // InterCars2026!
  '36d8ad45f1f1b5519b041454677111370855325609af747d8516ea1c1078b026', // intercars2026!
  '04445e6487736590d1ef50186b414e737e0164683cbbec64e00e73c000fd3bef'  // Admin2026!
];

export const authService = {
  // Connexion sécurisée
  async login(email, password) {
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      return { success: false, error: 'Veuillez saisir votre email et votre mot de passe.' };
    }

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
        console.warn('Supabase auth attempt:', err);
      }
    }

    // 2. Vérification par identifiants autorisés et empreinte SHA-256
    const passwordHash = await computeHash(cleanPassword);
    const isEmailValid = AUTHORIZED_ADMIN_EMAILS.includes(cleanEmail) || cleanEmail.includes('inter-cars') || cleanEmail.includes('intercars');
    const isPasswordValid = VALID_PASSWORD_HASHES.includes(passwordHash) || cleanPassword.toLowerCase() === 'intercars2026!' || cleanPassword.toLowerCase() === 'admin2026!';

    if (isEmailValid && isPasswordValid) {
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
      error: 'Identifiants invalides. Veuillez vérifier votre adresse email et votre mot de passe administrateur.' 
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
