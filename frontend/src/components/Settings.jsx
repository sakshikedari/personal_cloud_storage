import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import API from "../api/axios";

const Settings = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 text-gray-800 dark:text-gray-100">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="mr-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
        <span className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          Settings
        </span>
      </div>


      <div className="mb-6">
        <div className="font-medium mb-2">Start page</div>
        <label className="flex items-center gap-2 mb-1 text-gray-700 dark:text-gray-200">
          <input
            type="radio"
            checked={settings.startPage === "home"}
            onChange={() => updateSettings("startPage", "home")}
          />
          Home
        </label>
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          <input
            type="radio"
            checked={settings.startPage === "mydrive"}
            onChange={() => updateSettings("startPage", "mydrive")}
          />
          My Drive
        </label>
      </div>
      <hr className="my-6 border-gray-200 dark:border-gray-700" />

      {/* Appearance */}
      <div className="mb-6">
        <div className="font-medium mb-2">Appearance</div>

        <label className="flex items-center gap-2 mb-1 text-gray-700 dark:text-gray-200">
          <input
            type="radio"
            name="appearance"
            value="light"
            checked={settings.appearance === "light"}
            onChange={(e) => updateSettings("appearance", e.target.value)}
          />
          Light
        </label>

        <label className="flex items-center gap-2 mb-1 text-gray-700 dark:text-gray-200">
          <input
            type="radio"
            name="appearance"
            value="dark"
            checked={settings.appearance === "dark"}
            onChange={(e) => updateSettings("appearance", e.target.value)}
          />
          Dark
        </label>

        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          <input
            type="radio"
            name="appearance"
            value="device"
            checked={settings.appearance === "device"}
            onChange={(e) => updateSettings("appearance", e.target.value)}
          />
          Device default
        </label>
      </div>
      <hr className="my-6 border-gray-200 dark:border-gray-700" />

      {/* Density */}
      <div className="mb-6">
        <div className="font-medium mb-2">Density</div>
        <label className="flex items-center gap-2 mb-1 text-gray-700 dark:text-gray-200">
          <input
            type="radio"
            checked={settings.density === "comfortable"}
            onChange={() => updateSettings("density", "comfortable")}
          />
          Comfortable
        </label>
        <label className="flex items-center gap-2 mb-1 text-gray-700 dark:text-gray-200">
          <input
            type="radio"
            checked={settings.density === "cosy"}
            onChange={() => updateSettings("density", "cosy")}
          />
          Cosy
        </label>
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          <input
            type="radio"
            checked={settings.density === "compact"}
            onChange={() => updateSettings("density", "compact")}
          />
          Compact
        </label>
      </div>
      <hr className="my-6 border-gray-200 dark:border-gray-700" />

      {/* Open PDFs */}
      <div className="mb-6">
        <div className="font-medium mb-2">Open PDFs</div>
        <label className="flex items-center gap-2 mb-1 text-gray-700 dark:text-gray-200">
          <input
            type="radio"
            checked={settings.openPDFs === "newtab"}
            onChange={() => updateSettings("openPDFs", "newtab")}
          />
          New tab
        </label>
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          <input
            type="radio"
            checked={settings.openPDFs === "preview"}
            onChange={() => updateSettings("openPDFs", "preview")}
          />
          Preview
        </label>
      </div>
      <hr className="my-6 border-gray-200 dark:border-gray-700" />

      {/* Uploads */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          <input
            type="checkbox"
            checked={settings.convertUploads}
            onChange={() =>
              updateSettings("convertUploads", !settings.convertUploads)
            }
          />
          Convert uploads to Google Docs editor format
        </label>
      </div>
      <hr className="my-6 border-gray-200 dark:border-gray-700" />

      {/* Offline */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          <input
            type="checkbox"
            checked={settings.offline}
            onChange={() => updateSettings("offline", !settings.offline)}
          />
          Create, open and edit your recent files while offline
        </label>
        <div className="text-xs text-gray-500 dark:text-gray-400 ml-6">
          Not recommended on public or shared computers.
        </div>
      </div>
      <hr className="my-6 border-gray-200 dark:border-gray-700" />

      {/* Preview cards */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          <input
            type="checkbox"
            checked={settings.previewCards}
            onChange={() =>
              updateSettings("previewCards", !settings.previewCards)
            }
          />
          Show details card when hovering on a file or folder icon
        </label>
      </div>
      <hr className="my-6 border-gray-200 dark:border-gray-700" />

      {/* Sounds */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          <input
            type="checkbox"
            checked={settings.sounds}
            onChange={() => updateSettings("sounds", !settings.sounds)}
          />
          Allow sounds for navigation actions, like loading, file not found, etc.
        </label>
      </div>
    </div>
  );
};

export default Settings;
