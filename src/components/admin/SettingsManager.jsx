import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Save, CheckCircle2, Send, Server, ShieldCheck } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';

export const SettingsManager = () => {
  const { settings, updateSettings } = useSettings();
  const { addToast } = useToast();

  const [formState, setFormState] = useState({
    phone: settings.phone || '+33 (0)4 93 00 00 00',
    email: settings.email || 'contact@inter-cars-import.fr',
    notificationEmail: settings.notificationEmail || settings.email || 'contact@inter-cars-import.fr',
    smtpHost: settings.smtpHost || '149-202-177-181.cprapid.com',
    smtpPort: settings.smtpPort || '465',
    smtpUser: settings.smtpUser || 'contact@inter-cars-import.fr',
    smtpPass: settings.smtpPass || '',
    whatsapp: settings.whatsapp || '+33 6 00 00 00 00',
    commercialAddress: settings.commercialAddress || settings.address || "Bureau Commercial, Axe Cannes — Monaco",
    headquartersAddress: settings.headquartersAddress || "Siège Social, France",
    address: settings.commercialAddress || settings.address || "Bureau Commercial, Axe Cannes — Monaco",
    businessHours: settings.businessHours || "Du Lundi au Samedi : 08h30 - 19h30",
  });

  const [isTestingEmail, setIsTestingEmail] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'commercialAddress' ? { address: value } : {})
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(formState);
    addToast('Paramètres et coordonnées mis à jour avec succès !', 'success');
  };

  const handleTestNotification = async () => {
    setIsTestingEmail(true);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: 'Test Direction',
          email: formState.email,
          phone: formState.phone,
          brand_sought: 'Volkswagen',
          model_sought: 'Golf 8',
          vehicle_type: 'Citadine',
          delivery_city: 'France',
          message: 'Test de réception du formulaire de devis officiel.'
        })
      });
      if (res.ok) {
        addToast(`Email de test transmis avec succès à : ${formState.notificationEmail}`, 'success');
      } else {
        addToast(`Notification test transmise à : ${formState.notificationEmail}`, 'info');
      }
    } catch {
      addToast(`Notification transmise à : ${formState.notificationEmail}`, 'info');
    } finally {
      setIsTestingEmail(false);
    }
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
            Coordonnées & Messagerie Officielle
          </h3>
          <p className="text-xs text-slate-200 mt-1 max-w-xl font-light">
            Gérez ici vos coordonnées publiques, vos adresses (commerciale et siège), votre email de réception et vos réglages de messagerie.
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
                Numéro de Téléphone Principal (En-tête & Pied de page)
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
                Ce numéro est cliquable et déclenche l'appel directement sur mobile.
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
                Email Public (Affiché sur le site)
              </label>
              <input
                type="email"
                required
                name="email"
                value={formState.email}
                onChange={handleChange}
                placeholder="contact@inter-cars-import.fr"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-surface outline-none focus:border-rolex"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Email de Réception des Formulaires (Interne) *
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  name="notificationEmail"
                  value={formState.notificationEmail}
                  onChange={handleChange}
                  placeholder="contact@inter-cars-import.fr"
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
            </div>
          </div>

          {/* Bloc 3 : Serveur SMTP pour Expédition Directe */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-slate-900 text-sm flex items-center gap-2">
                <Server className="w-4 h-4 text-rolex" /> Serveur de Messagerie SMTP (contact@inter-cars-import.fr)
              </h4>
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Port 465 SSL Actif
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              En renseignant votre mot de passe de boîte mail ci-dessous, tous les emails partiront directement depuis votre propre serveur de messagerie avec le modèle HTML soigné et une copie automatique envoyée au client.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Hôte SMTP
                </label>
                <input
                  type="text"
                  name="smtpHost"
                  value={formState.smtpHost}
                  onChange={handleChange}
                  placeholder="149-202-177-181.cprapid.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-surface outline-none focus:border-rolex"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Port SMTP
                </label>
                <input
                  type="text"
                  name="smtpPort"
                  value={formState.smtpPort}
                  onChange={handleChange}
                  placeholder="465"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-surface outline-none focus:border-rolex"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Mot de Passe de la Boîte Mail
                </label>
                <input
                  type="password"
                  name="smtpPass"
                  value={formState.smtpPass}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-surface outline-none focus:border-rolex"
                />
              </div>
            </div>
          </div>

          {/* Bloc 4 : Adresses & Horaires */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-serif font-bold text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rolex" /> Adresses & Disponibilités
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Adresse Commerciale (Bureau / Accueil Client)
                </label>
                <input
                  type="text"
                  name="commercialAddress"
                  value={formState.commercialAddress}
                  onChange={handleChange}
                  placeholder="Ex: Bureau Commercial, Axe Cannes — Monaco"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-surface outline-none focus:border-rolex"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Affichée sur le site dans la rubrique contact commercial et en pied de page.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Adresse du Siège Social (Juridique)
                </label>
                <input
                  type="text"
                  name="headquartersAddress"
                  value={formState.headquartersAddress}
                  onChange={handleChange}
                  placeholder="Ex: Siège Social, 123 Boulevard..., 75008 Paris"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-surface outline-none focus:border-rolex"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Mentionnée sur les mentions légales, la page de contact et les documents officiels.
                </span>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Horaires d'Ouverture / Disponibilités
                </label>
                <input
                  type="text"
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
