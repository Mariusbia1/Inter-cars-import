import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Save, 
  Car, 
  Image as ImageIcon, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  FileText, 
  Settings, 
  Wrench, 
  Palette, 
  RotateCcw,
  Tag,
  AlertCircle
} from 'lucide-react';
import { parseVehicleText } from '../../utils/vehicleParser';

export const VehicleFormModal = ({ vehicle, isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'technical' | 'equipments' | 'media' | 'guarantee'
  const [rawText, setRawText] = useState('');
  const [parseFeedback, setParseFeedback] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    brand: 'Volkswagen',
    model: '',
    category: 'SUV & 4x4',
    price: 34900,
    discount_percent: 12,
    availability_status: 'ARRIVAGE',
    is_featured: false,

    // Specs
    year: 2024,
    first_reg_date: '04/06/2024',
    mileage: 45000,
    power_hp: 150,
    fiscal_power: 8,
    engine: '2.0 TDI 150 ch',
    fuel_type: 'Diesel',
    transmission: 'Automatique DSG',
    drivetrain: 'Traction avant',
    doors: '5 portes',
    seats: 5,

    // Colors
    color_ext: 'Gris',
    color_int: 'Noir',

    // Media
    image_url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
    gallery_urls: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80\nhttps://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80\nhttps://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',

    // Equipments
    raw_equipments_text: '',

    // Trust
    certification: 'Audit 150 Points Validé',
    warranty: 'Garantie Constructeur 12 à 24 Mois',
    origin_country: 'Réseau Partenaire France',
    delivery_city: 'France entière',
    client_name: '',
    client_city: '',
    client_review: ''
  });

  useEffect(() => {
    if (vehicle) {
      const flatEquipments = Array.isArray(vehicle.equipments)
        ? vehicle.equipments.flatMap((g) => (g.items ? g.items : [g]))
        : [];

      const galleryList = Array.isArray(vehicle.gallery) && vehicle.gallery.length > 0
        ? vehicle.gallery.join('\n')
        : (vehicle.image_url || '');

      setFormData({
        title: vehicle.title || '',
        brand: vehicle.brand || 'Volkswagen',
        model: vehicle.model || '',
        category: vehicle.category || 'SUV & 4x4',
        price: vehicle.price || '',
        discount_percent: vehicle.discount_percent ?? 12,
        availability_status: vehicle.availability_status || 'ARRIVAGE',
        is_featured: vehicle.is_featured || false,

        year: vehicle.year || 2024,
        first_reg_date: vehicle.specs?.first_reg_date || vehicle.first_reg_date || `${vehicle.year || 2024}`,
        mileage: vehicle.mileage || 20000,
        power_hp: vehicle.power_hp || 150,
        fiscal_power: vehicle.fiscal_power || vehicle.specs?.fiscal_power || 8,
        engine: vehicle.engine || vehicle.specs?.engine_cylinders || '2.0L',
        fuel_type: vehicle.fuel_type || 'Diesel',
        transmission: vehicle.transmission || 'Automatique',
        drivetrain: vehicle.specs?.drivetrain || vehicle.drivetrain || 'Traction avant',
        doors: vehicle.specs?.doors || vehicle.doors || '5 portes',
        seats: vehicle.specs?.seats ? parseInt(vehicle.specs.seats, 10) : (vehicle.seats || 5),

        color_ext: vehicle.color_ext || (vehicle.colors && vehicle.colors[0]?.name) || 'Gris',
        color_int: vehicle.specs?.color_int || vehicle.color_int || 'Noir',

        image_url: vehicle.image_url || '',
        gallery_urls: galleryList,

        raw_equipments_text: flatEquipments.map((e) => `- ${e}`).join('\n'),

        certification: vehicle.certification || 'Audit 150 Points Validé',
        warranty: vehicle.warranty || 'Garantie Constructeur 12 à 24 Mois',
        origin_country: vehicle.origin_country || 'Réseau Partenaire France',
        delivery_city: vehicle.delivery_city || 'France entière',
        client_name: vehicle.client_name || '',
        client_city: vehicle.client_city || '',
        client_review: vehicle.client_review || ''
      });
      setParseFeedback(null);
    } else {
      // Réinitialiser pour un nouveau véhicule
      setFormData({
        title: '',
        brand: 'Volkswagen',
        model: '',
        category: 'SUV & 4x4',
        price: '',
        discount_percent: 12,
        availability_status: 'ARRIVAGE',
        is_featured: false,

        year: new Date().getFullYear(),
        first_reg_date: '',
        mileage: 25000,
        power_hp: 150,
        fiscal_power: 8,
        engine: '',
        fuel_type: 'Diesel',
        transmission: 'Automatique',
        drivetrain: 'Traction avant',
        doors: '5 portes',
        seats: 5,

        color_ext: 'Gris',
        color_int: 'Noir',

        image_url: '',
        gallery_urls: '',

        raw_equipments_text: '',

        certification: 'Audit 150 Points Validé',
        warranty: 'Garantie Constructeur 12 à 24 Mois',
        origin_country: 'Réseau Partenaire France',
        delivery_city: 'France entière',
        client_name: '',
        client_city: '',
        client_review: ''
      });
      setParseFeedback(null);
      setRawText('');
    }
  }, [vehicle, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Traitement intelligent du texte brut
  const handleAutoParse = () => {
    if (!rawText.trim()) {
      setParseFeedback({
        type: 'error',
        message: 'Veuillez coller le texte de la fiche caractéristique ci-dessus.'
      });
      return;
    }

    const parsed = parseVehicleText(rawText);

    setFormData((prev) => ({
      ...prev,
      title: parsed.title || prev.title,
      brand: parsed.brand || prev.brand,
      model: parsed.model || prev.model,
      category: parsed.category || prev.category,
      year: parsed.year || prev.year,
      first_reg_date: parsed.first_reg_date || prev.first_reg_date,
      mileage: parsed.mileage || prev.mileage,
      power_hp: parsed.power_hp || prev.power_hp,
      fiscal_power: parsed.fiscal_power || prev.fiscal_power,
      engine: parsed.engine || prev.engine,
      fuel_type: parsed.fuel_type || prev.fuel_type,
      transmission: parsed.transmission || prev.transmission,
      drivetrain: parsed.drivetrain || prev.drivetrain,
      color_ext: parsed.color_ext || prev.color_ext,
      color_int: parsed.color_int || prev.color_int,
      seats: parsed.seats || prev.seats,
      doors: parsed.doors || prev.doors,
      price: parsed.price ? parsed.price : prev.price,
      availability_status: parsed.availability_status || prev.availability_status,
      raw_equipments_text: parsed.raw_equipments_text || prev.raw_equipments_text,
      image_url: parsed.image_url || prev.image_url,
      gallery_urls: parsed.gallery_urls || prev.gallery_urls,
    }));

    const optionsCount = parsed.equipments ? parsed.equipments.length : 0;
    setParseFeedback({
      type: 'success',
      message: `Fiche analysée avec succès ! ${optionsCount} options et équipements détectés et répartis dans les champs correspondants.`
    });
  };

  const handleClearRawText = () => {
    setRawText('');
    setParseFeedback(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Extraire les options sous forme de tableau
    const equipmentsList = formData.raw_equipments_text
      .split('\n')
      .map((l) => l.replace(/^[-•*✓\s]+/, '').trim())
      .filter((l) => l.length > 2);

    // Extraire les URLs de galerie
    const galleryArray = formData.gallery_urls
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.startsWith('http'));

    const finalGallery = galleryArray.length > 0 
      ? galleryArray 
      : [formData.image_url].filter(Boolean);

    const priceNum = formData.price ? parseInt(formData.price, 10) : null;
    const discountNum = formData.discount_percent ? parseInt(formData.discount_percent, 10) : 12;

    const payload = {
      ...formData,
      price: priceNum,
      discount_percent: discountNum,
      year: parseInt(formData.year, 10) || new Date().getFullYear(),
      mileage: parseInt(formData.mileage, 10) || 0,
      power_hp: parseInt(formData.power_hp, 10) || 0,
      fiscal_power: parseInt(formData.fiscal_power, 10) || 0,
      gallery: finalGallery,
      equipments: equipmentsList,
      colors: [
        { name: formData.color_ext || 'Teinte Spécifique', hex: '#7D848C', status: formData.availability_status || 'ARRIVAGE', isDefault: true },
        { name: 'Noir Intense Nacré', hex: '#1C1D21', status: 'EN STOCK' },
        { name: 'Blanc Pur / Nacré', hex: '#F4F5F7', status: 'DISPONIBLE' }
      ],
      specs: {
        co2: 'Crit’Air 1 / 2',
        doors: formData.doors || '5 portes',
        seats: `${formData.seats || 5} places`,
        boot_volume: '450 L à 1 450 L',
        consumption: '5.6 L / 100km',
        drivetrain: formData.drivetrain || 'Traction avant',
        first_reg_date: formData.first_reg_date || `${formData.year}`,
        chassis_number: 'VF3******' + Math.floor(1000 + Math.random() * 9000),
        owners_count: 'Entretien Constructeur à Jour',
        color_int: formData.color_int || 'Noir',
        fiscal_power: parseInt(formData.fiscal_power, 10) || 8,
        engine_cylinders: formData.engine || '2.0L Turbo'
      }
    };

    onSave(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-slate-200 my-4 max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 bg-rolex-dark text-white border-b border-gold/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rolex border border-gold/40 flex items-center justify-center text-gold shadow-sm">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                  {vehicle ? 'Modifier la Fiche Véhicule' : 'Ajouter un Véhicule au Catalogue'}
                </h3>
                <p className="text-xs text-slate-300">
                  Remplissage automatique intelligent ou saisie détaillée
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Corps de la modal avec scroll */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            
            {/* 1. Zone d'Auto-Remplissage Intelligent (Smart Paste) */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900 text-white border border-gold/30 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-gold/20 text-gold flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gold">
                    Collage Rapide & Détection Automatique
                  </h4>
                </div>
                <span className="text-[11px] text-slate-300">
                  Collez le texte brut d'une fiche (ex: Volkswagen Tiguan, km, options...)
                </span>
              </div>

              <textarea
                rows={3}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Exemple :&#10;VOLKSWAGEN TIGUAN R-LINE 2.0 TDI 150 CH DSG&#10;Kilométrage : 45 129 km&#10;Mise en circulation : 04/06/2024&#10;Énergie : Diesel&#10;Puissance : 150 ch&#10;Puissance fiscale : 8 CV&#10;Cylindrée : 1 968 cm³&#10;Boîte de vitesses : Automatique&#10;Transmission : Traction avant&#10;Couleur extérieure : Gris&#10;Couleur intérieure : Noir&#10;ÉQUIPEMENTS / OPTIONS&#10;- Toit ouvrant panoramique&#10;- Sièges avant massants..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-700 text-xs font-mono text-slate-200 outline-none focus:border-gold placeholder:text-slate-500 resize-y"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutoParse}
                    className="px-4 py-2 rounded-lg bg-gold hover:bg-gold-light text-rolex-dark font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <Zap className="w-4 h-4" /> Analyser & Remplir les Champs
                  </button>
                  {rawText && (
                    <button
                      type="button"
                      onClick={handleClearRawText}
                      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Effacer
                    </button>
                  )}
                </div>

                {parseFeedback && (
                  <div
                    className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                      parseFeedback.type === 'success'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {parseFeedback.type === 'success' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span>{parseFeedback.message}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Onglets de Navigation des Champs Structurés */}
            <div className="flex border-b border-slate-200 overflow-x-auto gap-1 bg-slate-50 p-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('general')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'general'
                    ? 'bg-rolex text-gold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Tag className="w-3.5 h-3.5" /> Général & Prix
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('technical')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'technical'
                    ? 'bg-rolex text-gold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Settings className="w-3.5 h-3.5" /> Technique & Moteur
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('equipments')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'equipments'
                    ? 'bg-rolex text-gold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" /> Options & Équipements
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('media')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'media'
                    ? 'bg-rolex text-gold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Galerie Photos
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('guarantee')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'guarantee'
                    ? 'bg-rolex text-gold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Audit & Confiance
              </button>
            </div>

            {/* 3. Formulaire par Onglet */}
            <form id="vehicle-form" onSubmit={handleSubmit} className="space-y-4">
              
              {/* ONGLET 1: GÉNÉRAL & PRIX */}
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Titre Complet de l'Annonce *
                    </label>
                    <input
                      type="text"
                      required
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="ex: VOLKSWAGEN TIGUAN R-LINE 2.0 TDI 150 CH DSG"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Marque *</label>
                      <input
                        type="text"
                        required
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="ex: Volkswagen"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Modèle / Finition</label>
                      <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        placeholder="ex: Tiguan R-Line"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Catégorie *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex font-medium"
                      >
                        <option value="Citadine">Citadine</option>
                        <option value="Berline & Break">Berline & Break</option>
                        <option value="SUV & 4x4">SUV & 4x4</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Prix de Vente (€)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="ex: 38900"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex font-bold text-rolex"
                      />
                      <span className="text-[10px] text-slate-400">Laisser vide pour afficher 'En arrivage'</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Remise constatée (%)
                      </label>
                      <input
                        type="number"
                        name="discount_percent"
                        value={formData.discount_percent}
                        onChange={handleChange}
                        placeholder="ex: 12"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Disponibilité *
                      </label>
                      <select
                        name="availability_status"
                        value={formData.availability_status}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex font-bold text-slate-800"
                      >
                        <option value="ARRIVAGE">ARRIVAGE</option>
                        <option value="EN STOCK">EN STOCK</option>
                        <option value="DISPONIBLE EN CONCESSION">DISPONIBLE EN CONCESSION</option>
                        <option value="RÉSERVÉ">RÉSERVÉ</option>
                        <option value="SUR COMMANDE">SUR COMMANDE</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleChange}
                        className="w-4 h-4 text-rolex rounded border-slate-300 focus:ring-rolex"
                      />
                      <span className="text-xs font-bold text-slate-700">
                        Mettre en avant ce véhicule sur la page d'accueil (Top Opportunité)
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* ONGLET 2: TECHNIQUE & MOTEUR */}
              {activeTab === 'technical' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Année *</label>
                      <input
                        type="number"
                        required
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">1ère Immat.</label>
                      <input
                        type="text"
                        name="first_reg_date"
                        value={formData.first_reg_date}
                        onChange={handleChange}
                        placeholder="ex: 04/06/2024"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Kilométrage (km) *</label>
                      <input
                        type="number"
                        required
                        name="mileage"
                        value={formData.mileage}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Énergie / Carburant</label>
                      <input
                        type="text"
                        name="fuel_type"
                        value={formData.fuel_type}
                        onChange={handleChange}
                        placeholder="ex: Diesel / Essence / Hybride"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Puissance (ch) *</label>
                      <input
                        type="number"
                        required
                        name="power_hp"
                        value={formData.power_hp}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Puissance Fiscale (CV)</label>
                      <input
                        type="number"
                        name="fiscal_power"
                        value={formData.fiscal_power}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Moteur / Cylindrée</label>
                      <input
                        type="text"
                        name="engine"
                        value={formData.engine}
                        onChange={handleChange}
                        placeholder="ex: 1 968 cm³ - 2.0 TDI"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Boîte de vitesses</label>
                      <input
                        type="text"
                        name="transmission"
                        value={formData.transmission}
                        onChange={handleChange}
                        placeholder="ex: Automatique DSG"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Transmission / Motricité</label>
                      <input
                        type="text"
                        name="drivetrain"
                        value={formData.drivetrain}
                        onChange={handleChange}
                        placeholder="ex: Traction avant / 4x4 4Motion"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Teinte Extérieure</label>
                      <input
                        type="text"
                        name="color_ext"
                        value={formData.color_ext}
                        onChange={handleChange}
                        placeholder="ex: Gris"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Intérieur / Sellerie</label>
                      <input
                        type="text"
                        name="color_int"
                        value={formData.color_int}
                        onChange={handleChange}
                        placeholder="ex: Noir"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Nombre de Places</label>
                      <input
                        type="number"
                        name="seats"
                        value={formData.seats}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Portes</label>
                      <input
                        type="text"
                        name="doors"
                        value={formData.doors}
                        onChange={handleChange}
                        placeholder="ex: 5 portes"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ONGLET 3: OPTIONS & ÉQUIPEMENTS */}
              {activeTab === 'equipments' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase text-slate-700">
                      Liste des Équipements & Options (1 par ligne)
                    </label>
                    <span className="text-[11px] font-bold text-rolex bg-rolex/10 px-2 py-0.5 rounded">
                      {formData.raw_equipments_text.split('\n').filter(Boolean).length} équipements saisis
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Ces options seront automatiquement triées par catégories (Sécurité, Confort, Multimédia, Éclairage, Extérieur) sur la fiche produit du véhicule.
                  </p>
                  <textarea
                    rows={10}
                    name="raw_equipments_text"
                    value={formData.raw_equipments_text}
                    onChange={handleChange}
                    placeholder="- Finition R-Line&#10;- Toit ouvrant panoramique&#10;- Sellerie cuir&#10;- Sièges avant massants&#10;- Digital Cockpit 10 pouces&#10;- Système audio Harman Kardon&#10;- IQ.LIGHT Matrix LED&#10;- Radars avant/arrière..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-surface text-xs font-mono outline-none focus:border-rolex leading-relaxed"
                  />
                </div>
              )}

              {/* ONGLET 4: GALERIE & MÉDIAS */}
              {activeTab === 'media' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      URL Image Principale HD *
                    </label>
                    <input
                      type="url"
                      required
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleChange}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Galerie Complète (URLs d'images, 1 par ligne)
                    </label>
                    <textarea
                      rows={5}
                      name="gallery_urls"
                      value={formData.gallery_urls}
                      onChange={handleChange}
                      placeholder="https://images.unsplash.com/...&#10;https://images.unsplash.com/...&#10;https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface text-xs font-mono outline-none focus:border-rolex"
                    />
                  </div>

                  {/* Aperçu des photos */}
                  {formData.image_url && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase text-slate-600 block">Aperçu Visuel</span>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        <div className="relative w-28 h-20 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-900">
                          <img
                            src={formData.image_url}
                            alt="Principal"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                          <span className="absolute bottom-1 left-1 px-1 py-0.2 rounded bg-black/70 text-white text-[9px] font-bold">
                            Principale
                          </span>
                        </div>
                        {formData.gallery_urls
                          .split('\n')
                          .filter((u) => u.startsWith('http') && u !== formData.image_url)
                          .slice(0, 4)
                          .map((url, idx) => (
                            <div key={idx} className="relative w-28 h-20 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-900">
                              <img src={url} alt={`Vue ${idx + 2}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ONGLET 5: AUDIT & CONFIANCE */}
              {activeTab === 'guarantee' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Certification & Audit *</label>
                      <input
                        type="text"
                        required
                        name="certification"
                        value={formData.certification}
                        onChange={handleChange}
                        placeholder="ex: Audit 150 Points Validé"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
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
                        placeholder="ex: Garantie Constructeur 12 à 24 Mois"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Réseau / Provenance *</label>
                      <input
                        type="text"
                        required
                        name="origin_country"
                        value={formData.origin_country}
                        onChange={handleChange}
                        placeholder="ex: Réseau Partenaire France"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Ville de Livraison / Dépôt *</label>
                      <input
                        type="text"
                        required
                        name="delivery_city"
                        value={formData.delivery_city}
                        onChange={handleChange}
                        placeholder="ex: France entière (Livraison sécurisée)"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
                      />
                    </div>
                  </div>

                  {/* Témoignage / Avis Client Optionnel */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <label className="block text-xs font-bold uppercase text-slate-700">
                      Témoignage Client Lié (Optionnel)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        name="client_name"
                        value={formData.client_name}
                        onChange={handleChange}
                        placeholder="Nom client (ex: Thomas R.)"
                        className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs outline-none focus:border-rolex"
                      />
                      <input
                        type="text"
                        name="client_city"
                        value={formData.client_city}
                        onChange={handleChange}
                        placeholder="Ville (ex: Lyon)"
                        className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs outline-none focus:border-rolex"
                      />
                    </div>
                    <textarea
                      rows={2}
                      name="client_review"
                      value={formData.client_review}
                      onChange={handleChange}
                      placeholder="Commentaire de l'acquéreur (ex: Contrôle 150 points irréprochable et livraison soignée...)"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs outline-none focus:border-rolex resize-none"
                    />
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Footer Modal */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold uppercase hover:bg-slate-200 transition-colors"
            >
              Annuler
            </button>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                form="vehicle-form"
                className="px-5 py-2.5 rounded-lg bg-rolex hover:bg-rolex-dark text-gold font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Enregistrer le Véhicule
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
