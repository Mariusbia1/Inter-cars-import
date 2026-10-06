import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initialVehicles, enrichVehicleData } from '../data/vehiclesData';

const LOCAL_STORAGE_CACHE_KEY = 'intercars_vehicles_supabase_cache_v2';

// Nettoyage automatique des anciennes clés conflictuelles
try {
  localStorage.removeItem('intercars_deleted_vehicles_v1');
  localStorage.removeItem('intercars_vehicles_live_v1');
} catch {
  // Ignorer
}

// Mappage des catégories pour respecter la contrainte CHECK de PostgreSQL
const mapCategoryToDb = (category) => {
  if (category === 'Berline & Break') return 'Berline GT';
  if (category === 'SUV & 4x4') return 'SUV Prestige';
  if (category === 'Compacte & Citadine') return 'Sportive';
  if (['Supercar', 'Sportive', 'SUV Prestige', 'Berline GT'].includes(category)) {
    return category;
  }
  return 'Sportive';
};

const mapCategoryFromDb = (dbCategory, model = '') => {
  if (dbCategory === 'Berline GT') return 'Berline & Break';
  if (dbCategory === 'SUV Prestige') return 'SUV & 4x4';
  if (dbCategory === 'Supercar') return 'Sportive';
  if (model && (model.includes('Golf') || model.includes('Mini') || model.includes('A3') || model.includes('Clio') || model.includes('208'))) {
    return 'Compacte & Citadine';
  }
  return dbCategory || 'Sportive';
};

// Encodage standardisé des métadonnées dans la colonne client_review
const encodeExtendedData = (vehicle) => {
  const extra = {
    price: (vehicle.price !== undefined && vehicle.price !== null && vehicle.price !== '') ? Number(vehicle.price) : null,
    discount_percent: vehicle.discount_percent !== undefined ? Number(vehicle.discount_percent) : null,
    availability_status: vehicle.availability_status || 'ARRIVAGE',
    equipments: Array.isArray(vehicle.equipments) ? vehicle.equipments : [],
    specs: vehicle.specs || {},
    colors: vehicle.colors || [],
    fuel_type: vehicle.fuel_type || 'Diesel',
    fiscal_power: vehicle.fiscal_power ? Number(vehicle.fiscal_power) : 8,
    color_ext: vehicle.color_ext || 'Gris',
    color_int: vehicle.color_int || 'Noir',
    doors: vehicle.doors || '5 portes',
    seats: vehicle.seats ? Number(vehicle.seats) : 5,
    customReview: vehicle.client_review || ''
  };
  return `__INTERCARS_DATA__:${JSON.stringify(extra)}`;
};

// Décodage des métadonnées étendues
const decodeExtendedData = (record) => {
  if (!record) return record;
  let decoded = { ...record };
  if (record.client_review && typeof record.client_review === 'string' && record.client_review.startsWith('__INTERCARS_DATA__:')) {
    try {
      const jsonStr = record.client_review.replace('__INTERCARS_DATA__:', '');
      const parsed = JSON.parse(jsonStr);
      decoded = {
        ...decoded,
        ...parsed,
        client_review: parsed.customReview || ''
      };
    } catch (e) {
      console.warn('Failed to parse vehicle extended data', e);
    }
  }
  return decoded;
};

// Prépare le payload strictement conforme aux colonnes PostgreSQL de delivered_vehicles
const formatDbPayload = (vehicle) => {
  const gallery = Array.isArray(vehicle.gallery) ? vehicle.gallery : [];
  const mainImage = gallery.length > 0 ? gallery[0] : (vehicle.image_url || '');

  return {
    title: vehicle.title || 'Véhicule sans titre',
    brand: vehicle.brand || 'Marque',
    model: vehicle.model || vehicle.title || 'Modèle',
    category: mapCategoryToDb(vehicle.category),
    year: parseInt(vehicle.year, 10) || new Date().getFullYear(),
    mileage: parseInt(vehicle.mileage, 10) || 0,
    power_hp: parseInt(vehicle.power_hp, 10) || 0,
    engine: vehicle.engine || '2.0L',
    transmission: vehicle.transmission || 'Automatique',
    origin_country: vehicle.origin_country || 'Réseau Partenaire France',
    delivery_city: vehicle.delivery_city || 'France entière',
    certification: vehicle.certification || 'Audit 150 Points Validé',
    warranty: vehicle.warranty || 'Garantie Constructeur',
    image_url: mainImage || 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
    gallery: gallery,
    client_name: vehicle.client_name || '',
    client_city: vehicle.client_city || '',
    client_review: encodeExtendedData(vehicle),
    rating: 5,
    is_featured: Boolean(vehicle.is_featured)
  };
};

export const vehiclesService = {
  // 1. LIRE TOUS LES VÉHICULES (Supabase = Seule source de vérité)
  async getAllVehicles() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('delivered_vehicles')
          .select('id, created_at, title, brand, model, category, year, mileage, power_hp, engine, transmission, origin_country, delivery_city, certification, warranty, image_url, client_name, client_city, client_review, rating, is_featured')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase fetch error:', error);
          throw error;
        }

        if (Array.isArray(data)) {
          const list = data.map((item) => {
            const decoded = decodeExtendedData(item);
            return enrichVehicleData({
              ...decoded,
              category: mapCategoryFromDb(decoded.category, decoded.model)
            });
          });

          // Mettre en cache pour affichage instantané ou hors-ligne
          try {
            localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(list));
          } catch {
            // Ignorer si quota plein
          }

          return list;
        }
      } catch (err) {
        console.warn('Supabase getAllVehicles failed, checking cache:', err);
      }
    }

    // Fallback cache local si Supabase est temporairement injoignable
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed.map(enrichVehicleData);
      }
    } catch {
      // Ignorer
    }

    return [];
  },

  // 2. LIRE UN VÉHICULE PAR ID
  async getVehicleById(id) {
    if (!id) return null;

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('delivered_vehicles')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (!error && data) {
          const decoded = decodeExtendedData(data);
          let finalGallery = Array.isArray(decoded.gallery) ? decoded.gallery : [];

          // Charger les images depuis la table dédiée vehicle_images si elle existe
          try {
            const { data: imgRows, error: imgErr } = await supabase
              .from('vehicle_images')
              .select('image_url, position')
              .eq('vehicle_id', id)
              .order('position', { ascending: true });

            if (!imgErr && imgRows && imgRows.length > 0) {
              finalGallery = imgRows.map((r) => r.image_url);
            }
          } catch {
            // Ignorer si la table n'est pas encore créée
          }

          return enrichVehicleData({
            ...decoded,
            gallery: finalGallery,
            image_url: finalGallery[0] || decoded.image_url || '',
            category: mapCategoryFromDb(decoded.category, decoded.model)
          });
        }
      } catch (err) {
        console.warn('Supabase getVehicleById error:', err);
      }
    }

    // Fallback dans la liste complète
    const all = await this.getAllVehicles();
    return all.find((v) => String(v.id) === String(id)) || null;
  },

  // 3. AJOUTER UN VÉHICULE (INSERT DIRECT DANS SUPABASE + TABLE VEHICLE_IMAGES)
  async addVehicle(vehicleData) {
    if (!isSupabaseConfigured()) {
      throw new Error('Base de données Supabase non configurée.');
    }

    const payload = formatDbPayload(vehicleData);

    const { data, error } = await supabase
      .from('delivered_vehicles')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Supabase Insert Error:', error);
      throw new Error(error.message || "Erreur lors de l'enregistrement dans la base de données.");
    }

    const createdId = data.id;
    const gallery = Array.isArray(vehicleData.gallery) ? vehicleData.gallery : [];

    // Insérer les photos dans la table dédiée vehicle_images si elle existe
    if (gallery.length > 0) {
      try {
        const imageRows = gallery.map((url, idx) => ({
          vehicle_id: createdId,
          image_url: url,
          position: idx
        }));
        await supabase.from('vehicle_images').insert(imageRows);
      } catch (imgErr) {
        console.warn('Note: vehicle_images insert skipped:', imgErr);
      }
    }

    const decoded = decodeExtendedData(data);
    const createdVehicle = enrichVehicleData({
      ...decoded,
      gallery: gallery.length > 0 ? gallery : (decoded.gallery || []),
      category: mapCategoryFromDb(decoded.category, decoded.model)
    });

    return createdVehicle;
  },

  // 4. METTRE À JOUR UN VÉHICULE (UPDATE PAR ID DANS SUPABASE)
  async updateVehicle(id, updates) {
    if (!isSupabaseConfigured()) {
      throw new Error('Base de données Supabase non configurée.');
    }

    const existing = await this.getVehicleById(id);
    const merged = {
      ...existing,
      ...updates,
      id
    };

    const payload = formatDbPayload(merged);

    const { data, error } = await supabase
      .from('delivered_vehicles')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase Update Error:', error);
      throw new Error(error.message || "Erreur lors de la mise à jour dans la base de données.");
    }

    const gallery = Array.isArray(updates.gallery) ? updates.gallery : (existing?.gallery || []);

    // Mettre à jour la table vehicle_images si des photos sont fournies
    if (Array.isArray(updates.gallery)) {
      try {
        await supabase.from('vehicle_images').delete().eq('vehicle_id', id);
        if (gallery.length > 0) {
          const imageRows = gallery.map((url, idx) => ({
            vehicle_id: id,
            image_url: url,
            position: idx
          }));
          await supabase.from('vehicle_images').insert(imageRows);
        }
      } catch (imgErr) {
        console.warn('Note: vehicle_images update skipped:', imgErr);
      }
    }

    const decoded = decodeExtendedData(data);
    return enrichVehicleData({
      ...decoded,
      gallery,
      category: mapCategoryFromDb(decoded.category, decoded.model)
    });
  },

  // 5. SUPPRIMER UN VÉHICULE (DELETE STRICT PAR ID DANS SUPABASE)
  async deleteVehicle(id) {
    if (!id) return true;

    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('delivered_vehicles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase Delete Error:', error);
        throw new Error(error.message || "Erreur lors de la suppression dans la base de données.");
      }
    }

    // Mettre à jour le cache local
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        const filtered = parsed.filter((v) => String(v.id) !== String(id));
        localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(filtered));
      }
    } catch {
      // Ignorer
    }

    return true;
  },

  // 6. INITIALISER / RÉINITIALISER LES VÉHICULES DE DÉMO DANS SUPABASE SI SOUHAITÉ
  async seedDemoVehicles() {
    if (!isSupabaseConfigured()) return [];

    const seedPayloads = initialVehicles.slice(0, 5).map((v) => {
      const { id, ...rest } = v;
      return formatDbPayload(rest);
    });

    const { data, error } = await supabase
      .from('delivered_vehicles')
      .insert(seedPayloads)
      .select();

    if (error) {
      console.error('Seed Error:', error);
      throw error;
    }

    return data.map((d) => enrichVehicleData(decodeExtendedData(d)));
  }
};
