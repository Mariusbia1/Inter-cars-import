import React, { createContext, useContext, useState, useEffect } from 'react';
import { vehiclesService } from '../services/vehiclesService';
import { useToast } from './ToastContext';

const VehicleContext = createContext(null);

export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehiclesService.getAllVehicles();
      setVehicles(data);
    } catch (err) {
      console.error('Failed to load vehicles', err);
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
      setVehicles(prev => [created, ...prev]);
      addToast(`Véhicule "${created.title}" ajouté au catalogue avec succès !`, 'success');
      return { success: true, vehicle: created };
    } catch (err) {
      addToast("Erreur lors de l'ajout du véhicule", 'error');
      return { success: false, error: err.message };
    }
  };

  const updateVehicle = async (id, updates) => {
    try {
      const updated = await vehiclesService.updateVehicle(id, updates);
      setVehicles(prev => prev.map(v => (v.id === id ? updated : v)));
      addToast(`Véhicule mis à jour avec succès !`, 'success');
      return { success: true, vehicle: updated };
    } catch (err) {
      addToast("Erreur lors de la mise à jour", 'error');
      return { success: false, error: err.message };
    }
  };

  const deleteVehicle = async (id) => {
    try {
      await vehiclesService.deleteVehicle(id);
      setVehicles(prev => prev.filter(v => v.id !== id));
      addToast('Véhicule retiré du catalogue', 'info');
      return { success: true };
    } catch (err) {
      addToast('Erreur lors de la suppression', 'error');
      return { success: false, error: err.message };
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
