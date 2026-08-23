import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Save, CheckCircle2, Send } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';

export const SettingsManager = () => {
  const { settings, updateSettings } = useSettings();
  const { addToast } = useToast();

  const [formState, setFormState] = useState({
    phone: settings.phone || '+33 (0)4 93 00 00 00',
    email: settings.email || 'contact@intercarsimport.fr',
    notificationEmail: settings.notificationEmail || 'direction@intercarsimport.fr',
    whatsapp: settings.whatsapp || '+33 6 00 00 00 00',
    address: settings.address || "Showroom Commercial, Axe Cannes — Monaco",
    businessHours: settings.businessHours || "Du Lundi au Samedi : 08h30 - 19h30",
  });

  const [isTestingEmail, setIsTestingEmail] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(formState);
    addToast('Paramètres et coordonnées mis à jour sur tout le site !', 'success');
  };

  const handleTestNotification = () => {
    setIsTestingEmail(true);
    setTimeout(() => {
      setIsTestingEmail(false);
      addToast(`Email de test envoyé avec succès à : ${formState.notificationEmail}`, 'success');
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Bannière de Présentation */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rolex-forest to-rolex text-white border border-gold/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold text-rolex-950">
              Réglages Généraux
            </span>
            <span className="text-xs text-gold-light">Synchronisation instantanée</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-white">
            Coordonnées & Réception des Demandes
          </h3>
          <p className="text-xs text-slate-200 mt-1 max-w-xl font-light">
            Modifiez ici les coordonnées de contact affichées sur l'ensemble du site ainsi que l'adresse email de réception des nouveaux dossiers.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Grille des Coordonnées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bloc 1 : Téléphone & Ligne Directe */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-serif font-bold text-slate-900 text-sm flex items-center gap-2">
              <Phone className="w-4 h-4 text-rolex" /> Téléphone & Ligne Directe
            </h4>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Numéro de Téléphone Principal (En-tête, Pied de page & Bouton Flottant)
              </label>
              <input
                type="text"
                required
                name="phone"
                value={formState.phone}
                onChange={handleChange}
                placeholder="+33 (0)4 93 00 00 00"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-surface outline-none focus:border-rolex"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Ce numéro est cliquable et déclenche l'appel directement sur mobile et via le bouton d'appel flottant.
              </span>
            </div>
          </div>

          {/* Bloc 2 : Emails & Réception des Leads */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-serif font-bold text-slate-900 text-sm flex items-center gap-2">
              <Mail className="w-4 h-4 text-rolex" /> Adresses Email & Notifications
            </h4>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Email Public (Affiché aux visiteurs sur le site)
              </label>
              <input
                type="email"
                required
                name="email"
                value={formState.email}
                onChange={handleChange}
                placeholder="contact@intercarsimport.fr"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-surface outline-none focus:border-rolex"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Email de Réception des Formulaires & Devis (Interne) *
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  name="notificationEmail"
                  value={formState.notificationEmail}
                  onChange={handleChange}
                  placeholder="direction@intercarsimport.fr"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-surface outline-none focus:border-rolex"
                />
                <button
                  type="button"
                  onClick={handleTestNotification}
                  disabled={isTestingEmail}
                  className="px-3.5 py-2.5 rounded-xl bg-rolex-50 hover:bg-rolex text-rolex hover:text-gold border border-rolex/30 text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isTestingEmail ? 'Envoi...' : 'Tester'}</span>
                </button>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Chaque nouvelle demande soumise sur la page Contact est immédiatement adressée à cet email.
              </span>
            </div>
          </div>

          {/* Bloc 3 : Adresse Showroom & Horaires */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-serif font-bold text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rolex" /> Showroom & Disponibilités
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Adresse & Localisation Showroom
                </label>
                <input
                  type="text"
                  required
                  name="address"
                  value={formState.address}
                  onChange={handleChange}
                  placeholder="Showroom Privé & Bureau Sourcing, Axe Cannes — Monaco"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-surface outline-none focus:border-rolex"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Horaires d'Ouverture Commerciale
                </label>
                <input
                  type="text"
                  required
                  name="businessHours"
                  value={formState.businessHours}
                  onChange={handleChange}
                  placeholder="Du Lundi au Samedi : 08h30 - 19h30"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-surface outline-none focus:border-rolex"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bouton de Sauvegarde Général */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-xl bg-rolex hover:bg-rolex-600 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center gap-2 border border-gold/40"
          >
            <Save className="w-4 h-4 text-gold" />
            <span>Enregistrer tous les réglages</span>
          </button>
        </div>
      </form>
    </div>
  );
};
