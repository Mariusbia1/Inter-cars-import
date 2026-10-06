import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { emailNotificationService } from './emailNotificationService';

const LOCAL_STORAGE_LEADS_KEY = 'intercars_leads_live_v1';

// Schéma de validation et d'assainissement strict des leads
function validateAndSanitizeLead(leadData) {
  if (!leadData || typeof leadData !== 'object') {
    return {
      isValid: false,
      error: 'Données de formulaire invalides.'
    };
  }

  const fullName = String(leadData.full_name || 'Prospect').trim().slice(0, 100);
  const email = String(leadData.email || '').trim().slice(0, 150);
  const phone = String(leadData.phone || '').trim().slice(0, 30);
  const vehicleType = String(leadData.vehicle_type || 'Sportive').trim().slice(0, 60);
  const brandSought = String(leadData.brand_sought || '').trim().slice(0, 80);
  const modelSought = String(leadData.model_sought || '').trim().slice(0, 80);
  const deliveryCity = String(leadData.delivery_city || 'France').trim().slice(0, 80);
  const preferredTimeline = String(leadData.preferred_timeline || 'En 21 jours').trim().slice(0, 60);
  const fuelType = String(leadData.fuel_type || 'Essence').trim().slice(0, 40);
  const transmission = String(leadData.transmission || 'Automatique').trim().slice(0, 40);
  const message = String(leadData.message || '').trim().slice(0, 3000);

  // Validation format email si renseigné
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { isValid: false, error: 'Format d\'adresse email invalide.' };
  }

  return {
    isValid: true,
    data: {
      created_at: new Date().toISOString(),
      status: 'Nouveau',
      source: 'Formulaire Web',
      full_name: fullName,
      email,
      phone,
      vehicle_type: vehicleType,
      brand_sought: brandSought,
      model_sought: modelSought,
      budget_range: leadData.budget_range ? String(leadData.budget_range).slice(0, 40) : null,
      preferred_timeline: preferredTimeline,
      fuel_type: fuelType,
      transmission: transmission,
      delivery_city: deliveryCity,
      message,
      admin_notes: null
    }
  };
}

export const leadsService = {
  // Récupérer tous les leads réels depuis Supabase (avec fallback local si hors-ligne)
  async getAllLeads() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          // Filtrer les anciens faux leads de test contenant 'Supercar' ou 'VIP' si présents
          const cleanLeads = data.filter(
            l => !(l.vehicle_type === 'Supercar' || (l.admin_notes && l.admin_notes.includes('VIP')))
          );
          return cleanLeads;
        }
      } catch (err) {
        console.warn('Supabase leads fetch failed, using local storage fallback', err);
      }
    }

    const stored = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
    if (!stored) {
      return [];
    }
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  // Créer une nouvelle demande de devis (reçue du formulaire Contact)
  async createLead(leadData) {
    const validation = validateAndSanitizeLead(leadData);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const newLeadPayload = validation.data;

    let createdLead = null;

    // 1. Enregistrement direct dans Supabase
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .insert([newLeadPayload])
          .select();

        if (!error && data && data.length > 0) {
          createdLead = data[0];
          console.log('✅ Lead enregistré dans Supabase avec succès, ID:', createdLead.id);
        } else if (error) {
          console.error('❌ Erreur insertion Lead Supabase:', error);
        }
      } catch (err) {
        console.error('❌ Exception Supabase insert lead:', err);
      }
    }

    // 2. Si non créé par Supabase, création locale
    if (!createdLead) {
      createdLead = {
        id: 'lead-' + Date.now(),
        ...newLeadPayload
      };
    }

    // 3. Mise à jour du cache local
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
      const current = stored ? JSON.parse(stored) : [];
      localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify([createdLead, ...current]));
    } catch (e) {
      console.warn('Storage cache error:', e);
    }

    // 4. Déclenchement de l'envoi de notification Email
    try {
      const recipient = leadData.routed_to_email || 'contact@inter-cars-import.fr';
      emailNotificationService.sendLeadNotification(createdLead, recipient);
    } catch (emailErr) {
      console.warn('Email dispatch warning:', emailErr);
    }

    return { success: true, lead: createdLead };
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
