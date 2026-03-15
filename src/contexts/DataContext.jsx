import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

// Initial Mock Data
const initialEmployees = [
  { id: 1, name: 'Alice Smith', position: 'Cashier', status: 'Active', idExpiry: '2027-05-10', joinDate: '2023-01-15' },
  { id: 2, name: 'Bob Johnson', position: 'Stock Clerk', status: 'Active', idExpiry: '2024-02-15', joinDate: '2022-11-01' }, // Overdue
  { id: 3, name: 'Charlie Davis', position: 'Manager', status: 'Inactive', idExpiry: '2026-08-20', joinDate: '2021-06-20' },
];

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
  // State for all our mock tables
  const [employees, setEmployees] = useState(initialEmployees);
  const [dayBook, setDayBook] = useState(initialDayBook);
  const [licenses, setLicenses] = useState(initialLicenses);
  const [bills, setBills] = useState([]); // Array of { id, date, url, description, category }

  // --- Actions ---

  // Day Book
  const addDayBookEntry = (entry) => {
    setDayBook(prev => [{ id: Date.now(), ...entry }, ...prev]);
  };
  const deleteDayBookEntry = (id) => {
    setDayBook(prev => prev.filter(e => e.id !== id));
  };

  // Employees
  const addEmployee = (emp) => {
    setEmployees(prev => [...prev, { id: Date.now(), ...emp }]);
  };

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
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      activeEmployeesCount,
      expiredLicensesCount
    };
  };

  return (
    <DataContext.Provider value={{
      employees, addEmployee,
      dayBook, addDayBookEntry, deleteDayBookEntry,
      licenses,
      bills, uploadBill,
      getDashboardMetrics
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
