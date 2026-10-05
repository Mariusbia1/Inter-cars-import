import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Trash2, 
  Star, 
  Image as ImageIcon, 
  Plus, 
  Link as LinkIcon, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { processMultipleImageFiles } from '../../utils/imageOptimizer';

export const VehicleImageUploader = ({ images = [], onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const fileInputRef = useRef(null);

  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const validFiles = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
      if (validFiles.length === 0) {
        setErrorMsg('Veuillez sélectionner des fichiers images valides (JPG, PNG, WebP).');
        setIsProcessing(false);
        return;
      }

      const newOptimizedImages = await processMultipleImageFiles(validFiles);
      const combined = [...images, ...newOptimizedImages];
      onChange(combined);
    } catch (err) {
      console.error('Error optimizing images:', err);
      setErrorMsg("Une erreur est survenue lors de l'import des images.");
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleSetPrimary = (index) => {
    if (index === 0) return;
    const newImages = [...images];
    const [selected] = newImages.splice(index, 1);
    newImages.unshift(selected);
    onChange(newImages);
  };

  const handleDelete = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleAddUrl = () => {
    if (!urlInputValue.trim()) return;
    const urls = urlInputValue
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.startsWith('http'));

    if (urls.length > 0) {
      onChange([...images, ...urls]);
      setUrlInputValue('');
      setShowUrlInput(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Zone de Glisser-Déposer / Upload */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-gold bg-rolex/5 shadow-inner scale-[0.99]'
            : 'border-slate-300 hover:border-rolex bg-slate-50/70 hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-rolex">
            {isProcessing ? (
              <div className="w-6 h-6 border-3 border-rolex border-t-gold rounded-full animate-spin" />
            ) : (
              <Upload className="w-7 h-7 text-rolex" />
            )}
          </div>

          <div>
            <p className="text-sm font-bold text-slate-800">
              {isProcessing
                ? 'Optimisation et chargement des photos...'
                : 'Glissez-déposez vos photos ici ou cliquez pour parcourir'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Vous pouvez sélectionner <span className="font-semibold text-rolex">plusieurs photos simultanément</span> (JPG, PNG, WebP).
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-slate-700">
              📁 {images.length} photo{images.length > 1 ? 's' : ''} sélectionnée{images.length > 1 ? 's' : ''}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowUrlInput(!showUrlInput);
              }}
              className="px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-rolex text-[11px] font-bold text-slate-700 flex items-center gap-1 transition-colors"
            >
              <LinkIcon className="w-3 h-3 text-rolex" /> Ajouter par lien URL
            </button>
          </div>
        </div>
      </div>

      {/* Erreur éventuelle */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Input URL Manuel (si toggle activé) */}
      {showUrlInput && (
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
          <label className="block text-xs font-bold uppercase text-slate-700">
            Coller des URLs d'images (1 par ligne)
          </label>
          <textarea
            rows={3}
            value={urlInputValue}
            onChange={(e) => setUrlInputValue(e.target.value)}
            placeholder="https://images.unsplash.com/...&#10;https://..."
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono outline-none focus:border-rolex"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowUrlInput(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Fermer
            </button>
            <button
              type="button"
              onClick={handleAddUrl}
              className="px-4 py-1.5 rounded-lg bg-rolex text-gold text-xs font-bold uppercase tracking-wider hover:bg-rolex-dark"
            >
              Ajouter les liens
            </button>
          </div>
        </div>
      )}

      {/* Galerie de Prévisualisation des Photos Importées */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-rolex" /> Galerie ({images.length} photo{images.length > 1 ? 's' : ''})
            </h5>
            <span className="text-[11px] text-slate-400 italic">
              La première photo correspond à l'image principale de couverture.
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.map((imgUrl, index) => {
              const isCover = index === 0;
              return (
                <div
                  key={index}
                  className={`relative rounded-xl overflow-hidden border-2 group bg-slate-900 aspect-4/3 flex items-center justify-center transition-all ${
                    isCover
                      ? 'border-gold shadow-md ring-2 ring-gold/30'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=400&q=80';
                    }}
                  />

                  {/* Badge Couverture */}
                  {isCover && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-rolex text-gold text-[10px] font-bold uppercase flex items-center gap-1 shadow-md border border-gold/40">
                      <Star className="w-3 h-3 fill-gold" /> Principale
                    </div>
                  )}

                  {/* Numéro photo */}
                  <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono font-bold">
                    #{index + 1}
                  </div>

                  {/* Overlay d'actions au survol */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2 text-center">
                    {!isCover && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(index)}
                        className="px-2 py-1 rounded-md bg-gold hover:bg-gold-light text-rolex-dark text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1"
                        title="Définir comme photo principale"
                      >
                        <Star className="w-3 h-3" /> Couverture
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      className="p-1.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs shadow-sm flex items-center gap-1"
                      title="Supprimer cette photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Supprimer
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Bouton rapide d'ajout au sein de la grille */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border-2 border-dashed border-slate-300 hover:border-rolex bg-slate-50 hover:bg-slate-100 flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-rolex aspect-4/3 transition-colors p-2 text-center"
            >
              <Plus className="w-5 h-5" />
              <span className="text-[11px] font-bold">Ajouter d'autres</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
