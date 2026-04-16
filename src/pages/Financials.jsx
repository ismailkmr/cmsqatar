import React, { useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { FileSpreadsheet, Download, ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

export default function Financials() {
  const { dayBook, getDashboardMetrics, balanceSheetData, fetchBalanceSheet, loading } = useData();
  const [searchText, setSearchText] = React.useState('');
  
  useEffect(() => {
    fetchBalanceSheet();
  }, []);

  const metrics = getDashboardMetrics();

  // Simple aggregation for Ledger by category if API data is not available
  let ledgerEntries = balanceSheetData?.ledgerSummary || [];
  
  if (ledgerEntries.length === 0) {
    const ledgerMap = new Map();
    dayBook.forEach(entry => {
      if (!ledgerMap.has(entry.category)) {
        ledgerMap.set(entry.category, { income: 0, expense: 0 });
      }
      const cat = ledgerMap.get(entry.category);
      if (entry.type === 'Income') cat.income += entry.amount;
      else cat.expense += entry.amount;
    });
    ledgerEntries = Array.from(ledgerMap, ([category, data]) => ({ category, ...data }));
  }

  const columnDefs = [
    { field: 'category', headerName: 'Category', flex: 1.5, minWidth: 150 },
    { 
      field: 'income', 
      headerName: 'Income', 
      flex: 1, 
      minWidth: 100, 
      cellClass: 'text-green-600 dark:text-green-500 font-medium',
      valueFormatter: p => `₹${p.value}`
    },
    { 
      field: 'expense', 
      headerName: 'Expense', 
      flex: 1, 
      minWidth: 100, 
      cellClass: 'text-red-600 dark:text-red-500 font-medium',
      valueFormatter: p => `₹${p.value}`
    },
    { 
      headerName: 'Net', 
      flex: 1, 
      minWidth: 100,
      valueGetter: p => p.data.income - p.data.expense,
      valueFormatter: p => `₹${p.value}`,
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

  if (loading) {
    return <div className="p-8 text-center">Loading financial data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financials</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Ledger overview and simplified Balance Sheet.</p>
        </div>
        <button className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
          <Download size={18} />
          <span>Export PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Ledger */}
        <div className="glass-panel p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
              <FileSpreadsheet size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Category Ledger</h2>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all"
              />
            </div>
            
            <div className="ag-theme-alpine w-full h-[350px] dark:ag-theme-alpine-dark">
              <AgGridReact
                rowData={ledgerEntries}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                quickFilterText={searchText}
                animateRows={true}
                onGridReady={(params) => params.api.sizeColumnsToFit()}
              />
            </div>
          </div>
        </div>

        {/* Balance Sheet Summary */}
        <div className="glass-panel p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Balance Sheet (YTD)</h2>
            <Link to="/balancesheet" className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center gap-1 hover:underline">
              View Detailed <ChevronRight size={14} />
            </Link>
          </div>
          
          <div className="flex-1 space-y-6">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between text-sm mb-1 text-gray-500 dark:text-gray-400">
                <span>Total Assets / Income</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">₹{metrics.totalIncome}</div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between text-sm mb-1 text-gray-500 dark:text-gray-400">
                <span>Total Liabilities / Expenses</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">₹{metrics.totalExpense}</div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300 font-medium">Net Value</span>
              <span className={`text-2xl font-bold ${metrics.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                ₹{metrics.balance}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
