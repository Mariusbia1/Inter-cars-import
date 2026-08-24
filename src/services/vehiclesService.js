import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initialVehicles } from '../data/vehiclesData';

const LOCAL_STORAGE_VEHICLES_KEY = 'intercars_vehicles_live_v1';

// Mappage des catégories pour compatibilité avec la base de données Supabase
const mapCategoryToDb = (category) => {
  if (category === 'Berline & Break') return 'Berline GT';
  if (category === 'SUV & 4x4') return 'SUV Prestige';
  if (category === 'Compacte & Citadine') return 'Sportive';
  return category || 'Sportive';
};

const mapCategoryFromDb = (dbCategory, model = '') => {
  if (dbCategory === 'Berline GT') return 'Berline & Break';
  if (dbCategory === 'SUV Prestige') return 'SUV & 4x4';
  if (dbCategory === 'Supercar') return 'Sportive';
  if (model && (model.includes('Golf') || model.includes('Mini') || model.includes('A3'))) {
    return 'Compacte & Citadine';
  }
  return dbCategory || 'Sportive';
};

export const vehiclesService = {
  // Récupérer tous les véhicules depuis Supabase
  async getAllVehicles() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('delivered_vehicles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map(v => ({
            ...v,
            category: mapCategoryFromDb(v.category, v.model)
          }));
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
      return JSON.parse(stored);
    } catch {
      return initialVehicles;
    }
  },

  // Ajouter un véhicule dans Supabase
  async addVehicle(vehicleData) {
    const payload = {
      created_at: new Date().toISOString(),
      gallery: vehicleData.image_url ? [vehicleData.image_url] : [],
      rating: 5,
      ...vehicleData,
      category: mapCategoryToDb(vehicleData.category)
    };
    delete payload.id;

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('delivered_vehicles')
          .insert([payload])
          .select();

        if (!error && data && data.length > 0) {
          const created = {
            ...data[0],
            category: mapCategoryFromDb(data[0].category, data[0].model)
          };
          return created;
        }
        if (error) {
          console.error('Supabase add vehicle error:', error);
        }
      } catch (err) {
        console.warn('Supabase add vehicle failed, using local fallback', err);
      }
    }

    const newVehicle = {
      id: 'veh-' + Date.now(),
      ...vehicleData
    };
    const current = await this.getAllVehicles();
    const updated = [newVehicle, ...current];
    localStorage.setItem(LOCAL_STORAGE_VEHICLES_KEY, JSON.stringify(updated));
    return newVehicle;
  },

  // Modifier un véhicule dans Supabase
  async updateVehicle(id, updates) {
    const dbUpdates = { ...updates };
    if (updates.category) {
      dbUpdates.category = mapCategoryToDb(updates.category);
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('delivered_vehicles')
          .update(dbUpdates)
          .eq('id', id)
          .select();

        if (!error && data && data.length > 0) {
          return {
            ...data[0],
            category: mapCategoryFromDb(data[0].category, data[0].model)
          };
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

  // Supprimer un véhicule dans Supabase
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
