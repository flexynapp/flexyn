import { THEMES, useTheme } from '@/lib/ThemeContext';
import { Check, Sun, Moon } from 'lucide-react';

export default function ThemePicker() {
  const { themeId, setThemeId, darkMode, setDarkMode } = useTheme();

  return (
    <div className="px-4 py-3 border-t border-border space-y-3">
      {/* Light / Dark toggle */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Appearance</p>
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setDarkMode(false)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${
              !darkMode ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> Light
          </button>
          <button
            onClick={() => setDarkMode(true)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${
              darkMode ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'
            }`}
          >
            <Moon className="w-3.5 h-3.5" /> Dark
          </button>
        </div>
      </div>

      {/* Color presets */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Color</p>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => setThemeId(theme.id)}
              className={`relative flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                themeId === theme.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:bg-secondary'
              }`}
            >
              <div className="flex gap-1">
                {theme.preview.map((color, i) => (
                  <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                ))}
              </div>
              <span className="text-xs font-medium leading-tight text-center truncate w-full">{theme.name}</span>
              {themeId === theme.id && (
                <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-2 h-2 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}