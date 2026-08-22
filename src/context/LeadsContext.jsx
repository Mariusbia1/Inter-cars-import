import React, { createContext, useContext, useState, useEffect } from 'react';
import { leadsService } from '../services/leadsService';
import { useToast } from './ToastContext';

const LeadsContext = createContext(null);

export const LeadsProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await leadsService.getAllLeads();
      setLeads(data || []);
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const createLead = async (leadData) => {
    try {
      const res = await leadsService.createLead(leadData);
      const created = res.lead || res;
      setLeads(prev => [created, ...prev]);
      addToast('Votre demande a été transmise à notre conciergerie VIP avec succès !', 'success');
      return { success: true, lead: created };
    } catch (err) {
      console.error('Lead creation error:', err);
      addToast("Erreur lors de l'envoi de votre demande", 'error');
      return { success: false, error: 'Une erreur est survenue lors de la transmission de la demande.' };
    }
  };

  const updateLeadStatus = async (id, status, notes) => {
    try {
      const updates = { status };
      if (notes !== undefined) updates.admin_notes = notes;
      const updated = await leadsService.updateLead(id, updates);
      setLeads(prev => prev.map(l => (l.id === id ? updated : l)));
      addToast(`Statut du dossier actualisé en "${status}"`, 'info');
      return { success: true, lead: updated };
    } catch (err) {
      console.error('Lead update error:', err);
      addToast("Erreur lors de la mise à jour", 'error');
      return { success: false, error: 'Une erreur est survenue lors de la mise à jour du dossier.' };
    }
  };

  const deleteLead = async (id) => {
    try {
      await leadsService.deleteLead(id);
      setLeads(prev => prev.filter(l => l.id !== id));
      addToast('Dossier supprimé avec succès', 'info');
      return { success: true };
    } catch (err) {
      console.error('Lead deletion error:', err);
      addToast('Erreur lors de la suppression', 'error');
      return { success: false, error: 'Une erreur est survenue lors de la suppression du dossier.' };
    }
  };

  return (
    <LeadsContext.Provider value={{ leads, loading, refreshLeads: fetchLeads, createLead, updateLeadStatus, deleteLead }}>
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
};
