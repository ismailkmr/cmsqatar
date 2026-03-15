import React from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth, ROLES } from '../contexts/AuthContext';
import { CalendarClock, UserPlus, Info } from 'lucide-react';

export default function Employees() {
  const { employees } = useData();
  const { hasAccess } = useAuth();
  
  const canEdit = hasAccess([ROLES.ADMIN, ROLES.OWNER]);
  const currentDate = new Date();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employees</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage staff and track document expiry.</p>
        </div>
        {canEdit && (
          <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-purple-600/20">
            <UserPlus size={18} />
            <span>Add Employee</span>
          </button>
        )}
      </div>

      <div className="glass-panel p-1 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left bg-white dark:bg-gray-900">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-800">
                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employee</th>
                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Position</th>
                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Join Date</th>
                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID Expiry Status</th>
                <th className="p-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {employees.map((emp) => {
                const expiryDate = new Date(emp.idExpiry);
                const isExpired = expiryDate < currentDate;
                const isExpiringSoon = !isExpired && (expiryDate - currentDate) / (1000 * 60 * 60 * 24) < 30;

                return (
                  <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center font-bold text-gray-500 dark:text-gray-400 shrink-0 shadow-sm border border-white dark:border-gray-800">
                          {emp.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-gray-200">{emp.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{emp.position}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${
                        emp.status === 'Active' 
                          ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30' 
                          : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{emp.joinDate}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {isExpired && <CalendarClock size={16} className="text-red-500" />}
                        {isExpiringSoon && <CalendarClock size={16} className="text-yellow-500" />}
                        {(!isExpired && !isExpiringSoon) && <CalendarClock size={16} className="text-green-500" />}
                        
                        <div className="flex flex-col">
                          <span className={`text-sm font-medium ${isExpired ? 'text-red-600 dark:text-red-400' : isExpiringSoon ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            {isExpired ? 'Expired' : isExpiringSoon ? 'Expiring Soon' : 'Valid'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-500">{emp.idExpiry}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                        <Info size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
