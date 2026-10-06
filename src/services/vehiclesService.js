import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initialVehicles, enrichVehicleData } from '../data/vehiclesData';
import { idbSaveVehicle, idbGetAllVehicles, idbGetVehicleById, idbDeleteVehicle } from '../utils/indexedDbStorage';
import { uploadMultipleImages } from './imageUploadService';
import { createThumbnailDataUrl } from '../utils/imageOptimizer';

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

// Sauvegarde localStorage légère (sans données base64 lourdes pour éviter quota 5MB)
const safeSetLocalStorageMetadata = (key, data) => {
  try {
    const lightweight = data.map((item) => ({
      ...item,
      gallery: (item.gallery || []).filter((img) => typeof img === 'string' && img.startsWith('http')),
      image_url: typeof item.image_url === 'string' && item.image_url.startsWith('data:') ? '' : item.image_url
    }));
    localStorage.setItem(key, JSON.stringify(lightweight));
  } catch (err) {
    console.warn('LocalStorage save skipped (using IndexedDB instead)', err);
  }
};

export const vehiclesService = {
  // Récupérer tous les véhicules
  async getAllVehicles() {
    let vehiclesMap = new Map();

    // 1. Initialiser avec les 8 modèles de démonstration
    initialVehicles.forEach((v) => {
      vehiclesMap.set(String(v.id), enrichVehicleData(v));
    });

    // 2. Récupérer depuis IndexedDB (contient toutes les photos HD et véhicules créés localement)
    try {
      const idbList = await idbGetAllVehicles();
      if (idbList && idbList.length > 0) {
        idbList.forEach((v) => {
          vehiclesMap.set(String(v.id), enrichVehicleData(v));
        });
      }
    } catch (err) {
      console.warn('IndexedDB fetch error:', err);
    }

    // 3. Récupérer depuis Supabase si connecté
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('delivered_vehicles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          data.forEach((v) => {
            const decoded = decodeExtendedData(v);
            const idKey = String(v.id);
            const supabaseGallery = Array.isArray(decoded.gallery) ? decoded.gallery : [];
            const localGallery = Array.isArray(existingLocal?.gallery) ? existingLocal.gallery : [];
            const mergedGallery = supabaseGallery.length > 0 ? supabaseGallery : localGallery;

            const merged = enrichVehicleData({
              ...decoded,
              gallery: mergedGallery,
              image_url: mergedGallery[0] || decoded.image_url || existingLocal?.image_url || '',
              category: mapCategoryFromDb(decoded.category, decoded.model)
            });

            vehiclesMap.set(idKey, merged);
          });
        }
      } catch (err) {
        console.warn('Supabase fetch failed:', err);
      }
    }

    const result = Array.from(vehiclesMap.values());
    safeSetLocalStorageMetadata(LOCAL_STORAGE_VEHICLES_KEY, result);
    return result;
  },

  // Récupérer un véhicule par ID
  async getVehicleById(id) {
    if (!id) return null;

    // 1. Chercher dans IndexedDB
    try {
      const fromIdb = await idbGetVehicleById(id);
      if (fromIdb) {
        return enrichVehicleData(fromIdb);
      }
    } catch (err) {
      console.warn('IndexedDB getById error:', err);
    }

    // 2. Chercher dans Supabase
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
        console.warn('Supabase getById error:', err);
      }
    }

    // 3. Chercher dans la liste globale
    const all = await this.getAllVehicles();
    const found = all.find((v) => String(v.id) === String(id));
    return found ? enrichVehicleData(found) : null;
  },

  // Ajouter un véhicule (supporte 26+ images sans crash)
  async addVehicle(vehicleData) {
    const generatedId = vehicleData.id || ('veh-' + Date.now() + '-' + Math.floor(Math.random() * 1000));
    
    // Traitement des images
    const rawGallery = Array.isArray(vehicleData.gallery) ? vehicleData.gallery : [];
    
    // Tenter de téléverser vers Supabase Storage si possible
    let finalGallery = rawGallery;
    try {
      if (isSupabaseConfigured() && rawGallery.length > 0) {
        finalGallery = await uploadMultipleImages(rawGallery, generatedId);
      }
    } catch (e) {
      console.warn('Image storage upload skipped:', e);
    }

    const mainImageUrl = finalGallery.length > 0 ? finalGallery[0] : (vehicleData.image_url || '');

    const completeVehicle = enrichVehicleData({
      ...vehicleData,
      id: generatedId,
      image_url: mainImageUrl,
      gallery: finalGallery,
      created_at: new Date().toISOString()
    });

    // 1. Sauvegarder dans IndexedDB (capacité illimitée pour les 26+ images)
    try {
      await idbSaveVehicle(completeVehicle);
    } catch (err) {
      console.warn('IndexedDB save error:', err);
    }

    // 2. Sauvegarder dans la base de données Supabase
    if (isSupabaseConfigured()) {
      try {
        const cleanDbPayload = {
          title: completeVehicle.title || 'Véhicule',
          brand: completeVehicle.brand || 'Volkswagen',
          model: completeVehicle.model || completeVehicle.title || '',
          category: mapCategoryToDb(completeVehicle.category),
          year: parseInt(completeVehicle.year, 10) || new Date().getFullYear(),
          mileage: parseInt(completeVehicle.mileage, 10) || 0,
          power_hp: parseInt(completeVehicle.power_hp, 10) || 0,
          engine: completeVehicle.engine || '2.0L',
          transmission: completeVehicle.transmission || 'Automatique',
          origin_country: completeVehicle.origin_country || 'Réseau Partenaire France',
          delivery_city: completeVehicle.delivery_city || 'France entière',
          certification: completeVehicle.certification || 'Audit 150 Points Validé',
          warranty: completeVehicle.warranty || 'Garantie Constructeur',
          image_url: mainImageUrl || 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
          gallery: finalGallery,
          client_name: completeVehicle.client_name || '',
          client_city: completeVehicle.client_city || '',
          client_review: encodeExtendedData(completeVehicle),
          rating: 5,
          is_featured: Boolean(completeVehicle.is_featured)
        };

        const { data, error } = await supabase
          .from('delivered_vehicles')
          .insert([cleanDbPayload])
          .select();

        if (!error && data && data.length > 0) {
          const supabaseId = data[0].id;
          completeVehicle.id = supabaseId;
          // Synchroniser IndexedDB avec le vrai UUID Supabase
          await idbSaveVehicle(completeVehicle);
        } else if (error) {
          console.error('Supabase insert error:', error);
          throw error;
        }
      } catch (err) {
        console.error('Supabase add vehicle exception:', err);
        throw err;
      }
    }

    return completeVehicle;
  },

  // Modifier un véhicule
  async updateVehicle(id, updates) {
    let existing = await this.getVehicleById(id);
    let finalGallery = updates.gallery || existing?.gallery || [];

    // Tenter l'upload si de nouvelles photos ont été ajoutées
    if (isSupabaseConfigured() && Array.isArray(updates.gallery)) {
      try {
        finalGallery = await uploadMultipleImages(updates.gallery, id);
      } catch (e) {
        console.warn('Image storage update skipped:', e);
      }
    }

    const mainImageUrl = finalGallery.length > 0 ? finalGallery[0] : (updates.image_url || existing?.image_url || '');

    const updatedVehicle = enrichVehicleData({
      ...existing,
      ...updates,
      id,
      image_url: mainImageUrl,
      gallery: finalGallery
    });

    // 1. Sauvegarder dans IndexedDB
    try {
      await idbSaveVehicle(updatedVehicle);
    } catch (err) {
      console.warn('IndexedDB update error:', err);
    }

    // 2. Mettre à jour Supabase si connecté
    if (isSupabaseConfigured()) {
      try {
        const cleanDbUpdates = {
          title: updatedVehicle.title,
          brand: updatedVehicle.brand,
          model: updatedVehicle.model,
          category: mapCategoryToDb(updatedVehicle.category),
          year: parseInt(updatedVehicle.year, 10) || new Date().getFullYear(),
          mileage: parseInt(updatedVehicle.mileage, 10) || 0,
          power_hp: parseInt(updatedVehicle.power_hp, 10) || 0,
          engine: updatedVehicle.engine,
          transmission: updatedVehicle.transmission,
          origin_country: updatedVehicle.origin_country,
          delivery_city: updatedVehicle.delivery_city,
          certification: updatedVehicle.certification,
          warranty: updatedVehicle.warranty,
          image_url: mainImageUrl || '',
          gallery: finalGallery,
          client_name: updatedVehicle.client_name || '',
          client_city: updatedVehicle.client_city || '',
          client_review: encodeExtendedData(updatedVehicle),
          rating: 5,
          is_featured: Boolean(updatedVehicle.is_featured)
        };

        const { error } = await supabase
          .from('delivered_vehicles')
          .update(cleanDbUpdates)
          .eq('id', id);

        if (error) {
          console.error('Supabase update error:', error);
          throw error;
        }
      } catch (err) {
        console.error('Supabase update exception:', err);
        throw err;
      }
    }

    return updatedVehicle;
  },

  // Supprimer un véhicule
  async deleteVehicle(id) {
    try {
      await idbDeleteVehicle(id);
    } catch (err) {
      console.warn('IndexedDB delete error:', err);
    }

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('delivered_vehicles').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete exception:', err);
      }
    }

    return true;
  }
};
