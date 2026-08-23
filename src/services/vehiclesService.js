import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initialVehicles } from '../data/vehiclesData';

const LOCAL_STORAGE_VEHICLES_KEY = 'intercars_vehicles_catalog';

export const vehiclesService = {
  // Récupérer tous les véhicules (avec auto-initialisation si la base Supabase est vide)
  async getAllVehicles() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('delivered_vehicles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data;
        }

        // Si la table Supabase est vide, on l'initialise automatiquement avec notre catalogue sans plaque
        if (!error && data && data.length === 0 && initialVehicles.length > 0) {
          try {
            const seedPayload = initialVehicles.map(v => {
              const { id, ...rest } = v;
              return {
                ...rest,
                rating: 5,
                gallery: [v.image_url]
              };
            });
            const { data: inserted } = await supabase
              .from('delivered_vehicles')
              .insert(seedPayload)
              .select();
            if (inserted && inserted.length > 0) {
              return inserted;
            }
          } catch (seedErr) {
            console.warn('Auto-seed Supabase failed:', seedErr);
          }
        }
      } catch (err) {
        console.warn('Supabase vehicles fetch failed, using local storage fallback', err);
      }
    }

    const stored = localStorage.getItem(LOCAL_STORAGE_VEHICLES_KEY);
    if (!stored) {
      localStorage.setItem(LOCAL_STORAGE_VEHICLES_KEY, JSON.stringify(initialVehicles));
      return initialVehicles;
    }
    try {
      const parsed = JSON.parse(stored);
      // Si la liste locale a moins d'éléments ou de vieilles URLs, on met à jour
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      localStorage.setItem(LOCAL_STORAGE_VEHICLES_KEY, JSON.stringify(initialVehicles));
      return initialVehicles;
    } catch {
      localStorage.setItem(LOCAL_STORAGE_VEHICLES_KEY, JSON.stringify(initialVehicles));
      return initialVehicles;
    }
  },

  // Forcer la synchronisation du catalogue propre vers Supabase et LocalStorage
  async syncCatalog() {
    if (isSupabaseConfigured()) {
      try {
        const seedPayload = initialVehicles.map(v => {
          const { id, ...rest } = v;
          return {
            ...rest,
            rating: 5,
            gallery: [v.image_url]
          };
        });

        // Nettoyage et réinsertion propre
        await supabase.from('delivered_vehicles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        const { data: inserted } = await supabase
          .from('delivered_vehicles')
          .insert(seedPayload)
          .select();

        if (inserted && inserted.length > 0) {
          localStorage.setItem(LOCAL_STORAGE_VEHICLES_KEY, JSON.stringify(inserted));
          return inserted;
        }
      } catch (err) {
        console.warn('Supabase catalog sync failed:', err);
      }
    }

    localStorage.setItem(LOCAL_STORAGE_VEHICLES_KEY, JSON.stringify(initialVehicles));
    return initialVehicles;
  },

  // Ajouter un véhicule
  async addVehicle(vehicleData) {
    if (isSupabaseConfigured()) {
      try {
        const payload = {
          created_at: new Date().toISOString(),
          gallery: [vehicleData.image_url],
          rating: 5,
          ...vehicleData
        };
        delete payload.id; // Laisser Supabase générer le UUID

        const { data, error } = await supabase
          .from('delivered_vehicles')
          .insert([payload])
          .select();

        if (!error && data && data.length > 0) {
          return data[0];
        }
      } catch (err) {
        console.warn('Supabase add vehicle failed, using local fallback', err);
      }
    }

    const newVehicle = {
      id: 'veh-' + Date.now(),
      created_at: new Date().toISOString(),
      gallery: [vehicleData.image_url],
      rating: 5,
      ...vehicleData
    };

    const current = await this.getAllVehicles();
    const updated = [newVehicle, ...current];
    localStorage.setItem(LOCAL_STORAGE_VEHICLES_KEY, JSON.stringify(updated));
    return newVehicle;
  },

  // Modifier un véhicule
  async updateVehicle(id, updates) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('delivered_vehicles')
          .update(updates)
          .eq('id', id)
          .select();

        if (!error && data && data.length > 0) {
          return data[0];
        }
      } catch (err) {
        console.warn('Supabase update vehicle failed', err);
      }
    }

    const current = await this.getAllVehicles();
    const updated = current.map(item => (item.id === id ? { ...item, ...updates } : item));
    localStorage.setItem(LOCAL_STORAGE_VEHICLES_KEY, JSON.stringify(updated));
    return updated.find(i => i.id === id);
  },

  // Supprimer un véhicule
  async deleteVehicle(id) {
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('delivered_vehicles').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete vehicle failed', err);
      }
    }

    const current = await this.getAllVehicles();
    const updated = current.filter(item => item.id !== id);
    localStorage.setItem(LOCAL_STORAGE_VEHICLES_KEY, JSON.stringify(updated));
    return true;
  }
};
