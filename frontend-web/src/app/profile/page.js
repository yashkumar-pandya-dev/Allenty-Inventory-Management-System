"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { LogOut, ChevronRight, Bell, Moon, Sun, Loader } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Profile() {
  const router = useRouter();
  const { isDark, toggleDark } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get('http://localhost:8000/api/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/');
  };

  const roleName = user?.is_superuser ? 'Super Admin' : user?.is_staff ? 'Staff' : 'Warehouse Manager';

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile & Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Profile card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
            Profile Information
          </h3>
          {loading ? (
            <div className="flex items-center justify-center py-12 text-gray-400">
              <Loader size={24} className="animate-spin mr-2" /> Loading...
            </div>
          ) : (
            <>
              <div className="flex items-center mb-8">
                <div className="w-20 h-20 rounded-full bg-blue-900 text-white flex items-center justify-center text-2xl font-bold mr-6 shadow-inner">
                  {user?.initials || '??'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.full_name || user?.username}</h2>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold">{roleName}</p>
                </div>
              </div>
              <div className="space-y-4">
                {[['Username', user?.username], ['Email', user?.email || '—'], ['Employee ID', user?.id ? `#${user.id}` : '—']].map(([label, val]) => (
                  <div key={label} className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">{label}</span>
                    <span className="text-gray-900 dark:text-white font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="space-y-8">
          {/* Settings card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
              Account Settings
            </h3>

            <button onClick={() => router.push('/forgot-password')} className="w-full">
              <div className="flex justify-between items-center py-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-2 transition-colors -mx-2">
                <span className="font-semibold text-gray-900 dark:text-white">Change Password</span>
                <ChevronRight className="text-gray-400" size={20} />
              </div>
            </button>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4 mt-6 mb-4">
              Preferences
            </h3>

            {/* Notifications toggle */}
            <div className="flex justify-between items-center py-4 border-b border-gray-50 dark:border-gray-800">
              <div className="flex items-start">
                <Bell className="text-gray-400 mr-3 mt-0.5" size={20} />
                <div>
                  <span className="block font-semibold text-gray-900 dark:text-white">Notifications</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Receive stock alerts</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Dark mode toggle — wired to ThemeContext, works app-wide */}
            <div className="flex justify-between items-center py-4">
              <div className="flex items-start">
                {isDark
                  ? <Sun className="text-gray-400 mr-3 mt-0.5" size={20} />
                  : <Moon className="text-gray-400 mr-3 mt-0.5" size={20} />
                }
                <div>
                  <span className="block font-semibold text-gray-900 dark:text-white">Dark Mode</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {isDark ? 'Currently on — click to switch to light' : 'Currently off — click to switch to dark'}
                  </span>
                </div>
              </div>
              {/* This toggle is wired to toggleDark() — same function as sidebar */}
              <button
                onClick={toggleDark}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isDark ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
                aria-label="Toggle dark mode"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    isDark ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* App info + logout */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
              App Information
            </h3>
            {[['Version', '1.0.0'], ['Build', '2025.11.10']].map(([label, val]) => (
              <div key={label} className="flex justify-between items-center py-3">
                <span className="text-gray-500 dark:text-gray-400 font-medium">{label}</span>
                <span className="text-gray-900 dark:text-white font-semibold">{val}</span>
              </div>
            ))}
            <button
              onClick={handleLogout}
              className="w-full mt-6 bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900 font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center"
            >
              <LogOut size={20} className="mr-2" /> Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
