import { Moon, Sun } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useEffect } from 'react';

export function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useAppStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <button
      onClick={toggleDarkMode}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
    >
      {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
