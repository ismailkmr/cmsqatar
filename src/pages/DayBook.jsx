import React, { useState, useEffect } from 'react';
import { useAuth, ROLES } from '../contexts/AuthContext';
import { Plus, Trash2, Image as ImageIcon, CheckCircle2, Loader2, Upload, Search } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

export default function DayBook() {
  const { hasAccess, user } = useAuth();  
  const [daybookEntries, setDaybookEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'Income',
    category: '',
    amount: '',
    description: '',
  });
  const [uploadState, setUploadState] = useState({ text: 'Upload Photo/Bill', url: null, isUploading: false });
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchDaybook();
  }, []);

  const fetchDaybook = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/daybook`);
      const result = await response.json();
      if (result.success) {
        setDaybookEntries(result.data);
      } else {
        console.error('Failed to fetch daybook:', result.message);
      }
    } catch (err) {
      console.error('Error fetching daybook:', err);
    } finally {
      setLoading(false);
    }
  };

  const canEdit = hasAccess([ROLES.ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT]);

  // Cell Renderer for Type Badge
  const TypeRenderer = (params) => {
    const isIncome = params.data.income > 0 || params.data.type === 'Income';
    return (
      <div className="py-2">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
          isIncome 
            ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800/30' 
            : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800/30'
        }`}>
          {isIncome ? 'Income' : 'Expense'}
        </span>
      </div>
    );
  };

  // Cell Renderer for Amount
  const AmountRenderer = (params) => {
    const isIncome = params.data.income > 0 || params.data.type === 'Income';
    const amount = isIncome ? params.data.income : params.data.expense;
    return (
      <span className={`font-semibold ${isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {isIncome ? '+' : '-'}₹{amount}
      </span>
    );
  };

  // Cell Renderer for Receipt
  const ReceiptRenderer = (params) => {
    if (!params.value) return <span className="text-gray-400">-</span>;
    return (
      <div className="py-2">
        <a 
          href={params.value.startsWith('http') ? params.value : `${import.meta.env.VITE_API_URL}/uploads/${params.value}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-800/30 w-fit hover:bg-blue-100 transition-colors"
        >
          <ImageIcon size={10} /> View
        </a>
      </div>
    );
  };

  // Cell Renderer for Actions
  const ActionsRenderer = (params) => (
    <div className="flex justify-end gap-1 py-1">
      <button 
        onClick={async () => {
          if (window.confirm('Delete this entry?')) {
            try {
              const response = await fetch(`${import.meta.env.VITE_API_URL}/api/daybook/${params.data.id}`, {
                method: 'DELETE'
              });
              const result = await response.json();
              if (result.success) {
                fetchDaybook();
              } else {
                alert('Failed to delete: ' + result.message);
              }
            } catch (err) {
              console.error('Error deleting entry:', err);
              alert('Error deleting entry from database');
            }
          }
        }}
        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  const columnDefs = [
    { 
      field: 'txn_date', 
      headerName: 'Date', 
      flex: 1, 
      minWidth: 110,
      valueFormatter: p => p.value ? new Date(p.value).toLocaleDateString() : '-'
    },
    { headerName: 'Type', cellRenderer: TypeRenderer, width: 100 },
    { field: 'category', headerName: 'Category', flex: 1, minWidth: 120 },
    { field: 'description', headerName: 'Description', flex: 1.5, minWidth: 150 },
    { headerName: 'Amount', cellRenderer: AmountRenderer, flex: 1, minWidth: 110 },
    { field: 'image', headerName: 'Receipt', cellRenderer: ReceiptRenderer, width: 100 },
    { 
      headerName: 'Actions', 
      cellRenderer: ActionsRenderer, 
      width: 80, 
      pinned: 'right', 
      hide: !canEdit,
      sortable: false,
      filter: false
    }
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    suppressMovable: true,
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/daybook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          txn_date: formData.date,
          amount: parseFloat(formData.amount),
          image: uploadState.url
        })
      });
      const result = await response.json();
      if (result.success) {
        setShowModal(false);
        setFormData({ ...formData, amount: '', description: '', category: '' });
        setUploadState({ text: 'Upload Photo/Bill', url: null, isUploading: false });
        fetchDaybook();
      } else {
        alert('Failed to save entry: ' + result.message);
      }
    } catch (err) {
      console.error('Error saving entry:', err);
      alert('Error saving entry to database');
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploadState({ ...uploadState, text: 'Uploading...', isUploading: true });
    
    const uploadFormData = new FormData();
    uploadFormData.append('bill', file);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
        method: 'POST',
        body: uploadFormData,
      });
      
      const result = await response.json().catch(() => ({ 
        success: false, 
        message: 'Server returned an invalid response. Please check server logs.' 
      }));
      
      if (result.success) {
        setUploadState({ 
          text: result.filename, 
          url: result.url, 
          isUploading: false 
        });
      } else {
        alert('Upload failed: ' + (result.message || 'Unknown error'));
        setUploadState({ text: 'Upload Failed', url: null, isUploading: false });
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Network error or server unavailable. Please ensure the backend is running and reachable.');
      setUploadState({ text: 'Upload Error', url: null, isUploading: false });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Day Book</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage daily income and expenses.</p>
        </div>
      </div>
      <div className="flex justify-between items-center bg-white/50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 backdrop-blur-sm gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all"
          />
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-sm shadow-blue-600/20 hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          <Plus size={18} />
          <span>New Entry</span>
        </button>
      </div>

      {/* Entries Table */}
      <div className="glass-panel overflow-hidden rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="ag-theme-alpine w-full h-[600px] dark:ag-theme-alpine-dark">
          <AgGridReact
            rowData={daybookEntries}
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

      {/* Simple Modal for New Entry */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-gray-800 transform p-6 transition-all">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add Day Book Entry</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="type" value="Income" checked={formData.type === 'Income'} onChange={(e) => setFormData({...formData, type: e.target.value})} className="peer sr-only" />
                  <div className="p-3 rounded-lg border text-center peer-checked:bg-green-50 peer-checked:border-green-500 peer-checked:text-green-700 dark:peer-checked:bg-green-900/20 dark:peer-checked:border-green-500 dark:peer-checked:text-green-400 border-gray-200 dark:border-gray-700 dark:text-gray-400 transition-colors">
                    Income
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="type" value="Expense" checked={formData.type === 'Expense'} onChange={(e) => setFormData({...formData, type: e.target.value})} className="peer sr-only" />
                  <div className="p-3 rounded-lg border text-center peer-checked:bg-red-50 peer-checked:border-red-500 peer-checked:text-red-700 dark:peer-checked:bg-red-900/20 dark:peer-checked:border-red-500 dark:peer-checked:text-red-400 border-gray-200 dark:border-gray-700 dark:text-gray-400 transition-colors">
                    Expense
                  </div>
                </label>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <input 
                  type="text" required
                  value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-blue-500 transition-colors" 
                  placeholder="e.g. Sales, Utilities, Stock"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount (₹)</label>
                <input 
                  type="number" required min="0" step="0.01"
                  value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})}
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-blue-500 transition-colors" 
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
                <input 
                  type="text" 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-blue-500 transition-colors" 
                />
              </div>

              <div className="mt-2">
                <label className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex flex-col items-center justify-center gap-2 ${
                  uploadState.url ? 'border-green-500 bg-green-50/30 dark:bg-green-900/10' : 'border-gray-300 dark:border-gray-700'
                }`}>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    accept="image/*,.pdf"
                  />
                  {uploadState.isUploading ? (
                    <Loader2 className="text-blue-500 animate-spin" size={24} />
                  ) : uploadState.url ? (
                    <CheckCircle2 className="text-green-500" size={24} />
                  ) : (
                    <Upload className="text-gray-400" size={24} />
                  )}
                  <span className={`text-sm font-medium ${
                    uploadState.url ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {uploadState.text}
                  </span>
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
