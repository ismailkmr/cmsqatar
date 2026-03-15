import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth, ROLES } from '../contexts/AuthContext';
import { FileBadge, BellRing, UploadCloud } from 'lucide-react';

export default function Compliance() {
  const { licenses } = useData();
  const { hasAccess } = useAuth();
  
  const [simulating, setSimulating] = useState(false);
  const canEdit = hasAccess([ROLES.ADMIN, ROLES.OWNER]);

  const handleSimulateAlert = () => {
    setSimulating(true);
    setTimeout(() => setSimulating(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Compliance & Licenses</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track statutory shop licenses and renewals.</p>
        </div>
        <div className="flex gap-3">
          {canEdit && (
            <button 
              onClick={handleSimulateAlert}
              disabled={simulating}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-yellow-500/20"
            >
              <BellRing size={18} className={simulating ? "animate-pulse" : ""} />
              <span>{simulating ? 'Sending SMS...' : 'Test Expiry SMS'}</span>
            </button>
          )}
          {canEdit && (
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-blue-600/20">
              <UploadCloud size={18} />
              <span>Upload License</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {licenses.map((license) => {
          let statusConfig = {
            bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
            text: 'text-green-700 dark:text-green-400',
            iconColor: 'text-green-500'
          };

          if (license.status === 'Locked' || license.status === 'Expired') {
            statusConfig = {
              bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
              text: 'text-red-700 dark:text-red-400',
              iconColor: 'text-red-500'
            };
          } else if (license.status === 'Expiring Soon') {
            statusConfig = {
              bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
              text: 'text-yellow-700 dark:text-yellow-400',
              iconColor: 'text-yellow-500'
            };
          }

          return (
            <div key={license.id} className="glass-panel p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${statusConfig.iconColor.replace('text-', 'bg-')}`}></div>
              
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl border ${statusConfig.bg}`}>
                  <FileBadge size={24} className={statusConfig.iconColor} />
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusConfig.bg} ${statusConfig.text}`}>
                  {license.status}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{license.name}</h3>
              <p className="text-sm font-mono text-gray-500 dark:text-gray-400 mb-4">{license.number}</p>
              
              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">Valid Until</span>
                <span className={`text-sm font-bold ${statusConfig.text}`}>
                  {license.expiryDate}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
