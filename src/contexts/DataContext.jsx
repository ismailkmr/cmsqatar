import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

// Initial Mock Data (employees now loaded from API)

const initialDayBook = [
  { id: 101, date: '2026-03-14', type: 'Income', category: 'Sales', amount: 4500, description: 'Daily counter sales', image: null },
  { id: 102, date: '2026-03-14', type: 'Expense', category: 'Utilities', amount: 200, description: 'Electricity bill payment', image: 'bill_1.jpg' },
  { id: 103, date: '2026-03-13', type: 'Income', category: 'Sales', amount: 5200, description: 'High volume day', image: null },
];

const initialLicenses = [
  { id: 'L1', name: 'Trade License', number: 'TL-89432', expiryDate: '2026-12-31', status: 'Valid' },
  { id: 'L2', name: 'Fire Safety Certificate', number: 'FS-1011', expiryDate: '2026-04-10', status: 'Expiring Soon' },
  { id: 'L3', name: 'Food Safety', number: 'FSSAI-5532', expiryDate: '2025-10-01', status: 'Expired' },
];

export function DataProvider({ children }) {
  const [employees, setEmployees] = useState([]);
  const [dayBook, setDayBook] = useState(initialDayBook);
  const [licenses, setLicenses] = useState(initialLicenses);
  const [bills, setBills] = useState([]);
  const [balanceSheetData, setBalanceSheetData] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- Actions ---

  // Fetch employees from TiDB
  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/employees`);
      const result = await response.json();
      if (result.success) {
        setEmployees(result.data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Fetch Balance Sheet
  const fetchBalanceSheet = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/balance-sheet`);
      const result = await response.json();
      if (result.success) {
        setBalanceSheetData(result.data);
      }
    } catch (error) {
      console.error('Error fetching balance sheet:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchBalanceSheet();
  }, []);

  // Day Book
  const addDayBookEntry = (entry) => {
    setDayBook(prev => [{ id: Date.now(), ...entry }, ...prev]);
  };
  const deleteDayBookEntry = (id) => {
    setDayBook(prev => prev.filter(e => e.id !== id));
  };

  // Employees — re-fetch from API after any add/delete
  const refreshEmployees = () => fetchEmployees();

  // Bills
  const uploadBill = (bill) => {
    setBills(prev => [{ id: Date.now(), ...bill }, ...prev]);
  };

  // derived state for Dashboard (Metrics)
  const getDashboardMetrics = () => {
    const totalIncome = dayBook.filter(e => e.type === 'Income').reduce((sum, e) => sum + e.amount, 0);
    const totalExpense = dayBook.filter(e => e.type === 'Expense').reduce((sum, e) => sum + e.amount, 0);
    const activeEmployeesCount = employees.filter(e => e.status === 'Active').length;
    const expiredLicensesCount = licenses.filter(l => l.status === 'Expired').length;
    
    return {
      totalIncome: balanceSheetData?.totalAssets || totalIncome,
      totalExpense: balanceSheetData?.totalLiabilities || totalExpense,
      balance: balanceSheetData ? balanceSheetData.netValue : (totalIncome - totalExpense),
      activeEmployeesCount,
      expiredLicensesCount
    };
  };

  return (
    <DataContext.Provider value={{
      employees, refreshEmployees,
      dayBook, addDayBookEntry, deleteDayBookEntry,
      licenses,
      bills, uploadBill,
      balanceSheetData, fetchBalanceSheet, loading,
      getDashboardMetrics
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
