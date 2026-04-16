import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth, ROLES } from '../contexts/AuthContext';
import { CalendarClock, UserPlus, Info, X, Check, Upload, Loader2, Trash2, Search } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

// Register AG Grid modules

ModuleRegistry.registerModules([AllCommunityModule]);

export default function Employees() {
  const { uploadBill } = useData();
  const { hasAccess } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const canEdit = hasAccess([ROLES.ADMIN, ROLES.OWNER]);
  const currentDate = new Date();

  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    status: 'Active',
    joinDate: '',
    idExpiry: '',
    password: '',
    qatarId: '',
    visaExpiry: '',
    nationality: '',
    passportNumber: ''
  });

  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/employees`);
      const result = await response.json();
      if (result.success) {
        setEmployees(result.data);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cell Renderer for Employee Name & Avatar
  const EmployeeRenderer = (params) => (
    <div className="flex items-center gap-3 py-1">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center font-bold text-gray-500 dark:text-gray-400 shrink-0 shadow-sm border border-white dark:border-gray-800">
        {params.data.name.charAt(0)}
      </div>
      <span className="font-semibold text-gray-900 dark:text-gray-200">{params.data.name}</span>
    </div>
  );

  // Cell Renderer for Status Badge
  const StatusRenderer = (params) => (
    <div className="py-2">
      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${params.value === 'Active'
        ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30'
        : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
      }`}>
        {params.value}
      </span>
    </div>
  );

  // Cell Renderer for Expiry Status
  const ExpiryRenderer = (params) => {
    const idExpiry = params.data.id_expiry || params.data.idExpiry;
    if (!idExpiry) return <span className="text-gray-400">N/A</span>;
    
    const expiryDate = new Date(idExpiry);
    const isExpired = expiryDate < currentDate;
    const isExpiringSoon = !isExpired && (expiryDate - currentDate) / (1000 * 60 * 60 * 24) < 30;

    return (
      <div className="flex items-center gap-2 py-1">
        {isExpired && <CalendarClock size={16} className="text-red-500" />}
        {isExpiringSoon && <CalendarClock size={16} className="text-yellow-500" />}
        {(!isExpired && !isExpiringSoon) && <CalendarClock size={16} className="text-green-500" />}
        <div className="flex flex-col leading-tight">
          <span className={`text-xs font-medium ${isExpired ? 'text-red-600 dark:text-red-400' : isExpiringSoon ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300'}`}>
            {isExpired ? 'Expired' : isExpiringSoon ? 'Expiring Soon' : 'Valid'}
          </span>
          <span className="text-[10px] text-gray-500">{idExpiry}</span>
        </div>
      </div>
    );
  };

  // Cell Renderer for Actions
  const ActionsRenderer = (params) => (
    <div className="flex justify-end gap-1 py-1">
      <label
        title="Upload Bill"
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${uploadingId === params.data.id
          ? 'text-purple-400 bg-purple-50 dark:bg-purple-900/20'
          : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20'
        }`}
      >
        {uploadingId === params.data.id ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
        <input
          type="file"
          className="hidden"
          onChange={(e) => handleUploadBill(params.data.id, e.target.files[0])}
          accept="image/*,.pdf"
          disabled={uploadingId === params.data.id}
        />
      </label>
      <button
        onClick={async () => {
          if (window.confirm('Delete this employee?')) {
            try {
              const response = await fetch(`${import.meta.env.VITE_API_URL}/api/employees/${params.data.id}`, {
                method: 'DELETE'
              });
              const result = await response.json();
              if (result.success) {
                fetchEmployees();
              } else {
                alert('Failed to delete: ' + result.message);
              }
            } catch (err) {
              console.error('Error deleting employee:', err);
              alert('Error deleting employee from database');
            }
          }
        }}
        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
      >
        <Trash2 size={16} />
      </button>
      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
        <Info size={16} />
      </button>
    </div>
  );

  const columnDefs = [
    { field: 'name', headerName: 'Employee', cellRenderer: EmployeeRenderer, flex: 2, minWidth: 200 },
    { field: 'position', headerName: 'Position', flex: 1.5, minWidth: 150 },
    { field: 'status', headerName: 'Status', cellRenderer: StatusRenderer, flex: 1, minWidth: 100 },
    { field: 'join_date', headerName: 'Join Date', flex: 1, minWidth: 120, valueGetter: p => p.data.join_date || p.data.joinDate },
    { headerName: 'ID Expiry Status', cellRenderer: ExpiryRenderer, flex: 1.5, minWidth: 150 },
    { headerName: 'Action', cellRenderer: ActionsRenderer, width: 140, sortable: false, filter: false, pinned: 'right' }
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    suppressMovable: true,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (formData.name && formData.position) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/employees`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const result = await response.json();

        if (result.success) {
          setIsAdding(false);
          setFormData({
            name: '', position: '', status: 'Active', joinDate: '', idExpiry: '', password: '',
            qatarId: '', visaExpiry: '', nationality: '', passportNumber: ''
          });
          fetchEmployees();
        } else {
          alert('Failed to save employee: ' + result.message);
        }
      } catch (err) {
        console.error('Error saving employee:', err);
        alert('An error occurred while saving the employee.');
      }
    }
  };

  const handleUploadBill = async (employeeId, file) => {
    if (!file) return;
    setUploadingId(employeeId);

    const formData = new FormData();
    formData.append('bill', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json().catch(() => ({ 
        success: false, 
        message: 'Server returned an invalid response. Please check server logs.' 
      }));

      if (result.success) {
        if (uploadBill) {
          uploadBill({
            employeeId,
            date: new Date().toISOString().split('T')[0],
            url: result.url,
            filename: result.filename,
            description: `Employee ${employeeId} bill upload`
          });
        }
        alert('Bill uploaded successfully!');
      } else {
        alert('Upload failed: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Network error or server unavailable. Please ensure the backend is running and reachable.');
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employees</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage staff and track document expiry.</p>
        </div>
      </div>
      <div className="flex justify-between items-center bg-white/50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 backdrop-blur-sm gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none dark:text-white transition-all"
          />
        </div>
        {canEdit && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-sm shadow-purple-600/20 hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <UserPlus size={18} />
            <span>Add Employee</span>
          </button>
        )}
      </div>

      {isAdding && (
        <div className="glass-panel p-6 rounded-2xl shadow-lg border border-purple-100 dark:border-purple-900/50 bg-white/50 dark:bg-gray-800/50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">New Employee Details</h3>
            <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position</label>
              <input type="text" name="position" required value={formData.position} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" placeholder="Cashier" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Join Date</label>
              <input type="date" name="joinDate" value={formData.joinDate} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ID Expiry Date</label>
              <input type="date" name="idExpiry" value={formData.idExpiry} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Qatar ID</label>
              <input type="text" name="qatarId" value={formData.qatarId} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" placeholder="290..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nationality</label>
              <input type="text" name="nationality" value={formData.nationality} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" placeholder="Indian" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Passport Number</label>
              <input type="text" name="passportNumber" value={formData.passportNumber} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" placeholder="L..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Password</label>
              <input type="password" name="password" required value={formData.password} onChange={handleInputChange} className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white" placeholder="Staff Login Password" />
            </div>
            <div className="lg:col-span-3 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
              <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-2 rounded-xl transition shadow-md shadow-purple-500/20">
                <Check size={18} />
                <span>Save Employee</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel overflow-hidden rounded-2xl shadow-sm border border-orange-100 dark:border-orange-900/30">
        <div className="ag-theme-alpine w-full h-[600px] dark:ag-theme-alpine-dark">
          <AgGridReact
            rowData={employees}
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
    </div>
  );
}

