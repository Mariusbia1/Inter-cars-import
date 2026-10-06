import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initialVehicles, enrichVehicleData } from '../data/vehiclesData';

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
  if (model && (model.includes('Golf') || model.includes('Mini') || model.includes('A3') || model.includes('Clio') || model.includes('208'))) {
    return 'Compacte & Citadine';
  }
  return dbCategory || 'Sportive';
};

// Encodage sécurisé des métadonnées étendues (prix, équipements, specs, couleurs)
const encodeExtendedData = (vehicle) => {
  const extra = {
    price: vehicle.price ?? null,
    discount_percent: vehicle.discount_percent ?? 12,
    availability_status: vehicle.availability_status || 'ARRIVAGE',
    equipments: vehicle.equipments || [],
    specs: vehicle.specs || {},
    colors: vehicle.colors || [],
    fuel_type: vehicle.fuel_type || 'Diesel',
    fiscal_power: vehicle.fiscal_power || 8,
    color_ext: vehicle.color_ext || 'Gris',
    color_int: vehicle.color_int || 'Noir',
    doors: vehicle.doors || '5 portes',
    seats: vehicle.seats || 5,
    customReview: vehicle.client_review || ''
  };
  return `__INTERCARS_DATA__:${JSON.stringify(extra)}`;
};

// Décodage des métadonnées
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
      console.warn('Failed to parse vehicle extended metadata', e);
    }
  }
  return decoded;
};

// Préparation du payload strict pour la table Supabase
const buildCleanSupabasePayload = (vehicleData) => {
  const mainImage = (vehicleData.gallery && vehicleData.gallery[0]) || vehicleData.image_url || '';
  const galleryArray = Array.isArray(vehicleData.gallery) ? vehicleData.gallery : (mainImage ? [mainImage] : []);

  return {
    created_at: new Date().toISOString(),
    title: vehicleData.title || 'Véhicule d\'exception certifié',
    brand: vehicleData.brand || 'Volkswagen',
    model: vehicleData.model || vehicleData.title || 'Modèle',
    category: mapCategoryToDb(vehicleData.category),
    year: parseInt(vehicleData.year, 10) || new Date().getFullYear(),
    mileage: parseInt(vehicleData.mileage, 10) || 0,
    power_hp: parseInt(vehicleData.power_hp, 10) || 0,
    engine: vehicleData.engine || '2.0L',
    transmission: vehicleData.transmission || 'Automatique',
    origin_country: vehicleData.origin_country || 'Réseau Partenaire France',
    delivery_city: vehicleData.delivery_city || 'France entière',
    certification: vehicleData.certification || 'Audit 150 Points Validé',
    warranty: vehicleData.warranty || 'Garantie Constructeur',
    image_url: mainImage,
    gallery: galleryArray,
    client_name: vehicleData.client_name || '',
    client_city: vehicleData.client_city || '',
    client_review: encodeExtendedData(vehicleData),
    rating: 5,
    is_featured: Boolean(vehicleData.is_featured)
  };
};

// Sauvegarde localStorage avec gestion de quota anti-crash
const safeSetLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn('localStorage quota warning, applying lightweight optimization', err);
    try {
      const optimized = data.map((item, idx) => {
        if (idx === 0) return item;
        return {
          ...item,
          gallery: (item.gallery || []).filter((img) => typeof img === 'string' && !img.startsWith('data:')),
          image_url: typeof item.image_url === 'string' && item.image_url.startsWith('data:') ? '' : item.image_url
        };
      });
      localStorage.setItem(key, JSON.stringify(optimized));
    } catch {
      localStorage.setItem(key, JSON.stringify(data.slice(0, 10)));
    }
  }
};

export const vehiclesService = {
  // Récupérer tous les véhicules
  async getAllVehicles() {
    let supabaseVehicles = [];

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('delivered_vehicles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          supabaseVehicles = data.map((v) => {
            const decoded = decodeExtendedData(v);
            return enrichVehicleData({
              ...decoded,
              category: mapCategoryFromDb(decoded.category, decoded.model)
            });
          });
        }
      } catch (err) {
        console.warn('Supabase vehicles fetch failed, using local storage fallback', err);
      }
    }

    // Récupérer local storage
    const stored = localStorage.getItem(LOCAL_STORAGE_VEHICLES_KEY);
    let localVehicles = [];
    if (stored) {
      try {
        localVehicles = JSON.parse(stored).map((v) => enrichVehicleData(v));
      } catch {
        localVehicles = [];
      }
    }

    // Si Supabase a renvoyé des données, fusionner avec les ajouts locaux
    if (supabaseVehicles.length > 0) {
      // Combiner en évitant les doublons d'ID
      const combined = [...supabaseVehicles];
      for (const lv of localVehicles) {
        if (!combined.some((sv) => String(sv.id) === String(lv.id))) {
          combined.push(lv);
        }
      }
      safeSetLocalStorage(LOCAL_STORAGE_VEHICLES_KEY, combined);
      return combined;
    }

    // Fallback si pas de données Supabase
    if (localVehicles.length > 0) {
      return localVehicles;
    }

    // Initial seed
    const enrichedInitial = initialVehicles.map((v) => enrichVehicleData(v));
    safeSetLocalStorage(LOCAL_STORAGE_VEHICLES_KEY, enrichedInitial);
    return enrichedInitial;
  },

  // Récupérer un véhicule par ID
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
          return enrichVehicleData({
            ...decoded,
            category: mapCategoryFromDb(decoded.category, decoded.model)
          });
        }
      } catch (err) {
        console.warn('Supabase single vehicle fetch failed', err);
      }
    }

    const all = await this.getAllVehicles();
    const found = all.find((v) => String(v.id) === String(id));
    return found ? enrichVehicleData(found) : null;
  },

  // Ajouter un véhicule
  async addVehicle(vehicleData) {
    const cleanPayload = buildCleanSupabasePayload(vehicleData);
    let createdVehicle = null;

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('delivered_vehicles')
          .insert([cleanPayload])
          .select();

        if (!error && data && data.length > 0) {
          const decoded = decodeExtendedData(data[0]);
          createdVehicle = enrichVehicleData({
            ...decoded,
            ...vehicleData,
            id: data[0].id,
            category: mapCategoryFromDb(data[0].category, data[0].model)
          });
        } else if (error) {
          console.error('Supabase add vehicle error:', error);
        }
      } catch (err) {
        console.warn('Supabase add vehicle exception, using local fallback', err);
      }
    }

    // Fallback local si pas d'insertion Supabase
    if (!createdVehicle) {
      createdVehicle = enrichVehicleData({
        id: 'veh-' + Date.now(),
        ...vehicleData
      });
    }

    // Mettre à jour le cache local
    const current = await this.getAllVehicles();
    const updated = [createdVehicle, ...current.filter((v) => v.id !== createdVehicle.id)];
    safeSetLocalStorage(LOCAL_STORAGE_VEHICLES_KEY, updated);

    return createdVehicle;
  },

  // Modifier un véhicule
  async updateVehicle(id, updates) {
    const cleanPayload = buildCleanSupabasePayload(updates);
    delete cleanPayload.created_at;

    let updatedVehicle = null;

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('delivered_vehicles')
          .update(cleanPayload)
          .eq('id', id)
          .select();

        if (!error && data && data.length > 0) {
          const decoded = decodeExtendedData(data[0]);
          updatedVehicle = enrichVehicleData({
            ...decoded,
            ...updates,
            id: data[0].id,
            category: mapCategoryFromDb(data[0].category, data[0].model)
          });
        }
      } catch (err) {
        console.warn('Supabase update vehicle exception', err);
      }
    }

    if (!updatedVehicle) {
      updatedVehicle = enrichVehicleData({ id, ...updates });
    }

    const current = await this.getAllVehicles();
    const updated = current.map((item) => (String(item.id) === String(id) ? { ...item, ...updatedVehicle } : item));
    safeSetLocalStorage(LOCAL_STORAGE_VEHICLES_KEY, updated);

    return updatedVehicle;
  },

  // Supprimer un véhicule
  async deleteVehicle(id) {
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('delivered_vehicles').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete vehicle exception', err);
      }
    }

    const current = await this.getAllVehicles();
    const updated = current.filter((item) => String(item.id) !== String(id));
    safeSetLocalStorage(LOCAL_STORAGE_VEHICLES_KEY, updated);

    return true;
  }
};
