// Utilitaire de compression et d'optimisation d'images côté client

export const readFileAsOptimizedDataUrl = (file, maxWidth = 1600, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Le fichier sélectionné n\'est pas une image valide.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => resolve(e.target.result); // Fallback to raw reader result if canvas fails
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Redimensionnement proportionnel si l'image dépasse la largeur maximale
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          // Dessin avec lissage haute qualité
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Export en WebP (ou JPEG si non supporté) avec compression optimisée
          const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const compressedDataUrl = canvas.toDataURL(mimeType, quality);
          resolve(compressedDataUrl);
        } catch {
          resolve(e.target.result);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export const processMultipleImageFiles = async (files) => {
  const fileArray = Array.from(files);
  const promises = fileArray.map((file) => readFileAsOptimizedDataUrl(file));
  return Promise.all(promises);
};
