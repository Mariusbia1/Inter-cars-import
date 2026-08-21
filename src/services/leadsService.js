import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LOCAL_STORAGE_LEADS_KEY = 'intercars_leads_data';

const initialDemoLeads = [
  {
    id: 'lead-001',
    created_at: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    full_name: 'Guillaume de Montmirail',
    email: 'g.montmirail@lux-holdings.com',
    phone: '+33 6 42 18 90 22',
    vehicle_type: 'Supercar',
    brand_sought: 'Porsche',
    model_sought: '911 (992) GT3 RS',
    preferred_timeline: 'Moins de 30 jours',
    fuel_type: 'Essence',
    transmission: 'Automatique (PDK)',
    message: 'Recherche active d’un exemplaire Weissach en teinte exclusive (Vert Python ou Shark Blue), moins de 5 000 km, historique Porsche Approved uniquement.',
    status: 'Nouveau',
    admin_notes: 'Client très sérieux, profil VIP. Contact direct par téléphone prévu.',
    source: 'Configurateur Web'
  },
  {
    id: 'lead-002',
    created_at: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
    full_name: 'Frédéric Bellegarde',
    email: 'f.bellegarde@cabinet-avocats.fr',
    phone: '+33 6 11 88 34 50',
    vehicle_type: 'Sportive',
    brand_sought: 'Audi',
    model_sought: 'RS6 Avant Performance',
    preferred_timeline: '1 à 2 mois',
    fuel_type: 'Hybride / Essence',
    transmission: 'Automatique',
    message: 'Véhicule de direction recherché en Allemagne, première main certifiée constructeur. Toit panoramique et sono Bang & Olufsen indispensables.',
    status: 'En cours',
    admin_notes: 'Deux opportunités en Bavière identifiées. En attente du retour de la concession allemande.',
    source: 'Formulaire Contact'
  },
  {
    id: 'lead-003',
    created_at: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    full_name: 'Arthur Saint-Germain',
    email: 'arthur.stg@monaco-yachts.mc',
    phone: '+377 98 00 23 11',
    vehicle_type: 'SUV Prestige',
    brand_sought: 'Mercedes-Benz',
    model_sought: 'G 63 AMG Grand Edition',
    preferred_timeline: 'Immédiat',
    fuel_type: 'Essence V8',
    transmission: 'Automatique',
    message: 'Édition limitée recherchée pour livraison à Monaco. Nécessite immatriculation et gestion douanière complète.',
    status: 'Devis envoyé',
    admin_notes: 'Proposition transmise avec audit complet du véhicule situé à Zurich.',
    source: 'Configurateur Web'
  }
];

export const leadsService = {
  // Récupérer tous les leads
  async getAllLeads() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase fetch failed, using local storage fallback', err);
      }
    }

    // Fallback LocalStorage
    const stored = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
    if (!stored) {
      localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(initialDemoLeads));
      return initialDemoLeads;
    }
    return JSON.parse(stored);
  },

  // Créer une nouvelle demande de devis
  async createLead(leadData) {
    const newLead = {
      id: 'lead-' + Date.now(),
      created_at: new Date().toISOString(),
      status: 'Nouveau',
      source: 'Web Conciergerie',
      ...leadData
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .insert([newLead])
          .select();
        if (!error && data && data.length > 0) return data[0];
      } catch (err) {
        console.warn('Supabase insert failed, using local fallback', err);
      }
    }

    // Sauvegarde locale
    const current = await this.getAllLeads();
    const updated = [newLead, ...current];
    localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(updated));
    return newLead;
  },

  // Mettre à jour le statut ou les notes d'un lead
  async updateLead(id, updates) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .update(updates)
          .eq('id', id)
          .select();
        if (!error && data && data.length > 0) return data[0];
      } catch (err) {
        console.warn('Supabase update failed, using local fallback', err);
      }
    }

    const current = await this.getAllLeads();
    const updated = current.map(item => (item.id === id ? { ...item, ...updates } : item));
    localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(updated));
    return updated.find(i => i.id === id);
  },

  // Supprimer un lead
  async deleteLead(id) {
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('leads').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete failed', err);
      }
    }

    const current = await this.getAllLeads();
    const updated = current.filter(item => item.id !== id);
    localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(updated));
    return true;
  }
};
