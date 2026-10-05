import React, { useState } from 'react';
import { 
  Calendar, 
  Gauge, 
  Zap, 
  Fuel, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Sliders, 
  Settings, 
  Award, 
  Car, 
  Layers, 
  Wrench,
  Calculator,
  ChevronRight,
  Info
} from 'lucide-react';

export const VehicleSpecsAndEquipments = ({ vehicle }) => {
  const [activeTab, setActiveTab] = useState('equipments'); // 'equipments' | 'audit' | 'history' | 'finance'
  
  // Paramètres pour le simulateur de financement
  const vehiclePrice = vehicle?.price || 29990;
  const [downPayment, setDownPayment] = useState(Math.round(vehiclePrice * 0.15));
  const [durationMonths, setDurationMonths] = useState(48);
  const [interestRate] = useState(4.9); // Taux TAEG fixe indicatif

  // Calcul mensualité
  const loanAmount = Math.max(0, vehiclePrice - downPayment);
  const monthlyRate = interestRate / 100 / 12;
  const calculatedMonthly = monthlyRate > 0
    ? Math.round((loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -durationMonths)))
    : Math.round(loanAmount / durationMonths);

  const mainSpecsGrid = [
    { icon: Calendar, label: 'Mise en circulation', value: vehicle?.specs?.first_reg_date || `${vehicle?.year || '2023'}` },
    { icon: Gauge, label: 'Kilométrage certifié', value: `${vehicle?.mileage?.toLocaleString('fr-FR')} km` },
    { icon: Fuel, label: 'Énergie / Carburant', value: vehicle?.fuel_type || 'Essence / Hybride' },
    { icon: Zap, label: 'Puissance DIN', value: `${vehicle?.power_hp} ch (${vehicle?.fiscal_power || 10} CV)` },
    { icon: Settings, label: 'Boîte de vitesses', value: vehicle?.transmission || 'Automatique' },
    { icon: ShieldCheck, label: 'Vignette Crit’Air / CO2', value: vehicle?.specs?.co2 || 'Crit’Air 1' },
    { icon: Car, label: 'Carrosserie / Portes', value: `${vehicle?.category || 'Berline'} • ${vehicle?.specs?.doors || '5 portes'}` },
    { icon: Layers, label: 'Nombre de places', value: vehicle?.specs?.seats || '5 places' },
    { icon: Award, label: 'Historique', value: vehicle?.specs?.owners_count || '1ère Main' },
    { icon: ShieldCheck, label: 'Garantie incluse', value: vehicle?.warranty || 'Garantie Constructeur' },
  ];

  const auditCategories = [
    {
      name: '1. Audit Moteur & Transmission',
      status: '100% Conforme',
      items: [
        'Test de compression & étanchéité moteur',
        'Vérification des niveaux et absence totale de fuite',
        'Diagnostic de passage des rapports de boîte',
        'Contrôle de l’embrayage / convertisseur de couple',
        'Contrôle du circuit de suralimentation et turbo'
      ]
    },
    {
      name: '2. Diagnostic Électronique & Calculateurs',
      status: '100% Conforme',
      items: [
        'Scan complet des calculateurs via valise constructeur',
        'Certification de non-manipulation du compteur kilométrique',
        'Vérification du système d’hybridation / batterie (SOH > 95%)',
        'Contrôle des capteurs ADAS (radars, caméras, aides)',
        'Test complet des systèmes d’infodivertissement & GPS'
      ]
    },
    {
      name: '3. Châssis, Trains Roulants & Freinage',
      status: '100% Conforme',
      items: [
        'Mesure d’usure des disques et plaquettes de frein (< 20% usure)',
        'Vérification des amortisseurs et suspensions pilotées',
        'Contrôle des trains avant/arrière, rotules et silentblocs',
        'Mesure de profondeur des pneumatiques conformes constructeur',
        'Alignement géométrie et parallélisme vérifiés'
      ]
    },
    {
      name: '4. Carrosserie, Peinture & Structure',
      status: '100% Conforme',
      items: [
        'Mesure de l’épaisseur de peinture au micromètre numérique',
        'Attestation d’absence de déformation structurelle ou marbre',
        'Vérification de l’alignement des ouvrants et panneaux',
        'Traitement esthétique de décontamination et lustrage de finition',
        'Contrôle de conformité de tous les vitrages d’origine'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* 1. Grille des Caractéristiques Techniques Clés */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
              Fiche d'Identité & Caractéristiques
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Toutes les spécifications certifiées par notre audit technique en 150 points.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Véhicule Vérifié
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {mainSpecsGrid.map((spec, idx) => {
            const IconComp = spec.icon;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-slate-50 border border-slate-100/80 hover:border-slate-300 transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 mb-2 text-slate-400">
                  <IconComp className="w-4 h-4 text-rolex shrink-0" />
                  <span className="text-[11px] font-semibold text-slate-500 truncate">{spec.label}</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  {spec.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Onglets Détaillés : Équipements / Audit 150 Points / Historique / Financement */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        
        {/* Navigation Onglets */}
        <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50/70">
          <button
            onClick={() => setActiveTab('equipments')}
            className={`px-5 sm:px-8 py-4 text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors whitespace-nowrap border-b-2 flex items-center gap-2 ${
              activeTab === 'equipments'
                ? 'border-rolex text-rolex bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-4 h-4 text-gold" />
            Équipements & Options ({vehicle?.equipments?.reduce((acc, g) => acc + g.items.length, 0) || 16})
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-5 sm:px-8 py-4 text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors whitespace-nowrap border-b-2 flex items-center gap-2 ${
              activeTab === 'audit'
                ? 'border-rolex text-rolex bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Audit 150 Points Validé
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-5 sm:px-8 py-4 text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors whitespace-nowrap border-b-2 flex items-center gap-2 ${
              activeTab === 'history'
                ? 'border-rolex text-rolex bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-rolex" />
            Historique & Traçabilité
          </button>

          <button
            onClick={() => setActiveTab('finance')}
            className={`px-5 sm:px-8 py-4 text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors whitespace-nowrap border-b-2 flex items-center gap-2 ${
              activeTab === 'finance'
                ? 'border-rolex text-rolex bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-4 h-4 text-gold" />
            Simulateur Financement
          </button>
        </div>

        {/* Contenu des Onglets */}
        <div className="p-6 sm:p-8">
          
          {/* TAB 1: Équipements & Options */}
          {activeTab === 'equipments' && (
            <div className="space-y-6">
              {vehicle?.equipments && vehicle.equipments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {vehicle.equipments.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-3 p-4 rounded-xl bg-slate-50/70 border border-slate-100">
                      <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-rolex flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gold" />
                        {group.category}
                      </h4>
                      <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                        {group.items.map((item, iIdx) => (
                          <li key={iIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#4ea81e] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Équipements de série certifiés constructeur.</p>
              )}
            </div>
          )}

          {/* TAB 2: Audit 150 Points */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-rolex-dark to-rolex-forest text-white border border-gold/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-rolex border border-gold/40 flex items-center justify-center shrink-0 text-gold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gold uppercase tracking-wider">Protocole de Contrôle</h4>
                    <p className="text-lg font-serif font-bold">150 Points d'Inspection Validés avec Succès</p>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider">
                  Rapport Vierge Certifié
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {auditCategories.map((cat, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900">{cat.name}</span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        {cat.status}
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {cat.items.map((it, iIdx) => (
                        <li key={iIdx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Historique & Traçabilité */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <span className="text-xs text-slate-500">Carnet d'Entretien</span>
                  <p className="font-bold text-slate-900 text-sm">100% Numérique & à Jour</p>
                  <span className="text-[11px] text-emerald-600 block">Réseau Officiel de la Marque</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <span className="text-xs text-slate-500">Origine Véhicule</span>
                  <p className="font-bold text-slate-900 text-sm">{vehicle?.origin_country || 'Concession France'}</p>
                  <span className="text-[11px] text-rolex block">Partenaire Officiel Agréé</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <span className="text-xs text-slate-500">Contrôle Technique</span>
                  <p className="font-bold text-slate-900 text-sm">Vierge • Valable 2 ans</p>
                  <span className="text-[11px] text-emerald-600 block">Zéro Défaut Majeur / Mineur</span>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-surface space-y-3">
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                  Documents fournis lors de la remise des clés :
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Certificat de situation administrative (Non-gage certifié)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Double des clés d’origine avec télécommande</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Factures d'entretien et justificatifs d'historique</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Certificat d'immatriculation (Carte Grise Française)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Simulateur Financement */}
          {activeTab === 'finance' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center space-y-1">
                <h4 className="text-lg font-serif font-bold text-slate-900">
                  Simulateur de Financement Sur-Mesure
                </h4>
                <p className="text-xs text-slate-500">
                  Ajustez votre apport et la durée de remboursement pour estimer votre mensualité.
                </p>
              </div>

              {/* Slider Apport */}
              <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between text-xs sm:text-sm font-semibold">
                  <span className="text-slate-700">Votre Apport Personnel :</span>
                  <span className="text-rolex font-bold">{downPayment.toLocaleString('fr-FR')} € ({Math.round((downPayment / vehiclePrice) * 100)}%)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.round(vehiclePrice * 0.5)}
                  step="500"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full accent-rolex cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0 € (Sans apport)</span>
                  <span>{Math.round(vehiclePrice * 0.5).toLocaleString('fr-FR')} € (50% max)</span>
                </div>
              </div>

              {/* Sélecteur Durée */}
              <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs sm:text-sm font-semibold text-slate-700 block">
                  Durée du financement :
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[24, 36, 48, 60].map((m) => (
                    <button
                      key={m}
                      onClick={() => setDurationMonths(m)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                        durationMonths === m
                          ? 'bg-rolex text-gold border border-gold/40 shadow-sm'
                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {m} mois ({m / 12} ans)
                    </button>
                  ))}
                </div>
              </div>

              {/* Résultat Mensualité Estimée */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-rolex-dark to-rolex text-white text-center space-y-2 border border-gold/40 shadow-lg">
                <span className="text-xs text-gold uppercase tracking-wider font-semibold">
                  Votre mensualité estimée
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
                  {calculatedMonthly} € <span className="text-sm font-light text-slate-300">/ mois</span>
                </div>
                <p className="text-[11px] text-slate-300 max-w-md mx-auto">
                  Montant financé : {loanAmount.toLocaleString('fr-FR')} € sur {durationMonths} mois. Offre indicative sous réserve d’acceptation de dossier.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
