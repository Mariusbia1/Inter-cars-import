import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Convertit un Data URL en Blob
export const dataUrlToBlob = (dataUrl) => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

// Téléverse une image vers Supabase Storage si possible
export const uploadImageToSupabase = async (dataUrl, vehicleId, index) => {
  if (!dataUrl || !dataUrl.startsWith('data:')) {
    return dataUrl; // Déjà une URL distante (https://...)
  }

  if (!isSupabaseConfigured()) {
    return dataUrl;
  }

  try {
    const blob = dataUrlToBlob(dataUrl);
    const fileExt = blob.type === 'image/png' ? 'png' : 'jpg';
    const fileName = `${vehicleId || 'veh'}_${Date.now()}_${index}.${fileExt}`;
    const filePath = `catalog/${fileName}`;

    const { data, error } = await supabase.storage
      .from('vehicles')
      .upload(filePath, blob, {
        contentType: blob.type,
        upsert: true
      });

    if (!error && data) {
      const { data: publicData } = supabase.storage
        .from('vehicles')
        .getPublicUrl(filePath);

      if (publicData && publicData.publicUrl) {
        return publicData.publicUrl;
      }
    }
  } catch (err) {
    console.warn('Supabase storage upload fallback to local indexedDB:', err);
  }

  return dataUrl;
};

// Téléverse une liste complète de photos (par exemple 26 images)
export const uploadMultipleImages = async (imagesArray, vehicleId) => {
  if (!imagesArray || imagesArray.length === 0) return [];
  const promises = imagesArray.map((img, idx) => uploadImageToSupabase(img, vehicleId, idx));
  return Promise.all(promises);
};
