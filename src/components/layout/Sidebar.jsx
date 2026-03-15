import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth, ROLES } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  FileText, 
  Scale, 
  Receipt,
  LogOut
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout, hasAccess } = useAuth();

  const navItems = [
    {
      label: 'Dashboard',
      path: '/',
      icon: <LayoutDashboard size={20} />,
      roles: [ROLES.ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT]
    },
    {
      label: 'Day Book',
      path: '/daybook',
      icon: <BookOpen size={20} />,
      roles: [ROLES.ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT, ROLES.STAFF]
    },
    {
      label: 'Financials',
      path: '/financials',
      icon: <Scale size={20} />,
      roles: [ROLES.ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT]
    },
    {
      label: 'Employees',
      path: '/employees',
      icon: <Users size={20} />,
      roles: [ROLES.ADMIN, ROLES.OWNER]
    },
    {
      label: 'Compliance',
      path: '/compliance',
      icon: <FileText size={20} />,
      roles: [ROLES.ADMIN, ROLES.OWNER]
    },
    {
      label: 'Bills Storage',
      path: '/bills',
      icon: <Receipt size={20} />,
      roles: [ROLES.ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT, ROLES.STAFF]
    }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen transition-colors duration-200">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">CSMS Pro</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.filter(item => hasAccess(item.roles)).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
