import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const SettingsContext = createContext();

const DEFAULTS = {
  startPage: "home",
  appearance: "light", 
  density: "comfortable",
  openPDFs: "preview",
  convertUploads: false,
  offline: false,
  previewCards: true,
  sounds: true,
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("settings");
      return saved ? JSON.parse(saved) : DEFAULTS;
    } catch (e) {
      return DEFAULTS;
    }
  });

  const mediaRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem("settings", JSON.stringify(settings));
    } catch (e) {
      console.warn("Could not save settings:", e);
    }
  }, [settings]);

  useEffect(() => {
    const applyDark = () => document.documentElement.classList.add("dark");
    const removeDark = () => document.documentElement.classList.remove("dark");

    if (mediaRef.current) {
      const m = mediaRef.current;
      if (m.removeEventListener) m.removeEventListener("change", m._handler);
      else m.removeListener && m.removeListener(m._handler);
      mediaRef.current = null;
    }

    if (settings.appearance === "dark") {
      applyDark();
    } else if (settings.appearance === "light") {
      removeDark();
    } else if (settings.appearance === "device") {
      const m = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (ev) => {
        if (ev.matches) applyDark();
        else removeDark();
      };
      if (m.matches) applyDark();
      else removeDark();

      if (m.addEventListener) m.addEventListener("change", handler);
      else m.addListener && m.addListener(handler);
      m._handler = handler;
      mediaRef.current = m;
    }

    return () => {
    };
  }, [settings.appearance]);

  const updateSettings = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return ctx;
};
