import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const SettingsContext = createContext();

const SETTINGS_STORAGE_KEY = 'intercars_site_settings';

const defaultSettings = {
  phone: '+33 (0)4 93 00 00 00',
  phoneRaw: '+33493000000',
  email: 'contact@inter-cars-import.fr',
  notificationEmail: 'direction@intercarsimport.fr',
  address: "Showroom Commercial, Axe Cannes — Monaco",
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  // Charger depuis Supabase en temps réel
  useEffect(() => {
    const fetchRemoteSettings = async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', 'main_settings')
          .single();

        if (!error && data) {
          const remoteConfig = {
            phone: data.phone || defaultSettings.phone,
            phoneRaw: (data.phone || defaultSettings.phone).replace(/[^0-9+]/g, ''),
            email: data.email || defaultSettings.email,
            notificationEmail: data.notification_email || defaultSettings.notificationEmail,
            address: data.address || defaultSettings.address,
          };
          setSettings(remoteConfig);
          localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(remoteConfig));
        }
      } catch (err) {
        console.warn('Failed to load settings from Supabase:', err);
      }
    };

    fetchRemoteSettings();
  }, []);

  const updateSettings = async (newSettings) => {
    const updated = {
      ...settings,
      ...newSettings,
      phoneRaw: newSettings.phone ? newSettings.phone.replace(/[^0-9+]/g, '') : settings.phoneRaw,
    };
    setSettings(updated);

    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignorer
    }

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('site_settings')
          .upsert({
            id: 'main_settings',
            phone: updated.phone,
            email: updated.email,
            notification_email: updated.notificationEmail,
            address: updated.address,
            updated_at: new Date().toISOString()
          });
      } catch (err) {
        console.warn('Failed to persist settings to Supabase:', err);
      }
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
