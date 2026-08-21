import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

const SETTINGS_STORAGE_KEY = 'intercars_site_settings';

const defaultSettings = {
  phone: '+33 (0)4 93 00 00 00',
  phoneRaw: '+33493000000',
  email: 'contact@intercarsimport.fr',
  notificationEmail: 'direction@intercarsimport.fr',
  whatsapp: '+33 6 00 00 00 00',
  whatsappRaw: '33600000000',
  address: "Showroom Privé & Bureau Sourcing, Axe Cannes — Monaco",
  businessHours: "Du Lundi au Samedi : 08h30 - 20h00 (Ligne VIP 7j/7)",
  logoVariant: 'crest', // 'crest' | 'horology' | 'gt_wings' | 'seal_vip'
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch (e) {
      return defaultSettings;
    }
  });

  const updateSettings = (newSettings) => {
    const updated = {
      ...settings,
      ...newSettings,
      phoneRaw: newSettings.phone ? newSettings.phone.replace(/[^0-9+]/g, '') : settings.phoneRaw,
      whatsappRaw: newSettings.whatsapp ? newSettings.whatsapp.replace(/[^0-9]/g, '') : settings.whatsappRaw,
    };
    setSettings(updated);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save settings to localStorage', e);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
