import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Car, Image, Award, ShieldCheck } from 'lucide-react';

export const VehicleFormModal = ({ vehicle, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    brand: 'Porsche',
    model: '',
    category: 'Supercar',
    year: 2024,
    mileage: 10000,
    power_hp: 500,
    engine: 'V8 Bi-Turbo',
    origin_country: 'Allemagne (Stuttgart)',
    delivery_city: 'Cannes (06)',
    certification: 'Audit 150 Points Certifié',
    warranty: 'Garantie Européenne 24 Mois',
    image_url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
    client_name: 'Client Privé',
    client_city: 'Cannes',
    client_review: 'Audit 150 points irréprochable et livraison express à domicile.',
    is_featured: false,
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        title: vehicle.title || '',
        brand: vehicle.brand || 'Porsche',
        model: vehicle.model || '',
        category: vehicle.category || 'Supercar',
        year: vehicle.year || 2024,
        mileage: vehicle.mileage || 10000,
        power_hp: vehicle.power_hp || 500,
        engine: vehicle.engine || 'V8 Bi-Turbo',
        origin_country: vehicle.origin_country || 'Allemagne',
        delivery_city: vehicle.delivery_city || 'Paris',
        certification: vehicle.certification || 'Audit 150 Points Certifié',
        warranty: vehicle.warranty || 'Garantie Européenne 24 Mois',
        image_url: vehicle.image_url || '',
        client_name: vehicle.client_name || '',
        client_city: vehicle.client_city || '',
        client_review: vehicle.client_review || '',
        is_featured: vehicle.is_featured || false,
      });
    } else {
      setFormData({
        title: '',
        brand: 'Porsche',
        model: '',
        category: 'Supercar',
        year: 2024,
        mileage: 10000,
        power_hp: 500,
        engine: 'V8 Bi-Turbo',
        origin_country: 'Allemagne (Stuttgart)',
        delivery_city: 'Cannes (06)',
        certification: 'Audit 150 Points Certifié',
        warranty: 'Garantie Européenne 24 Mois',
        image_url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
        client_name: 'Client Privé',
        client_city: 'Cannes',
        client_review: 'Audit 150 points irréprochable et livraison express à domicile.',
        is_featured: false,
      });
    }
  }, [vehicle, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-slate-200 my-8 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 bg-rolex-dark text-white border-b border-gold/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rolex border border-gold flex items-center justify-center text-gold">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-white">
                  {vehicle ? 'Modifier le Véhicule Livré' : 'Ajouter un Véhicule Livré'}
                </h3>
                <p className="text-xs text-slate-300">Vitrine des réalisations Inter Cars Import</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Titre Complet du Véhicule *
              </label>
              <input
                type="text"
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="ex: Porsche 911 (992) GT3 RS Weissach"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-surface outline-none focus:border-rolex"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Marque *</label>
                <input
                  type="text"
                  required
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface outline-none focus:border-rolex"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Catégorie *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface outline-none focus:border-rolex"
                >
                  <option value="Supercar">Supercar</option>
                  <option value="Sportive">Sportive</option>
                  <option value="SUV Prestige">SUV Prestige</option>
                  <option value="Berline GT">Berline GT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Année *</label>
                <input
                  type="number"
                  required
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface outline-none focus:border-rolex"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Kilométrage (km) *</label>
                <input
                  type="number"
                  required
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface outline-none focus:border-rolex"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Puissance (ch) *</label>
                <input
                  type="number"
                  required
                  name="power_hp"
                  value={formData.power_hp}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface outline-none focus:border-rolex"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Motorisation *</label>
                <input
                  type="text"
                  required
                  name="engine"
                  value={formData.engine}
                  onChange={handleChange}
                  placeholder="ex: 4.0L Flat-6"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface outline-none focus:border-rolex"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Certification & Contrôle *</label>
                <input
                  type="text"
                  required
                  name="certification"
                  value={formData.certification}
                  onChange={handleChange}
                  placeholder="ex: Porsche Approved 111 Pts"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface outline-none focus:border-rolex"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Garantie Incluse *</label>
                <input
                  type="text"
                  required
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleChange}
                  placeholder="ex: Garantie Constructeur 24 Mois"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface outline-none focus:border-rolex"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Pays de Provenance *</label>
                <input
                  type="text"
                  required
                  name="origin_country"
                  value={formData.origin_country}
                  onChange={handleChange}
                  placeholder="ex: Allemagne (Stuttgart)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface outline-none focus:border-rolex"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Ville de Livraison *</label>
                <input
                  type="text"
                  required
                  name="delivery_city"
                  value={formData.delivery_city}
                  onChange={handleChange}
                  placeholder="ex: Cannes (06)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface outline-none focus:border-rolex"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">URL de l'Image HD (Unsplash / CDN) *</label>
              <input
                type="url"
                required
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-surface outline-none focus:border-rolex"
              />
            </div>

            {/* Avis Client */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold uppercase text-slate-700">Témoignage de l'Acquéreur</label>
              <textarea
                rows={2}
                name="client_review"
                value={formData.client_review}
                onChange={handleChange}
                placeholder="Commentaire sur la qualité de l'audit 150 points ou la livraison..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white outline-none focus:border-rolex resize-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold uppercase hover:bg-slate-100 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-rolex hover:bg-rolex-600 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Enregistrer le véhicule
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
