import React from 'react';
import { Moon, Sun, Palette, Check } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

export default function ThemeCustomizer({ onClose }: { onClose: () => void }) {
  const { theme, setTheme, accentColor, setAccentColor } = useThemeStore();

  const themes = [
    { id: 'dark', name: 'Dark', icon: <Moon className="w-5 h-5" /> },
    { id: 'light', name: 'Light', icon: <Sun className="w-5 h-5" /> },
  ];

  const colors = [
    { id: 'purple', class: 'bg-purple-500' },
    { id: 'blue', class: 'bg-blue-500' },
    { id: 'green', class: 'bg-green-500' },
    { id: 'rose', class: 'bg-rose-500' },
    { id: 'amber', class: 'bg-amber-500' },
  ];

  return (
    <div className="bg-white/5 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Palette className="w-5 h-5 text-purple-300" />
        <h3 className="text-lg font-semibold text-white">Customize Theme</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-purple-200 mb-3">Theme Mode</label>
          <div className="grid grid-cols-2 gap-4">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                  theme === t.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/5 text-purple-300 hover:bg-white/10'
                }`}
              >
                {t.icon}
                <span>{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-purple-200 mb-3">Accent Color</label>
          <div className="flex gap-3">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() => setAccentColor(color.id)}
                className={`w-8 h-8 rounded-full ${color.class} flex items-center justify-center`}
              >
                {accentColor === color.id && (
                  <Check className="w-4 h-4 text-white" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}