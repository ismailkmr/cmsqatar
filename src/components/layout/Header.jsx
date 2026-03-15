import React, { useEffect, useState } from 'react';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 transition-colors duration-200">
      
      {/* Search Input Simulation */}
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg w-96 transition-colors">
        <Search size={18} className="text-gray-400" />
        <input 
          type="text" 
          placeholder="Search everywhere..." 
          className="bg-transparent border-none outline-none ml-2 w-full text-sm dark:text-gray-200 placeholder-gray-500"
        />
      </div>

      {/* Right Side Tools */}
      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 border-l border-gray-200 dark:border-gray-700 pl-4 ml-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 leading-tight">
              {user?.name || 'User'}
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              {user?.role || 'Guest'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
