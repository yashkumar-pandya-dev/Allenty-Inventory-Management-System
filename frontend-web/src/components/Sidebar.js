"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { LayoutDashboard, Package, AlertTriangle, User, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { isDark, toggleDark } = useTheme();
  const [user, setUser] = useState({ full_name: '', initials: '', email: '' });

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        const res = await axios.get('http://localhost:8000/api/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error('Could not load user info:', err);
      }
    };
    fetchMe();
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Inventory', icon: Package, path: '/inventory' },
    { name: 'Alerts', icon: AlertTriangle, path: '/alerts' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen sticky top-0 transition-colors duration-200">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <img src="/icon.png" alt="Allenty Logo" className="h-10 w-auto object-contain" />
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-medium uppercase tracking-wider">Manager Portal</p>
      </div>

      {/* Nav links only — no dark mode button here */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Dark mode toggle row — sits above the user card, not in nav */}
      

      {/* User card */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <Link
          href="/profile"
          className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm flex-shrink-0 text-sm group-hover:bg-blue-700 transition-colors">
            {user.initials || '??'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
              {user.full_name || 'Loading...'}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold truncate">{user.email}</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
