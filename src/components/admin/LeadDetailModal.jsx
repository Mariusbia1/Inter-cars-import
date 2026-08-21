import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, Calendar, MapPin, CheckCircle2, MessageSquare, Send, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const LeadDetailModal = ({ lead, onClose, onUpdateStatus, onDelete }) => {
  if (!lead) return null;

  const { addToast } = useToast();
  const [currentStatus, setCurrentStatus] = useState(lead.status || 'Nouveau');
  const [adminNotes, setAdminNotes] = useState(lead.admin_notes || '');
  const [replyMessage, setReplyMessage] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  const handleSaveStatus = () => {
    onUpdateStatus(lead.id, currentStatus, adminNotes);
  };

  const handleSendSimulatedReply = (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setIsSendingReply(true);
    setTimeout(() => {
      setIsSendingReply(false);
      setReplyMessage('');
      addToast(`Email de proposition envoyé avec succès à ${lead.email} !`, 'success');
      setCurrentStatus('Devis envoyé');
      onUpdateStatus(lead.id, 'Devis envoyé', adminNotes + `\n[${new Date().toLocaleDateString()}] Proposition envoyée.`);
    }, 600);
  };

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
          className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-slate-200 my-8 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 bg-rolex-dark text-white border-b border-gold/30 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold text-rolex-950">
                  {lead.vehicle_type || 'Import'}
                </span>
                <span className="text-xs text-slate-300">
                  Reçu le {new Date(lead.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                {lead.full_name}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
            {/* Coordonnées */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-4 h-4 text-rolex shrink-0" />
                <a href={`mailto:${lead.email}`} className="hover:underline font-semibold">{lead.email}</a>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-rolex shrink-0" />
                <a href={`tel:${lead.phone}`} className="hover:underline font-semibold">{lead.phone}</a>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-rolex shrink-0" />
                <span>{lead.delivery_city || 'France (non spécifiée)'}</span>
              </div>
            </div>

            {/* Cahier des Charges Véhicule */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Cahier des Charges Véhicule
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-surface border border-slate-200">
                  <span className="text-slate-400 block mb-0.5">Marque & Modèle</span>
                  <strong className="text-slate-900 text-sm block">{lead.brand_sought} {lead.model_sought}</strong>
                </div>
                <div className="p-3 rounded-lg bg-surface border border-slate-200">
                  <span className="text-slate-400 block mb-0.5">Énergie & Boîte</span>
                  <strong className="text-slate-900 text-sm block">{lead.fuel_type || 'Essence'} / {lead.transmission || 'Auto'}</strong>
                </div>
                <div className="p-3 rounded-lg bg-surface border border-slate-200">
                  <span className="text-slate-400 block mb-0.5">Délai Souhaité</span>
                  <strong className="text-slate-900 text-sm block">{lead.preferred_timeline || 'Sous 30 jours'}</strong>
                </div>
              </div>

              {lead.message && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700">
                  <span className="text-slate-400 block mb-1 font-semibold">Exigences particulières & options :</span>
                  <p className="italic">"{lead.message}"</p>
                </div>
              )}
            </div>

            {/* Statut & Notes Internes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Statut du Lead
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold bg-white outline-none focus:border-rolex"
                >
                  <option value="Nouveau">Nouveau</option>
                  <option value="En cours">En cours de sourcing</option>
                  <option value="Devis envoyé">Devis & Dossier envoyé</option>
                  <option value="Clôturé">Clôturé / Livré</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Notes Internes Administrateur
                </label>
                <input
                  type="text"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="ex: Client rappelé, recherche en Allemagne lancée..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white outline-none focus:border-rolex"
                />
              </div>
            </div>

            {/* Simulateur de Réponse Email Rapide */}
            <div className="p-5 rounded-2xl bg-rolex-50 border border-rolex/20 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rolex flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" /> Réponse Rapide Conciergerie VIP
              </h4>
              <textarea
                rows={2}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder={`Bonjour ${lead.full_name}, nous avons identifié 2 opportunités conformes en Allemagne...`}
                className="w-full px-3 py-2 rounded-lg border border-rolex/30 text-xs bg-white outline-none focus:border-rolex resize-none"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSendSimulatedReply}
                  disabled={isSendingReply || !replyMessage.trim()}
                  className="px-4 py-2 rounded-lg bg-rolex hover:bg-rolex-600 text-white text-xs font-semibold uppercase tracking-wider disabled:opacity-50 transition-colors flex items-center gap-1.5"
                >
                  {isSendingReply ? 'Envoi...' : 'Envoyer la proposition'}
                </button>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => {
                if (window.confirm("Êtes-vous sûr de vouloir supprimer ce lead ?")) {
                  onDelete(lead.id);
                  onClose();
                }
              }}
              className="px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Supprimer
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold uppercase hover:bg-slate-100 transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  handleSaveStatus();
                  onClose();
                }}
                className="px-5 py-2 rounded-lg bg-rolex text-white text-xs font-semibold uppercase tracking-wider hover:bg-rolex-600 transition-colors shadow-sm"
              >
                Sauvegarder les modifications
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
