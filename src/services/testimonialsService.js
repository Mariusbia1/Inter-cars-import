import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { testimonialsList } from '../data/testimonialsData';

const LOCAL_STORAGE_TESTIMONIALS_KEY = 'intercars_testimonials_v3';

export const testimonialsService = {
  async getAllTestimonials() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length >= 10) {
          return data;
        }

        // Si Supabase a une ancienne liste ou est vide, on l'actualise avec nos 12 avis complets
        if (!error && testimonialsList.length > 0) {
          try {
            const seedPayload = testimonialsList.map(t => {
              const { id, ...rest } = t;
              return {
                ...rest,
                avatar_url: t.avatar
              };
            });
            await supabase.from('testimonials').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            const { data: inserted } = await supabase
              .from('testimonials')
              .insert(seedPayload)
              .select();
            if (inserted && inserted.length > 0) return inserted;
          } catch (seedErr) {
            console.warn('Sync testimonials to Supabase failed:', seedErr);
          }
        }
      } catch (err) {
        console.warn('Failed to load testimonials from Supabase:', err);
      }
    }

    // Toujours retourner la liste fraîche complète de 12 témoignages
    localStorage.setItem(LOCAL_STORAGE_TESTIMONIALS_KEY, JSON.stringify(testimonialsList));
    return testimonialsList;
  }
};
