import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initialVehicles } from '../data/vehiclesData';

const LOCAL_STORAGE_VEHICLES_KEY = 'intercars_vehicles_catalog';

export const vehiclesService = {
  // Récupérer tous les véhicules
  async getAllVehicles() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('delivered_vehicles')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase vehicles fetch failed, using local storage', err);
      }
    }

    const stored = localStorage.getItem(LOCAL_STORAGE_VEHICLES_KEY);
    if (!stored) {
      localStorage.setItem(LOCAL_STORAGE_VEHICLES_KEY, JSON.stringify(initialVehicles));
      return initialVehicles;
    }
    return JSON.parse(stored);
  },

  // Ajouter un véhicule livré
  async addVehicle(vehicleData) {
    const newVehicle = {
      id: 'veh-' + Date.now(),
      created_at: new Date().toISOString(),
      gallery: [vehicleData.image_url],
      rating: 5,
      ...vehicleData
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('delivered_vehicles')
          .insert([newVehicle])
          .select();
        if (!error && data && data.length > 0) return data[0];
      } catch (err) {
        console.warn('Supabase add vehicle failed', err);
      }
    }

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
        if (!error && data && data.length > 0) return data[0];
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
