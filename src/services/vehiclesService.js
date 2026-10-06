import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initialVehicles, enrichVehicleData } from '../data/vehiclesData';
import { idbSaveVehicle, idbGetAllVehicles, idbGetVehicleById, idbDeleteVehicle } from '../utils/indexedDbStorage';
import { uploadMultipleImages } from './imageUploadService';

const LOCAL_STORAGE_VEHICLES_KEY = 'intercars_vehicles_live_v1';
const LOCAL_STORAGE_DELETED_KEY = 'intercars_deleted_vehicles_v1';

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

// Gestion de la liste noire des véhicules définitivement supprimés
export const getDeletedVehicleIds = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DELETED_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
};

export const markVehicleAsDeleted = (id, vehicle = null) => {
  try {
    const deletedSet = getDeletedVehicleIds();
    if (id) deletedSet.add(String(id));
    if (vehicle?.id) deletedSet.add(String(vehicle.id));
    if (vehicle?.title) {
      deletedSet.add(`title:${vehicle.title.trim().toLowerCase()}`);
    }
    localStorage.setItem(LOCAL_STORAGE_DELETED_KEY, JSON.stringify(Array.from(deletedSet)));
  } catch (e) {
    console.warn('Failed to save deleted vehicle tombstone', e);
  }
};

export const unmarkVehicleAsDeleted = (id, title = null) => {
  try {
    const deletedSet = getDeletedVehicleIds();
    if (id) deletedSet.delete(String(id));
    if (title) deletedSet.delete(`title:${title.trim().toLowerCase()}`);
    localStorage.setItem(LOCAL_STORAGE_DELETED_KEY, JSON.stringify(Array.from(deletedSet)));
  } catch (e) {
    console.warn('Failed to unmark deleted vehicle', e);
  }
};

export const isVehicleDeleted = (vehicleOrId) => {
  if (!vehicleOrId) return false;
  const deletedSet = getDeletedVehicleIds();
  if (typeof vehicleOrId === 'string' || typeof vehicleOrId === 'number') {
    return deletedSet.has(String(vehicleOrId));
  }
  const idStr = String(vehicleOrId.id);
  if (deletedSet.has(idStr)) return true;
  if (vehicleOrId.title && deletedSet.has(`title:${vehicleOrId.title.trim().toLowerCase()}`)) {
    return true;
  }
  return false;
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

// Sauvegarde localStorage légère
const safeSetLocalStorageMetadata = (key, data) => {
  try {
    const lightweight = data
      .filter((item) => !isVehicleDeleted(item))
      .map((item) => ({
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
  // Récupération initiale synchrone pour l'état React immédiat
  getInitialSyncVehicles() {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_VEHICLES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((v) => !isVehicleDeleted(v)).map(enrichVehicleData);
        }
      }
    } catch (e) {
      // Ignore
    }
    return initialVehicles.filter((v) => !isVehicleDeleted(v)).map(enrichVehicleData);
  },

  // Récupérer tous les véhicules (Supabase prioritaire, exclusion stricte des supprimés)
  async getAllVehicles() {
    let vehiclesMap = new Map();
    let supabaseSuccess = false;

    // 1. Récupérer depuis Supabase (source de vérité officielle)
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('delivered_vehicles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          supabaseSuccess = true;
          data.forEach((v) => {
            if (isVehicleDeleted(v)) return; // Strictement ignoré si supprimé

            const decoded = decodeExtendedData(v);
            const idKey = String(v.id);
            const supabaseGallery = Array.isArray(decoded.gallery) ? decoded.gallery : [];

            const vehicleObj = enrichVehicleData({
              ...decoded,
              gallery: supabaseGallery,
              image_url: supabaseGallery[0] || decoded.image_url || '',
              category: mapCategoryFromDb(decoded.category, decoded.model)
            });

            vehiclesMap.set(idKey, vehicleObj);
          });
        }
      } catch (err) {
        console.warn('Supabase fetch failed:', err);
      }
    }

    // 2. Récupérer depuis IndexedDB (sauvegarde locale des créations récentes)
    try {
      const idbList = await idbGetAllVehicles();
      if (idbList && idbList.length > 0) {
        idbList.forEach((v) => {
          if (isVehicleDeleted(v)) {
            idbDeleteVehicle(v.id); // Nettoyage de l'entrée orpheline
            return;
          }
          const idKey = String(v.id);
          if (!vehiclesMap.has(idKey)) {
            vehiclesMap.set(idKey, enrichVehicleData(v));
          } else {
            // Si la version locale contient des photos HD que Supabase n'avait pas encore
            const existing = vehiclesMap.get(idKey);
            if ((!existing.gallery || existing.gallery.length === 0) && v.gallery && v.gallery.length > 0) {
              vehiclesMap.set(idKey, enrichVehicleData({ ...existing, gallery: v.gallery, image_url: v.gallery[0] }));
            }
          }
        });
      }
    } catch (err) {
      console.warn('IndexedDB fetch error:', err);
    }

    // 3. Modèles de démonstration UNIQUEMENT si Supabase est hors-ligne ET le catalogue est vide
    if (!supabaseSuccess && vehiclesMap.size === 0) {
      initialVehicles.forEach((v) => {
        if (!isVehicleDeleted(v)) {
          vehiclesMap.set(String(v.id), enrichVehicleData(v));
        }
      });
    }

    // Filtrage final absolu anti-résurrection
    const result = Array.from(vehiclesMap.values()).filter((v) => !isVehicleDeleted(v));
    safeSetLocalStorageMetadata(LOCAL_STORAGE_VEHICLES_KEY, result);
    return result;
  },

  // Récupérer un véhicule par ID
  async getVehicleById(id) {
    if (!id || isVehicleDeleted(id)) return null;

    // 1. Chercher dans Supabase
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('delivered_vehicles')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (!error && data && !isVehicleDeleted(data)) {
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

    // 2. Chercher dans IndexedDB
    try {
      const fromIdb = await idbGetVehicleById(id);
      if (fromIdb && !isVehicleDeleted(fromIdb)) {
        return enrichVehicleData(fromIdb);
      }
    } catch (err) {
      console.warn('IndexedDB getById error:', err);
    }

    // 3. Chercher dans la liste globale active
    const all = await this.getAllVehicles();
    const found = all.find((v) => String(v.id) === String(id) && !isVehicleDeleted(v));
    return found ? enrichVehicleData(found) : null;
  },

  // Ajouter un véhicule
  async addVehicle(vehicleData) {
    const generatedId = vehicleData.id || ('veh-' + Date.now() + '-' + Math.floor(Math.random() * 1000));
    
    // Débloquer l'ID s'il était précédemment dans la liste noire
    unmarkVehicleAsDeleted(generatedId, vehicleData.title);

    const rawGallery = Array.isArray(vehicleData.gallery) ? vehicleData.gallery : [];
    
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

    // 1. Sauvegarder dans IndexedDB
    try {
      await idbSaveVehicle(completeVehicle);
    } catch (err) {
      console.warn('IndexedDB save error:', err);
    }

    // 2. Sauvegarder dans Supabase
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
    if (!id || isVehicleDeleted(id)) {
      throw new Error('Impossible de mettre à jour un véhicule supprimé');
    }

    let existing = await this.getVehicleById(id);
    let finalGallery = updates.gallery || existing?.gallery || [];

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

  // Supprimer définitivement un véhicule (garantit qu'il ne réapparaît jamais)
  async deleteVehicle(id) {
    if (!id) return true;

    // 1. Trouver les détails pour marquer son empreinte
    let vehicleToDelete = null;
    try {
      vehicleToDelete = await idbGetVehicleById(id);
      if (!vehicleToDelete && isSupabaseConfigured()) {
        const { data } = await supabase.from('delivered_vehicles').select('*').eq('id', id).maybeSingle();
        if (data) vehicleToDelete = decodeExtendedData(data);
      }
    } catch {
      // Continuer la suppression
    }

    // 2. Marquer définitivement comme supprimé dans le registre de blocage
    markVehicleAsDeleted(id, vehicleToDelete);

    // 3. Supprimer de IndexedDB
    try {
      await idbDeleteVehicle(id);
    } catch (err) {
      console.warn('IndexedDB delete error:', err);
    }

    // 4. Supprimer de Supabase
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('delivered_vehicles').delete().eq('id', id);

        // Si c'était un véhicule de démo initial, supprimer également par titre si présent
        if (vehicleToDelete?.title) {
          await supabase.from('delivered_vehicles').delete().eq('title', vehicleToDelete.title);
        }
      } catch (err) {
        console.warn('Supabase delete exception:', err);
      }
    }

    // 5. Nettoyer le cache local
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_VEHICLES_KEY);
      if (raw) {
        const list = JSON.parse(raw);
        const filtered = list.filter((v) => String(v.id) !== String(id) && !isVehicleDeleted(v));
        localStorage.setItem(LOCAL_STORAGE_VEHICLES_KEY, JSON.stringify(filtered));
      }
    } catch (e) {
      console.warn('LocalStorage cache update failed', e);
    }

    return true;
  }
};
