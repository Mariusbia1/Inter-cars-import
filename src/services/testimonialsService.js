import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { testimonialsList } from '../data/testimonialsData';

const LOCAL_STORAGE_TESTIMONIALS_KEY = 'intercars_testimonials_data';

export const testimonialsService = {
  async getAllTestimonials() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data;
        }

        // Si la table est vide, auto-remplissage avec la sélection initiale
        if (!error && data && data.length === 0 && testimonialsList.length > 0) {
          try {
            const seedPayload = testimonialsList.map(t => {
              const { id, ...rest } = t;
              return {
                ...rest,
                avatar_url: t.avatar
              };
            });
            const { data: inserted } = await supabase
              .from('testimonials')
              .insert(seedPayload)
              .select();
            if (inserted && inserted.length > 0) return inserted;
          } catch (seedErr) {
            console.warn('Auto-seed testimonials failed:', seedErr);
          }
        }
      } catch (err) {
        console.warn('Failed to load testimonials from Supabase:', err);
      }
    }

    const stored = localStorage.getItem(LOCAL_STORAGE_TESTIMONIALS_KEY);
    if (!stored) {
      localStorage.setItem(LOCAL_STORAGE_TESTIMONIALS_KEY, JSON.stringify(testimonialsList));
      return testimonialsList;
    }
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length >= 6) {
        return parsed;
      }
      localStorage.setItem(LOCAL_STORAGE_TESTIMONIALS_KEY, JSON.stringify(testimonialsList));
      return testimonialsList;
    } catch {
      localStorage.setItem(LOCAL_STORAGE_TESTIMONIALS_KEY, JSON.stringify(testimonialsList));
      return testimonialsList;
    }
  }
};
