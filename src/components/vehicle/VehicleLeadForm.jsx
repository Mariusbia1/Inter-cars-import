import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, Lock, Phone, Mail, User, MapPin, Sparkles } from 'lucide-react';
import { useLeads } from '../../context/LeadsContext';
import { useToast } from '../../context/ToastContext';
import { Link } from 'react-router-dom';

export const VehicleLeadForm = ({ vehicle, selectedColor, formRef }) => {
  const { addLead } = useLeads();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    deliveryCity: '',
    fundingType: 'Comptant', // 'Comptant' | 'Financement / LOA' | 'Avec Reprise'
    message: '',
    privacyAccepted: false
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.privacyAccepted) {
      addToast('Veuillez accepter la politique de confidentialité pour continuer.', 'error');
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone) {
      addToast('Veuillez renseigner votre nom, email et numéro de téléphone.', 'error');
      return;
    }

    setLoading(true);

    try {
      const leadPayload = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        brand_sought: vehicle?.brand || 'Non spécifié',
        model_sought: vehicle?.title || vehicle?.model || 'Véhicule en vitrine',
        vehicle_type: vehicle?.category || 'Sportive & Prestige',
        fuel_type: vehicle?.fuel_type || 'Essence / Hybride',
        delivery_city: formData.deliveryCity || vehicle?.delivery_city || 'France',
        budget_max: vehicle?.price || null,
        preferred_timeline: 'Immédiat / Moins de 15 jours',
        message: `Demande de devis détaillé pour : ${vehicle?.title} (${vehicle?.year || 2023}) - Couleur souhaitée : ${selectedColor?.name || 'Standard'}. Mode d'acquisition : ${formData.fundingType}. ${formData.message ? `Commentaire : ${formData.message}` : ''}`,
        status: 'new'
      };

      const result = await addLead(leadPayload);

      if (result.success) {
        setSubmitted(true);
        addToast('Votre demande de devis a été transmise avec succès !', 'success');
      } else {
        addToast(result.error || 'Erreur lors de la transmission.', 'error');
      }
    } catch (err) {
      console.error('Lead submission error:', err);
      addToast("Une erreur est survenue lors de l'envoi de votre demande.", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={formRef} id="quote-form-section" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-rolex/5 rounded-full blur-3xl -z-0 pointer-events-none" />

      {submitted ? (
        <div className="text-center py-12 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-slate-900">
            Demande de Devis Envoyée !
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Merci <strong>{formData.fullName}</strong>. Un conseiller commercial dédié d'Inter Cars Import va vous contacter sous <strong>2h ouvrées</strong> avec la proposition détaillée pour ce <strong>{vehicle?.title}</strong>.
          </p>
          <div className="pt-4">
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  fullName: '',
                  email: '',
                  phone: '',
                  deliveryCity: '',
                  fundingType: 'Comptant',
                  message: '',
                  privacyAccepted: false
                });
              }}
              className="text-xs font-bold text-rolex hover:underline uppercase tracking-wider"
            >
              Envoyer une autre demande
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 relative z-10">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gold bg-rolex px-3 py-1 rounded-md inline-block mb-2">
              Devis Gratuit & Sans Engagement
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Recevez l'Offre Clé en Main pour ce Véhicule
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Remplissez ce formulaire pour recevoir le dossier complet (audit 150 points, historique, photos HD et conditions de livraison).
            </p>
          </div>

          {/* Récapitulatif Véhicule Sélectionné */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <img
                src={vehicle?.image_url}
                alt={vehicle?.title}
                className="w-16 h-11 object-cover rounded-md border border-slate-200 shrink-0"
              />
              <div>
                <span className="font-bold text-slate-900 block text-sm">{vehicle?.title}</span>
                <span className="text-slate-500">
                  {vehicle?.year} • {vehicle?.mileage?.toLocaleString('fr-FR')} km • Couleur : {selectedColor?.name || 'Standard'}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-base font-extrabold text-slate-900">
                {vehicle?.price ? vehicle.price.toLocaleString('fr-FR') + ' €' : '17 998 €'}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold block">Audit 150 pts Validé</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Nom & Prénom */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-rolex" /> Nom & Prénom *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="ex: Alexandre Dupont"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-rolex focus:ring-1 focus:ring-rolex outline-none transition-all"
                />
              </div>

              {/* Téléphone */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-rolex" /> Numéro de Téléphone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="ex: 06 12 34 56 78"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-rolex focus:ring-1 focus:ring-rolex outline-none transition-all"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-rolex" /> Adresse Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ex: alexandre.dupont@email.fr"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-rolex focus:ring-1 focus:ring-rolex outline-none transition-all"
                />
              </div>

              {/* Ville de livraison */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rolex" /> Ville de livraison souhaitée
                </label>
                <input
                  type="text"
                  value={formData.deliveryCity}
                  onChange={(e) => setFormData({ ...formData, deliveryCity: e.target.value })}
                  placeholder="ex: Lyon, Paris, Bordeaux..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-rolex focus:ring-1 focus:ring-rolex outline-none transition-all"
                />
              </div>
            </div>

            {/* Mode d'acquisition */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Mode d'acquisition envisagé :
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['Comptant', 'Financement / LOA', 'Avec Reprise'].map((mode) => (
                  <button
                    type="button"
                    key={mode}
                    onClick={() => setFormData({ ...formData, fundingType: mode })}
                    className={`py-2 px-3 rounded-lg font-medium transition-all text-center ${
                      formData.fundingType === mode
                        ? 'bg-rolex text-gold border border-gold/40 font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Message optionnel */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Précisions ou questions éventuelles (optionnel) :
              </label>
              <textarea
                rows="2"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="ex: Je souhaite connaître les délais exacts pour une livraison à domicile..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-rolex focus:ring-1 focus:ring-rolex outline-none transition-all resize-none"
              />
            </div>

            {/* Checkbox Politique de confidentialité (RGPD obligatoire) */}
            <div className="pt-2">
              <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={formData.privacyAccepted}
                  onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
                  className="mt-0.5 rounded border-slate-300 text-rolex focus:ring-rolex accent-rolex cursor-pointer shrink-0"
                />
                <span>
                  J'accepte que mes données soient traitées par Inter Cars Import afin de recevoir mon devis et d'être recontacté, conformément à la{' '}
                  <Link to="/confidentialite" target="_blank" className="text-rolex font-semibold underline hover:text-gold">
                    politique de confidentialité
                  </Link>.
                </span>
              </label>
            </div>

            {/* Bouton de soumission */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-lg bg-[#55a214] hover:bg-[#498e10] active:scale-[0.99] text-white font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-md flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>ENVOYER MA DEMANDE DE DEVIS</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center pt-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Vos données sont strictement confidentielles et protégées sous protocole sécurisé SSL 256-bit.</span>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
