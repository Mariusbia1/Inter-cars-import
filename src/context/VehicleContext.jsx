import React, { createContext, useContext, useState, useEffect } from 'react';
import { vehiclesService } from '../services/vehiclesService';
import { useToast } from './ToastContext';

const VehicleContext = createContext(null);

export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await vehiclesService.getAllVehicles();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load vehicles from Supabase:', err);
      addToast('Impossible de charger les véhicules depuis la base de données', 'error');
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
      setVehicles((prev) => [created, ...prev.filter((v) => v.id !== created.id)]);
      addToast(`Véhicule "${created.title}" enregistré dans la base de données !`, 'success');
      return { success: true, vehicle: created };
    } catch (err) {
      console.error('Add vehicle error:', err);
      const msg = err.message || "Erreur lors de l'enregistrement du véhicule.";
      addToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const updateVehicle = async (id, updates) => {
    try {
      const updated = await vehiclesService.updateVehicle(id, updates);
      setVehicles((prev) => prev.map((v) => (v.id === id ? updated : v)));
      addToast(`Véhicule mis à jour dans la base de données !`, 'success');
      return { success: true, vehicle: updated };
    } catch (err) {
      console.error('Update vehicle error:', err);
      const msg = err.message || 'Erreur lors de la mise à jour du véhicule.';
      addToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const deleteVehicle = async (id) => {
    try {
      await vehiclesService.deleteVehicle(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      addToast('Véhicule supprimé de la base de données', 'info');
      return { success: true };
    } catch (err) {
      console.error('Delete vehicle error:', err);
      const msg = err.message || 'Erreur lors de la suppression du véhicule.';
      addToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const seedVehicles = async () => {
    try {
      setLoading(true);
      const seeded = await vehiclesService.seedDemoVehicles();
      setVehicles(seeded);
      addToast('Véhicules de démonstration insérés dans Supabase !', 'success');
      return { success: true };
    } catch (err) {
      console.error('Seed error:', err);
      addToast("Erreur lors de l'insertion des modèles de démo", 'error');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        loading,
        refreshVehicles: fetchVehicles,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        seedVehicles
      }}
    >
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
