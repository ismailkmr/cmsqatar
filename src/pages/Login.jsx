import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLES } from '../contexts/AuthContext';
import { ShieldCheck, UserCheck, Calculator, UserCircle2 } from 'lucide-react';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to home
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleRoleLogin = (role) => {
    login(role);
    navigate('/');
  };

  const roleDefinitions = [
    {
      role: ROLES.ADMIN,
      desc: 'System-wide access and management',
      icon: <ShieldCheck size={36} className="text-blue-500" />
    },
    {
      role: ROLES.OWNER,
      desc: 'Full shop dashboard and compliance control',
      icon: <UserCheck size={36} className="text-purple-500" />
    },
    {
      role: ROLES.ACCOUNTANT,
      desc: 'Ledgers, Balance Sheet & Daybook tracking',
      icon: <Calculator size={36} className="text-green-500" />
    },
    {
      role: ROLES.STAFF,
      desc: 'Basic entry submission and photo uploads',
      icon: <UserCircle2 size={36} className="text-orange-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden dark:bg-black transition-colors duration-300">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <h2 className="mt-6 text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          CSMS Prototype
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Select a role to simulate login and test permissions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        <div className="glass-panel py-8 px-4 sm:px-10 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roleDefinitions.map((item) => (
              <button
                key={item.role}
                onClick={() => handleRoleLogin(item.role)}
                className="flex flex-col items-center text-center p-6 border border-gray-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 rounded-xl hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl dark:hover:shadow-indigo-900/20 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="p-3 rounded-full bg-gray-50 dark:bg-gray-900/50 mb-4 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {item.role}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
