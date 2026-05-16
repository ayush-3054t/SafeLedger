import { Menu, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const dark =
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
    setIsDark(dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    document.documentElement.classList.toggle('dark', next);
    localStorage.theme = next ? 'dark' : 'light';
    setIsDark(next);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-b border-slate-200 dark:border-dark-border">
      <button
        type="button"
        onClick={toggleSidebar}
        className="p-2 lg:hidden text-slate-500 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-bg"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex items-center gap-3 ml-auto">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 text-slate-500 rounded-full hover:bg-slate-100 dark:hover:bg-dark-bg"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-dark-border">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
