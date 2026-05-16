import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Send, User, LogOut, X } from 'lucide-react';
import SafeLedgerLogo from './SafeLedgerLogo';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/transfer', name: 'Transfer', icon: Send },
    { path: '/profile', name: 'Profile', icon: User },
  ];
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm" onClick={toggleSidebar} />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-card border-r border-slate-200 dark:border-dark-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-dark-border">
          <div className="text-primary-600 dark:text-primary-400">
            <SafeLedgerLogo className="!gap-2" showText={false} />
          </div>
          <button type="button" onClick={toggleSidebar} className="lg:hidden text-slate-500"><X className="h-6 w-6" /></button>
        </div>
        <nav className="flex flex-col grow py-6 px-4 space-y-2 h-[calc(100vh-4rem)]">
          {menuItems.map((item) => (
            <NavLink key={item.path} to={item.path} onClick={() => window.innerWidth < 1024 && toggleSidebar()}
              className={({ isActive }) => `flex items-center px-4 py-3 text-sm font-medium rounded-xl ${isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <item.icon className="h-5 w-5 mr-3" />{item.name}
            </NavLink>
          ))}
          <button type="button" onClick={logout} className="mt-auto flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50">
            <LogOut className="h-5 w-5 mr-3" /> Logout
          </button>
        </nav>
      </aside>
    </>
  );
};
export default Sidebar;
