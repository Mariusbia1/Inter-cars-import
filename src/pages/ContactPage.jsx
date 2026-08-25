import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2, ShieldCheck, Sparkles, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SectionHeader } from '../components/common/SectionHeader';
import { LuxuryButton } from '../components/common/LuxuryButton';
import { useLeads } from '../context/LeadsContext';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';

export const ContactPage = () => {
  const { createLead } = useLeads();
  const { settings } = useSettings();
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    vehicle_type: 'Sportive',
    brand_sought: 'Porsche',
    model_sought: '',
    year_min: '2023',
    mileage_max: 'Moins de 25 000 km',
    fuel_type: 'Essence V8 / Flat-6',
    transmission: 'Automatique (Double Embrayage / BVA)',
    preferred_timeline: 'Sous 30 jours',
    full_name: '',
    email: '',
    phone: '',
    delivery_city: '',
    message: '',
    accept_privacy: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step < 3) {
      setStep((prev) => Math.min(prev + 1, 3));
      return;
    }

    if (!formData.accept_privacy) {
      addToast('Veuillez accepter la politique de confidentialité pour envoyer votre demande.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const recipient = settings.notificationEmail || settings.email;
      const res = await createLead({
        ...formData,
        routed_to_email: recipient
      });

      if (res.success) {
        setIsSuccess(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#006039', '#C6A15B', '#D4AF37', '#ffffff']
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 sm:pt-36 bg-surface">
      {/* Hero Page Header */}
      <section className="bg-rolex-dark text-white py-14 sm:py-20 relative overflow-hidden border-b border-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-4 uppercase tracking-widest">
            <Link to="/" className="hover:text-gold transition-colors">Accueil</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gold" />
            <span className="text-gold font-semibold">Contact & Devis</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">
            Initiez Votre Projet <br />
            <span className="text-gold-gradient">Automobile Sur Mesure</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            Remplissez notre formulaire en 3 étapes. Notre équipe étudie votre demande et vérifie la disponibilité auprès de nos concessions partenaires en France sous 48h.
          </p>
        </div>
      </section>

      {/* Main Content : Formulaire & Coordonnées */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Colonne Gauche : Formulaire 3 Étapes */}
            <div className="lg:col-span-7">
              <div className="bg-surface rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-luxury-card relative overflow-hidden">
                {/* Indicateur d'étapes */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
                  <div className="flex items-center gap-2 sm:gap-4">
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="flex items-center gap-2">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            step === num
                              ? 'bg-rolex text-gold border-2 border-gold shadow-gold-glow'
                              : step > num
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {step > num ? <CheckCircle2 className="w-4 h-4" /> : num}
                        </div>
                        <span className={`text-xs font-medium hidden sm:inline ${step === num ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                          {num === 1 ? 'Véhicule' : num === 2 ? 'Critères' : 'Coordonnées'}
                        </span>
                        {num < 3 && <span className="text-slate-300 hidden sm:inline">→</span>}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-gold font-semibold uppercase tracking-wider">
                    Étape {step}/3
                  </span>
                </div>

                {/* État de Succès */}
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10 space-y-6"
                  >
                    <div className="w-20 h-20 rounded-full bg-rolex text-gold border-2 border-gold flex items-center justify-center mx-auto shadow-gold-glow">
                      <Sparkles className="w-10 h-10 animate-pulse" />
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                      Votre Demande est Transmise !
                    </h3>

                    <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
                      Merci <strong>{formData.full_name}</strong>. Vos critères pour votre <strong>{formData.brand_sought} {formData.model_sought}</strong> ont été transmis directement à notre équipe ({settings.email}).
                    </p>

                    <div className="p-4 rounded-xl bg-rolex-50 border border-rolex/20 text-rolex text-xs max-w-md mx-auto">
                      Un conseiller dédié prend en charge votre dossier et vous contacte au <strong>{formData.phone}</strong> sous 24 à 48 heures ouvrées.
                    </div>

                    <div className="pt-4">
                      <LuxuryButton
                        onClick={() => {
                          setIsSuccess(false);
                          setStep(1);
                        }}
                        variant="rolex"
                        size="md"
                      >
                        Soumettre un autre projet
                      </LuxuryButton>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={step === 3 ? handleSubmit : handleNextStep} className="space-y-6">
                    {/* Étape 1 : Le Véhicule Recherché */}
                    {step === 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                      >
                        <h3 className="text-lg font-serif font-bold text-slate-900 mb-1">
                          1. Définissez le véhicule souhaité
                        </h3>
                        <p className="text-xs text-slate-500 mb-4">
                          Sélectionnez la catégorie et la marque souhaitée.
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {['Sportive', 'Berline & Break', 'SUV & 4x4', 'Coupé & Cabriolet'].map((cat) => (
                            <button
                              type="button"
                              key={cat}
                              onClick={() => setFormData({ ...formData, vehicle_type: cat })}
                              className={`p-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-center border transition-all ${
                                formData.vehicle_type === cat
                                  ? 'bg-rolex text-gold border-gold shadow-md font-bold'
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-rolex/40'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div>
                            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                              Marque Principale *
                            </label>
                            <select
                              name="brand_sought"
                              value={formData.brand_sought}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:border-rolex"
                            >
                              <option value="Porsche">Porsche</option>
                              <option value="Audi">Audi</option>
                              <option value="Mercedes-Benz">Mercedes-Benz</option>
                              <option value="BMW">BMW</option>
                              <option value="Ferrari">Ferrari</option>
                              <option value="Aston Martin">Aston Martin</option>
                              <option value="Range Rover / Land Rover">Range Rover / Land Rover</option>
                              <option value="Autre Marque">Autre Marque</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                              Modèle & Version Ciblée *
                            </label>
                            <input
                              type="text"
                              required
                              name="model_sought"
                              value={formData.model_sought}
                              onChange={handleChange}
                              placeholder="ex: 911 GT3 Touring, RS6 C8, Classe G..."
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:border-rolex"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                            Critères & Équipements Souhaités
                          </label>
                          <input
                            type="text"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="ex: Toit ouvrant, pack sport, affichage tête haute, échappement sport..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:border-rolex"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Étape 2 : Spécifications & Délais */}
                    {step === 2 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                      >
                        <h3 className="text-lg font-serif font-bold text-slate-900 mb-1">
                          2. Spécifications & Exigences Techniques
                        </h3>
                        <p className="text-xs text-slate-500 mb-4">
                          Précisez vos critères kilométriques et le calendrier souhaité.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                              Année Minimale
                            </label>
                            <select
                              name="year_min"
                              value={formData.year_min}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:border-rolex"
                            >
                              <option value="2024">2024 (Très récent)</option>
                              <option value="2023">2023</option>
                              <option value="2022">2022</option>
                              <option value="2020">2020</option>
                              <option value="2018 ou avant">2018 ou avant</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                              Kilométrage Maximum
                            </label>
                            <select
                              name="mileage_max"
                              value={formData.mileage_max}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:border-rolex"
                            >
                              <option value="Moins de 10 000 km">Moins de 10 000 km (État Neuf)</option>
                              <option value="Moins de 25 000 km">Moins de 25 000 km</option>
                              <option value="Moins de 50 000 km">Moins de 50 000 km</option>
                              <option value="Moins de 80 000 km">Moins de 80 000 km</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                              Motorisation / Énergie
                            </label>
                            <select
                              name="fuel_type"
                              value={formData.fuel_type}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:border-rolex"
                            >
                              <option value="Essence">Essence</option>
                              <option value="Diesel">Diesel</option>
                              <option value="Hybride Rechargeable (PHEV)">Hybride Rechargeable (PHEV)</option>
                              <option value="100% Électrique">100% Électrique</option>
                              <option value="Indifférent">Indifférent</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                              Délai Souhaité
                            </label>
                            <select
                              name="preferred_timeline"
                              value={formData.preferred_timeline}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:border-rolex"
                            >
                              <option value="Immédiat / Moins de 15 jours">Immédiat (Moins de 15j)</option>
                              <option value="Sous 30 jours">Sous 30 jours</option>
                              <option value="Dans les 2 à 3 mois">Dans les 2 à 3 mois</option>
                              <option value="Projet à moyen terme">Projet à moyen terme</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Étape 3 : Coordonnées & Envoi */}
                    {step === 3 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <h3 className="text-lg font-serif font-bold text-slate-900 mb-1">
                          3. Vos Coordonnées
                        </h3>
                        <p className="text-xs text-slate-500 mb-4">
                          Ces informations permettent à notre équipe de vous contacter avec une sélection personnalisée.
                        </p>

                        <div>
                          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                            Nom & Prénom *
                          </label>
                          <input
                            type="text"
                            required
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="ex: Alexandre Dupont"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:border-rolex"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                              Adresse Email *
                            </label>
                            <input
                              type="email"
                              required
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="votre.email@exemple.com"
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:border-rolex"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                              Téléphone Direct *
                            </label>
                            <input
                              type="tel"
                              required
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="+33 6 00 00 00 00"
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:border-rolex"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                            Ville de Livraison Préférée
                          </label>
                          <input
                            type="text"
                            name="delivery_city"
                            value={formData.delivery_city}
                            onChange={handleChange}
                            placeholder="ex: Paris, Cannes, Lyon, Bordeaux..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:border-rolex"
                          />
                        </div>

                        {/* Case à cocher obligatoire RGPD & Politique de Confidentialité */}
                        <div className="pt-2">
                          <label className="flex items-start gap-3 cursor-pointer select-none group">
                            <input
                              type="checkbox"
                              name="accept_privacy"
                              required
                              checked={formData.accept_privacy}
                              onChange={(e) => setFormData((prev) => ({ ...prev, accept_privacy: e.target.checked }))}
                              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-rolex focus:ring-rolex cursor-pointer shrink-0"
                            />
                            <span className="text-xs text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors">
                              J'accepte la{' '}
                              <Link
                                to="/confidentialite"
                                target="_blank"
                                className="text-rolex font-semibold underline hover:text-gold transition-colors"
                              >
                                politique de confidentialité
                              </Link>{' '}
                              et j'autorise Inter Cars Import à collecter et traiter mes coordonnées dans le cadre strict de ma demande de devis.
                            </span>
                          </label>
                        </div>
                      </motion.div>
                    )}

                    {/* Boutons d'Action & Navigation Formulaire */}
                    <div className="pt-4 flex items-center justify-between gap-4 border-t border-slate-200">
                      {step > 1 ? (
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold uppercase tracking-wider hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" /> Précédent
                        </button>
                      ) : (
                        <div />
                      )}

                      {step < 3 ? (
                        <LuxuryButton
                          type="submit"
                          variant="rolex"
                          size="md"
                          icon={ArrowRight}
                        >
                          Étape Suivante
                        </LuxuryButton>
                      ) : (
                        <LuxuryButton
                          type="submit"
                          disabled={isSubmitting}
                          variant="gold"
                          size="md"
                          icon={Send}
                          className="shadow-gold-glow font-bold tracking-wider text-xs"
                        >
                          {isSubmitting ? 'Transmission...' : 'Envoyer ma demande'}
                        </LuxuryButton>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Colonne Droite : Coordonnées & Showroom */}
            <div className="lg:col-span-5 space-y-8">
              {/* Carte Contact Direct */}
              <div className="p-8 rounded-3xl bg-rolex-dark text-white border border-gold/40 shadow-2xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rolex border border-gold flex items-center justify-center text-gold shadow-gold-glow">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-white">Conseil & Vente Automobile</h3>
                    <p className="text-xs text-gold">Ligne directe & prise en charge rapide</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block mb-0.5">Showroom & Bureau Commercial</strong>
                      {settings.address}<br />
                      Sur rendez-vous
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gold shrink-0" />
                    <div>
                      <strong className="text-white block mb-0.5">Ligne Téléphonique Directe</strong>
                      <a href={`tel:${settings.phoneRaw || '+33493000000'}`} className="text-gold-light hover:underline font-semibold">
                        {settings.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gold shrink-0" />
                    <div>
                      <strong className="text-white block mb-0.5">Courriel Électronique</strong>
                      <a href={`mailto:${settings.email}`} className="text-gold-light hover:underline">
                        {settings.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Bouton Appel Direct */}
                <div className="pt-2">
                  <a
                    href={`tel:${settings.phoneRaw || '+33493000000'}`}
                    className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-rolex hover:bg-rolex-600 text-gold border border-gold/40 text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-gold-glow/20"
                  >
                    <Phone className="w-4 h-4 animate-pulse" />
                    <span>Ligne Directe Équipe Commerciale</span>
                  </a>
                </div>
              </div>

              {/* Bloc Livraisons */}
              <div className="rounded-3xl overflow-hidden border border-slate-200 bg-surface shadow-sm p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-rolex-50 border border-rolex/30 text-rolex flex items-center justify-center mx-auto">
                  <MapPin className="w-6 h-6 text-rolex" />
                </div>
                <h4 className="font-serif font-bold text-slate-900 text-base">Livraison Sécurisée en France</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  Nos transporteurs partenaires acheminent votre véhicule directement à votre domicile ou lieu de livraison partout en France.
                </p>
                <div className="flex items-center justify-center gap-4 text-xs font-semibold text-rolex pt-2">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-gold" /> Transport Assuré</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-gold" /> Délais Respectés</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
