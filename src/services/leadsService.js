import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LOCAL_STORAGE_LEADS_KEY = 'intercars_leads_data';

const initialDemoLeads = [
  {
    full_name: 'Guillaume de Montmirail',
    email: 'g.montmirail@lux-holdings.com',
    phone: '+33 6 42 18 90 22',
    vehicle_type: 'Supercar',
    brand_sought: 'Porsche',
    model_sought: '911 (992) GT3 RS',
    preferred_timeline: 'Moins de 30 jours',
    fuel_type: 'Essence',
    transmission: 'Automatique (PDK)',
    message: 'Recherche active d’un exemplaire en teinte exclusive (Vert Python ou Shark Blue), moins de 5 000 km, historique constructeur vérifié.',
    status: 'Nouveau',
    admin_notes: 'Client très sérieux, profil VIP. Contact direct par téléphone prévu.',
    source: 'Configurateur Web'
  },
  {
    full_name: 'Frédéric Bellegarde',
    email: 'f.bellegarde@cabinet-avocats.fr',
    phone: '+33 6 11 88 34 50',
    vehicle_type: 'Sportive',
    brand_sought: 'Audi',
    model_sought: 'RS6 Avant Performance',
    preferred_timeline: '1 à 2 mois',
    fuel_type: 'Hybride / Essence',
    transmission: 'Automatique',
    message: 'Véhicule de direction recherché, première main certifiée constructeur. Toit panoramique et sono Bang & Olufsen indispensables.',
    status: 'En cours',
    admin_notes: 'Deux opportunités conformes identifiées. En attente du retour de la concession.',
    source: 'Formulaire Contact'
  },
  {
    full_name: 'Arthur Saint-Germain',
    email: 'arthur.stg@monaco-yachts.mc',
    phone: '+377 98 00 23 11',
    vehicle_type: 'SUV Prestige',
    brand_sought: 'Mercedes-Benz',
    model_sought: 'G 63 AMG Grand Edition',
    preferred_timeline: 'Immédiat',
    fuel_type: 'Essence V8',
    transmission: 'Automatique',
    message: 'Édition limitée recherchée pour livraison à Monaco avec audit complet.',
    status: 'Devis envoyé',
    admin_notes: 'Proposition transmise avec audit complet du véhicule.',
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

        if (!error && data && data.length > 0) {
          return data;
        }

        // Auto-seed initial leads si la table est vide
        if (!error && data && data.length === 0) {
          try {
            const { data: inserted } = await supabase
              .from('leads')
              .insert(initialDemoLeads)
              .select();
            if (inserted && inserted.length > 0) return inserted;
          } catch (seedErr) {
            console.warn('Auto-seed leads failed:', seedErr);
          }
        }
      } catch (err) {
        console.warn('Supabase leads fetch failed, using local storage fallback', err);
      }
    }

    const stored = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
    if (!stored) {
      const demoWithIds = initialDemoLeads.map((l, i) => ({
        id: `lead-demo-${i + 1}`,
        created_at: new Date(Date.now() - (i + 1) * 3600 * 1000 * 12).toISOString(),
        ...l
      }));
      localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(demoWithIds));
      return demoWithIds;
    }
    return JSON.parse(stored);
  },

  // Créer une nouvelle demande de devis (reçue du formulaire Contact)
  async createLead(leadData) {
    if (isSupabaseConfigured()) {
      try {
        const payload = {
          created_at: new Date().toISOString(),
          status: 'Nouveau',
          source: 'Web Conciergerie',
          ...leadData
        };
        delete payload.id; // Laisser Supabase attribuer le UUID

        const { data, error } = await supabase
          .from('leads')
          .insert([payload])
          .select();

        if (!error && data && data.length > 0) {
          return { success: true, lead: data[0] };
        }
        if (error) {
          console.error('Erreur insertion Lead Supabase:', error);
        }
      } catch (err) {
        console.warn('Supabase insert lead failed, using local fallback', err);
      }
    }

    const newLead = {
      id: 'lead-' + Date.now(),
      created_at: new Date().toISOString(),
      status: 'Nouveau',
      source: 'Web Conciergerie',
      ...leadData
    };

    const current = await this.getAllLeads();
    const updated = [newLead, ...current];
    localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(updated));
    return { success: true, lead: newLead };
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

        if (!error && data && data.length > 0) {
          return data[0];
        }
      } catch (err) {
        console.warn('Supabase update lead failed', err);
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
        console.warn('Supabase delete lead failed', err);
      }
    }

    const current = await this.getAllLeads();
    const updated = current.filter(item => item.id !== id);
    localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(updated));
    return true;
  }
};
