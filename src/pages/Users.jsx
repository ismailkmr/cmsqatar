import React, { useState, useEffect } from 'react';
import { useAuth, ROLES } from '../contexts/AuthContext';
import { User, Shield, Mail, Loader2, AlertCircle, Search } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

export default function Users() {
  const { hasAccess } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  const isAdmin = hasAccess([ROLES.ADMIN]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get token from localStorage as requested
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setUsers(result.data);
      } else {
        setError(result.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Cell Renderer for User Info
  const UserInfoRenderer = (params) => (
    <div className="flex items-center gap-4 py-1">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md shrink-0">
        {params.data.name ? params.data.name.charAt(0) : params.data.email.charAt(0).toUpperCase()}
      </div>
      <div className="flex flex-col leading-tight overflow-hidden">
        <span className="font-semibold text-gray-900 dark:text-white truncate">{params.data.name || 'N/A'}</span>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
          <Mail size={10} />
          <span className="truncate">{params.data.email}</span>
        </div>
      </div>
    </div>
  );

  // Cell Renderer for Role Badge
  const RoleRenderer = (params) => (
    <div className="py-3">
      <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-lg text-xs font-bold border ${
        params.value === 'Admin' 
        ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' 
        : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
      }`}>
        <Shield size={12} />
        {params.value}
      </span>
    </div>
  );

  const columnDefs = [
    { field: 'email', headerName: 'User', cellRenderer: UserInfoRenderer, flex: 2, minWidth: 200 },
    { field: 'role', headerName: 'Role', cellRenderer: RoleRenderer, flex: 1, minWidth: 120 },
    { field: 'id', headerName: 'ID', width: 100, pinned: 'right', valueFormatter: p => `#${p.value}`, cellStyle: { fontFamily: 'monospace', color: '#9ca3af' } }
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    suppressMovable: true,
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertCircle size={48} className="text-red-500" />
        <h2 className="text-xl font-semibold dark:text-white">Access Denied</h2>
        <p className="text-gray-500">Only administrators can view the user list.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">System Users</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage application users and their access levels.</p>
        </div>
      </div>
      <div className="flex justify-between items-center bg-white/50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 backdrop-blur-sm gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all"
          />
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-400">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={fetchUsers} className="ml-auto underline font-medium">Retry</button>
        </div>
      ) : (
        <div className="glass-panel overflow-hidden rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="ag-theme-alpine w-full h-[600px] dark:ag-theme-alpine-dark">
            <AgGridReact
              rowData={users}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              quickFilterText={searchText}
              animateRows={true}
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={[10, 20, 50]}
              loading={loading}
              onGridReady={(params) => params.api.sizeColumnsToFit()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
