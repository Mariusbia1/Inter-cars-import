import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Car, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw,
  Tag,
  Settings,
  Wrench,
  Palette,
  ShieldCheck,
  ImageIcon
} from 'lucide-react';
import { parseVehicleText } from '../../utils/vehicleParser';
import { VehicleImageUploader } from './VehicleImageUploader';

export const VehicleEditorView = ({ vehicle, onSave, onCancel }) => {
  const [rawText, setRawText] = useState('');
  const [parseFeedback, setParseFeedback] = useState(null);
  const [imagesList, setImagesList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    brand: 'Volkswagen',
    model: '',
    category: 'SUV & 4x4',
    price: '',
    discount_percent: 12,
    availability_status: 'ARRIVAGE',
    is_featured: false,

    // Technical
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

    // Colors
    color_ext: 'Gris',
    color_int: 'Noir',

    // Equipments
    raw_equipments_text: '',

    // Trust & Warranty
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

      const initialGallery = Array.isArray(vehicle.gallery) && vehicle.gallery.length > 0
        ? vehicle.gallery
        : vehicle.image_url
        ? [vehicle.image_url]
        : [];

      setImagesList(initialGallery);

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

        raw_equipments_text: flatEquipments.map((e) => `- ${e}`).join('\n'),

        certification: vehicle.certification || 'Audit 150 Points Validé',
        warranty: vehicle.warranty || 'Garantie Constructeur 12 à 24 Mois',
        origin_country: vehicle.origin_country || 'Réseau Partenaire France',
        delivery_city: vehicle.delivery_city || 'France entière',
        client_name: vehicle.client_name || '',
        client_city: vehicle.client_city || '',
        client_review: vehicle.client_review || ''
      });
    }
  }, [vehicle]);

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
    }));

    // Si aucune photo n'a encore été importée et que le parser suggère une galerie par défaut
    if (imagesList.length === 0 && parsed.gallery_urls) {
      const defaultImgs = parsed.gallery_urls.split('\n').filter(Boolean);
      setImagesList(defaultImgs);
    }

    const optionsCount = parsed.equipments ? parsed.equipments.length : 0;
    setParseFeedback({
      type: 'success',
      message: `Fiche analysée avec succès ! ${optionsCount} options et caractéristiques détectées et réparties dans le formulaire ci-dessous.`
    });
  };

  const handleClearRawText = () => {
    setRawText('');
    setParseFeedback(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Extraire les options sous forme de tableau
    const equipmentsList = formData.raw_equipments_text
      .split('\n')
      .map((l) => l.replace(/^[-•*✓\s]+/, '').trim())
      .filter((l) => l.length > 2);

    const mainImageUrl = imagesList.length > 0 
      ? imagesList[0] 
      : 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80';

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
      image_url: mainImageUrl,
      gallery: imagesList.length > 0 ? imagesList : [mainImageUrl],
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
        owners_count: '1ère Main Certifiée',
        color_int: formData.color_int || 'Noir',
        fiscal_power: parseInt(formData.fiscal_power, 10) || 8,
        engine_cylinders: formData.engine || '2.0L Turbo'
      }
    };

    onSave(payload);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* 1. Header Navigation & Titre de la Page */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors flex items-center justify-center shrink-0"
            title="Retour à la liste"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2.5 py-0.5 rounded-full bg-rolex/10 text-rolex text-[10px] font-bold uppercase tracking-wider">
                {vehicle ? 'Modification' : 'Création Véhicule'}
              </span>
              <span className="text-xs text-slate-400">• Catalogue Inter Cars</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
              {vehicle ? `Modifier : ${formData.title || vehicle.title}` : 'Ajouter un Nouveau Véhicule'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold uppercase hover:bg-slate-100 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            form="vehicle-editor-form"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-rolex hover:bg-rolex-dark text-gold font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> {isSubmitting ? 'Enregistrement...' : 'Enregistrer le véhicule'}
          </button>
        </div>
      </div>

      {/* 2. Bloc Auto-Remplissage Intelligent par Copier-Coller */}
      <div className="bg-slate-900 text-white p-6 sm:p-7 rounded-2xl border border-gold/30 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gold/20 text-gold flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gold">
                Collage Rapide & Auto-Remplissage Intelligent
              </h4>
              <p className="text-xs text-slate-300">
                Collez n'importe quel texte de fiche technique brut : le système détecte et répartit automatiquement toutes les caractéristiques !
              </p>
            </div>
          </div>
        </div>

        <textarea
          rows={3}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Collez votre fiche ici (ex :&#10;VOLKSWAGEN TIGUAN R-LINE 2.0 TDI 150 CH DSG&#10;Kilométrage : 45 129 km&#10;Mise en circulation : 04/06/2024&#10;Énergie : Diesel&#10;Puissance : 150 ch&#10;ÉQUIPEMENTS / OPTIONS : - Toit ouvrant panoramique - Sièges massants...)"
          className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-700 text-xs font-mono text-slate-200 outline-none focus:border-gold placeholder:text-slate-500 leading-relaxed resize-y"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleAutoParse}
              className="px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-rolex-dark font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-2"
            >
              <Zap className="w-4 h-4" /> Analyser & Remplir les Champs
            </button>
            {rawText && (
              <button
                type="button"
                onClick={handleClearRawText}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Effacer
              </button>
            )}
          </div>

          {parseFeedback && (
            <div
              className={`text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 ${
                parseFeedback.type === 'success'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {parseFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{parseFeedback.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Formulaire Complet Structuré */}
      <form id="vehicle-editor-form" onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: UPLOAD PHOTOS MULTIPLES */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rolex/10 text-rolex flex items-center justify-center">
                <ImageIcon className="w-4 h-4" />
              </div>
              <h3 className="text-base font-serif font-bold text-slate-900">
                1. Photos du Véhicule (Upload Multiple & Galerie HD)
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {imagesList.length} photo{imagesList.length > 1 ? 's' : ''} au total
            </span>
          </div>

          <VehicleImageUploader
            images={imagesList}
            onChange={(newImgs) => setImagesList(newImgs)}
          />
        </div>

        {/* SECTION 2: IDENTITÉ & PRIX */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-rolex/10 text-rolex flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <h3 className="text-base font-serif font-bold text-slate-900">
              2. Informations Générales & Prix
            </h3>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              Titre Complet du Véhicule *
            </label>
            <input
              type="text"
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="ex: VOLKSWAGEN TIGUAN R-LINE 2.0 TDI 150 CH DSG"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-surface text-sm font-semibold outline-none focus:border-rolex"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Marque *</label>
              <input
                type="text"
                required
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="ex: Volkswagen"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Modèle & Finition</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="ex: Tiguan R-Line"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Catégorie de Véhicule *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-surface text-xs sm:text-sm font-semibold outline-none focus:border-rolex"
              >
                <option value="SUV & 4x4">SUV & 4x4</option>
                <option value="Berline & Break">Berline & Break</option>
                <option value="Sportive">Sportive</option>
                <option value="Compacte & Citadine">Compacte & Citadine</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Prix de Vente Client (€)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="ex: 38900"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-surface text-sm font-extrabold text-rolex outline-none focus:border-rolex"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Laisser vide pour afficher "Sur devis"</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Remise Constatée (%)</label>
              <input
                type="number"
                name="discount_percent"
                value={formData.discount_percent}
                onChange={handleChange}
                placeholder="ex: 12"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Disponibilité *</label>
              <select
                name="availability_status"
                value={formData.availability_status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-surface text-xs sm:text-sm font-bold text-slate-800 outline-none focus:border-rolex"
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
              <span className="text-xs font-bold text-slate-800">
                Mettre en avant ce véhicule sur la page d'accueil (Top Opportunité)
              </span>
            </label>
          </div>
        </div>

        {/* SECTION 3: FICHE TECHNIQUE & MOTORISATION */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-rolex/10 text-rolex flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <h3 className="text-base font-serif font-bold text-slate-900">
              3. Spécifications Techniques & Motorisation
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Année *</label>
              <input
                type="number"
                required
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">1ère Immatriculation</label>
              <input
                type="text"
                name="first_reg_date"
                value={formData.first_reg_date}
                onChange={handleChange}
                placeholder="ex: 04/06/2024"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Kilométrage (km) *</label>
              <input
                type="number"
                required
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Énergie / Carburant</label>
              <input
                type="text"
                name="fuel_type"
                value={formData.fuel_type}
                onChange={handleChange}
                placeholder="ex: Diesel"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Puissance DIN (ch) *</label>
              <input
                type="number"
                required
                name="power_hp"
                value={formData.power_hp}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Puissance Fiscale (CV)</label>
              <input
                type="number"
                name="fiscal_power"
                value={formData.fiscal_power}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Motorisation / Cylindrée</label>
              <input
                type="text"
                name="engine"
                value={formData.engine}
                onChange={handleChange}
                placeholder="ex: 1 968 cm³ - 2.0 TDI"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Boîte de vitesses</label>
              <input
                type="text"
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                placeholder="ex: Automatique DSG"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Transmission / Motricité</label>
              <input
                type="text"
                name="drivetrain"
                value={formData.drivetrain}
                onChange={handleChange}
                placeholder="ex: Traction avant / 4x4"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Teinte Extérieure</label>
              <input
                type="text"
                name="color_ext"
                value={formData.color_ext}
                onChange={handleChange}
                placeholder="ex: Gris"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Couleur Intérieure / Sellerie</label>
              <input
                type="text"
                name="color_int"
                value={formData.color_int}
                onChange={handleChange}
                placeholder="ex: Noir"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Nombre de Places</label>
              <input
                type="number"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Nombre de Portes</label>
              <input
                type="text"
                name="doors"
                value={formData.doors}
                onChange={handleChange}
                placeholder="ex: 5 portes"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: ÉQUIPEMENTS & OPTIONS */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rolex/10 text-rolex flex items-center justify-center">
                <Wrench className="w-4 h-4" />
              </div>
              <h3 className="text-base font-serif font-bold text-slate-900">
                4. Équipements & Options de Série
              </h3>
            </div>
            <span className="text-xs font-bold text-rolex bg-rolex/10 px-3 py-1 rounded-full">
              {formData.raw_equipments_text.split('\n').filter(Boolean).length} options détectées
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Saisissez ou collez la liste des équipements (1 option par ligne avec un tiret <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">-</code>). Elles seront automatiquement ordonnées et catégorisées sur la fiche produit finale.
          </p>

          <textarea
            rows={10}
            name="raw_equipments_text"
            value={formData.raw_equipments_text}
            onChange={handleChange}
            placeholder="- Finition R-Line&#10;- Toit ouvrant panoramique&#10;- Sièges avant massants&#10;- Navigation Discover Pro&#10;- Écran tactile 15 pouces&#10;- IQ.LIGHT HD Matrix LED&#10;- Radars de stationnement avant/arrière..."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-surface text-xs font-mono outline-none focus:border-rolex leading-relaxed"
          />
        </div>

        {/* SECTION 5: AUDIT, GARANTIE & RÉSEAU */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-rolex/10 text-rolex flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-base font-serif font-bold text-slate-900">
              5. Audit Technique, Garantie & Provenance
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Certification & Contrôle *</label>
              <input
                type="text"
                required
                name="certification"
                value={formData.certification}
                onChange={handleChange}
                placeholder="ex: Audit 150 Points Validé"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Garantie Incluse *</label>
              <input
                type="text"
                required
                name="warranty"
                value={formData.warranty}
                onChange={handleChange}
                placeholder="ex: Garantie Constructeur 12 à 24 Mois"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Provenance Réseau *</label>
              <input
                type="text"
                required
                name="origin_country"
                value={formData.origin_country}
                onChange={handleChange}
                placeholder="ex: Réseau Partenaire France"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Ville de Livraison / Dépôt *</label>
              <input
                type="text"
                required
                name="delivery_city"
                value={formData.delivery_city}
                onChange={handleChange}
                placeholder="ex: France entière (Livrable à domicile)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-surface text-xs sm:text-sm outline-none focus:border-rolex"
              />
            </div>
          </div>

          {/* Avis Client Optionnel */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 mt-2">
            <label className="block text-xs font-bold uppercase text-slate-700">
              Témoignage Client Lié (Optionnel)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                placeholder="Nom acquéreur (ex: Maxime V.)"
                className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs outline-none focus:border-rolex"
              />
              <input
                type="text"
                name="client_city"
                value={formData.client_city}
                onChange={handleChange}
                placeholder="Ville (ex: Lyon)"
                className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs outline-none focus:border-rolex"
              />
            </div>
            <textarea
              rows={2}
              name="client_review"
              value={formData.client_review}
              onChange={handleChange}
              placeholder="Commentaire de l'acquéreur (ex: Audit 150 points irréprochable et livraison soignée à domicile...)"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs outline-none focus:border-rolex resize-none"
            />
          </div>
        </div>

        {/* BARRE FIXE D'ACTION INFÉRIEURE */}
        <div className="p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl shadow-lg flex items-center justify-between sticky bottom-4 z-20">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold uppercase hover:bg-slate-100 transition-colors"
          >
            Annuler les modifications
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-rolex hover:bg-rolex-dark text-gold font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> {isSubmitting ? 'Enregistrement...' : 'Enregistrer le véhicule'}
          </button>
        </div>
      </form>
    </div>
  );
};
