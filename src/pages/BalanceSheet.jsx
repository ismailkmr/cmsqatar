import React, { useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { 
  Briefcase, 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  PieChart,
  RefreshCw,
  Download,
  Search
} from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

export default function BalanceSheet() {
  const { balanceSheetData, fetchBalanceSheet, loading } = useData();
  const [searchText, setSearchText] = React.useState('');

  useEffect(() => {
    fetchBalanceSheet();
  }, []);

  // For this prototype, we'll treat positive net categories as "revenue sources/assets" 
  // and ledger entries with expenses as "cost centers/liabilities" for visualization.
  const assets = balanceSheetData?.ledgerSummary.filter(item => item.income > 0) || [];
  const liabilities = balanceSheetData?.ledgerSummary.filter(item => item.expense > 0) || [];

  if (loading && !balanceSheetData) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-500 font-medium font-outfit">Loading Balance Sheet...</p>
        </div>
      </div>
    );
  }

  const columnDefs = [
    { field: 'category', headerName: 'Category', flex: 1.5, minWidth: 150, cellClass: 'font-bold text-gray-800 dark:text-white' },
    { 
      field: 'income', 
      headerName: 'Income', 
      flex: 1, 
      minWidth: 110, 
      cellClass: 'text-green-600 dark:text-green-500 font-medium',
      valueFormatter: p => p.value > 0 ? `₹${p.value.toLocaleString()}` : '—'
    },
    { 
      field: 'expense', 
      headerName: 'Expense', 
      flex: 1, 
      minWidth: 110, 
      cellClass: 'text-red-600 dark:text-red-500 font-medium',
      valueFormatter: p => p.value > 0 ? `₹${p.value.toLocaleString()}` : '—'
    },
    { 
      field: 'net', 
      headerName: 'Net Position', 
      flex: 1, 
      minWidth: 120,
      valueFormatter: p => `₹${p.value.toLocaleString()}`,
      cellClassRules: {
        'text-green-600 dark:text-green-400 font-bold': p => p.value >= 0,
        'text-red-600 dark:text-red-400 font-bold': p => p.value < 0,
      }
    }
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    suppressMovable: true,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent font-outfit">
            Balance Sheet
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Real-time financial position and ledger summary
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchBalanceSheet}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl font-medium transition-all shadow-sm active:scale-95"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 active:scale-95">
            <Download size={18} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          title="Total Assets" 
          amount={balanceSheetData?.totalAssets || 0}
          icon={<TrendingUp className="text-green-500" />}
          gradient="from-green-500/10 to-emerald-500/10"
          border="border-green-100 dark:border-green-900/30"
        />
        <SummaryCard 
          title="Total Liabilities" 
          amount={balanceSheetData?.totalLiabilities || 0}
          icon={<TrendingDown className="text-red-500" />}
          gradient="from-red-500/10 to-orange-500/10"
          border="border-red-100 dark:border-red-900/30"
        />
        <SummaryCard 
          title="Net Worth" 
          amount={balanceSheetData?.netValue || 0}
          icon={<Wallet className="text-blue-500" />}
          gradient="from-blue-500/10 to-indigo-500/10"
          border="border-blue-100 dark:border-blue-900/30"
          highlight={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets Section */}
        <div className="glass-panel p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl">
              <TrendingUp size={22} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white font-outfit">Assets</h2>
          </div>
          <div className="space-y-4">
            {assets.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-900/50 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                  <span className="font-medium text-gray-700 dark:text-gray-200">{item.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">₹{item.income.toLocaleString()}</span>
                  <ArrowRight size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
              </div>
            ))}
            {assets.length === 0 && <p className="text-center text-gray-500 py-4">No assets found</p>}
          </div>
        </div>

        {/* Liabilities Section */}
        <div className="glass-panel p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl">
              <TrendingDown size={22} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white font-outfit">Liabilities</h2>
          </div>
          <div className="space-y-4">
            {liabilities.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-900/50 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  <span className="font-medium text-gray-700 dark:text-gray-200">{item.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">₹{item.expense.toLocaleString()}</span>
                  <ArrowRight size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
              </div>
            ))}
            {liabilities.length === 0 && <p className="text-center text-gray-500 py-4">No liabilities found</p>}
          </div>
        </div>
      </div>

      {/* Ledger Summary Section */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
            <PieChart size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white font-outfit">Ledger Summary</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total transaction breakdown by category</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search detailed ledger..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all shadow-sm"
            />
          </div>
          
          <div className="ag-theme-alpine w-full h-[500px] dark:ag-theme-alpine-dark">
            <AgGridReact
              rowData={balanceSheetData?.ledgerSummary || []}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              quickFilterText={searchText}
              animateRows={true}
              onGridReady={(params) => params.api.sizeColumnsToFit()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, amount, icon, gradient, border, highlight = false }) {
  return (
    <div className={`relative overflow-hidden p-6 rounded-3xl border ${border} bg-white dark:bg-gray-900 shadow-sm transition-all hover:shadow-md group`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50`} />
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-transform group-hover:scale-110">
            {icon}
          </div>
          {highlight && (
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              Primary Metric
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-2 font-outfit">
          ₹{amount.toLocaleString()}
        </h3>
      </div>
    </div>
  );
}
