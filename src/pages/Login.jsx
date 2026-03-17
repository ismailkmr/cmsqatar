import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLES } from '../contexts/AuthContext';
import { Lock, User } from 'lucide-react';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // If already logged in, redirect to home
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // Hardcoded credentials as requested
  const credentials = {
    'admin': { password: 'admin@123', role: ROLES.ADMIN },
    'owner': { password: 'owner@123', role: ROLES.OWNER },
    'accountant': { password: 'accountant@123', role: ROLES.ACCOUNTANT },
    'staff': { password: 'staff@123', role: ROLES.STAFF }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const lowerUsername = username.toLowerCase();
    const userRecord = credentials[lowerUsername];

    if (userRecord && userRecord.password === password) {
      login(userRecord.role);
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden dark:bg-black transition-colors duration-300">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <h2 className="mt-6 text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          CSMS Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Enter your credentials to access the system
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-panel py-8 px-4 sm:px-10 rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-2xl">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-md">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white transition-all outline-none"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white transition-all outline-none"
                  placeholder="admin@123"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-[1.02]"
              >
                Sign In
              </button>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Demo accounts: admin / owner / accountant / staff
                <br/>Password format: [role]@123
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
