import React, { createContext, useContext, useState, useEffect } from 'react';
import { vehiclesService } from '../services/vehiclesService';
import { useToast } from './ToastContext';

const VehicleContext = createContext(null);

export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState(() => {
    return vehiclesService.getInitialSyncVehicles();
  });
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchVehicles = async () => {
    try {
      const data = await vehiclesService.getAllVehicles();
      if (Array.isArray(data)) {
        setVehicles(data);
      }
    } catch (err) {
      console.error('Failed to load vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const addVehicle = async (vehicleData) => {
    try {
      const created = await vehiclesService.addVehicle(vehicleData);
      setVehicles(prev => [created, ...prev.filter(v => String(v.id) !== String(created.id))]);
      addToast(`Véhicule "${created.title}" ajouté au catalogue avec succès !`, 'success');
      return { success: true, vehicle: created };
    } catch (err) {
      console.error('Add vehicle error:', err);
      addToast("Erreur lors de l'ajout du véhicule", 'error');
      return { success: false, error: "Une erreur est survenue lors de l'ajout du véhicule." };
    }
  };

  const updateVehicle = async (id, updates) => {
    try {
      const updated = await vehiclesService.updateVehicle(id, updates);
      setVehicles(prev => prev.map(v => (String(v.id) === String(id) ? updated : v)));
      addToast(`Véhicule mis à jour avec succès !`, 'success');
      return { success: true, vehicle: updated };
    } catch (err) {
      console.error('Update vehicle error:', err);
      addToast("Erreur lors de la mise à jour", 'error');
      return { success: false, error: 'Une erreur est survenue lors de la mise à jour du véhicule.' };
    }
  };

  const deleteVehicle = async (id) => {
    try {
      // 1. Mise à jour immédiate de l'interface
      setVehicles(prev => prev.filter(v => String(v.id) !== String(id)));
      
      // 2. Suppression définitive dans Supabase, IndexedDB et enregistrement anti-résurrection
      await vehiclesService.deleteVehicle(id);
      
      addToast('Véhicule définitivement retiré du catalogue', 'info');
      return { success: true };
    } catch (err) {
      console.error('Delete vehicle error:', err);
      addToast('Erreur lors de la suppression', 'error');
      return { success: false, error: 'Une erreur est survenue lors de la suppression du véhicule.' };
    }
  };

  return (
    <VehicleContext.Provider value={{ vehicles, loading, refreshVehicles: fetchVehicles, addVehicle, updateVehicle, deleteVehicle }}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicles = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicles must be used within a VehicleProvider');
  }
  return context;
};
