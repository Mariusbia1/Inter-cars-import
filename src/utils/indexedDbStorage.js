// Module de stockage local haute capacité via IndexedDB (aucune limite 5MB de localStorage)

const DB_NAME = 'InterCarsDB';
const DB_VERSION = 1;
const STORE_VEHICLES = 'vehicles';
const STORE_IMAGES = 'vehicle_images';

const openDB = () => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      return reject(new Error('IndexedDB non supporté'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_VEHICLES)) {
        db.createObjectStore(STORE_VEHICLES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_IMAGES)) {
        db.createObjectStore(STORE_IMAGES, { keyPath: 'vehicleId' });
      }
    };
  });
};

export const idbSaveVehicle = async (vehicle) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_VEHICLES], 'readwrite');
      const store = tx.objectStore(STORE_VEHICLES);
      store.put(vehicle);
      tx.oncomplete = () => resolve(vehicle);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB save failed, fallback in memory', err);
    return vehicle;
  }
};

export const idbGetAllVehicles = async () => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_VEHICLES], 'readonly');
      const store = tx.objectStore(STORE_VEHICLES);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IndexedDB getAll failed', err);
    return [];
  }
};

export const idbGetVehicleById = async (id) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_VEHICLES], 'readonly');
      const store = tx.objectStore(STORE_VEHICLES);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IndexedDB get failed', err);
    return null;
  }
};

export const idbDeleteVehicle = async (id) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_VEHICLES], 'readwrite');
      const store = tx.objectStore(STORE_VEHICLES);
      store.delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB delete failed', err);
    return false;
  }
};
