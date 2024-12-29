import React from 'react';
import { useSettings, useAuth, Providers } from './providers';

function OptionsPage() {
  const { settings, updateSettings } = useSettings();
  const { user, login, logout } = useAuth();

  const handleThemeChange = (theme) => {
    updateSettings({ ...settings, theme });
  };

  const handleShortcutsChange = (enableShortcuts) => {
    updateSettings({ ...settings, enableShortcuts });
  };

  const handleLanguageChange = (language) => {
    updateSettings({ ...settings, language });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">EXOS Settings</h1>
          {user ? (
            <div className="flex items-center gap-4">
              <span>{user.email}</span>
              <button
                onClick={logout}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Login
            </button>
          )}
        </div>

        {/* Theme Settings */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Theme</h2>
          <div className="flex gap-4">
            <button
              onClick={() => handleThemeChange('light')}
              className={`px-4 py-2 rounded ${
                settings.theme === 'light'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`px-4 py-2 rounded ${
                settings.theme === 'dark'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              Dark
            </button>
          </div>
        </div>

        {/* Shortcuts Settings */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Shortcuts</h2>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.enableShortcuts}
              onChange={(e) => handleShortcutsChange(e.target.checked)}
              className="w-4 h-4"
            />
            Enable keyboard shortcuts
          </label>
        </div>

        {/* Language Settings */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Language</h2>
          <select
            value={settings.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="en">English</option>
            <option value="de">Deutsch</option>
            <option value="es">Español</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// Root component
function App() {
  return (
    <Providers>
      <OptionsPage />
    </Providers>
  );
}

export default App;
