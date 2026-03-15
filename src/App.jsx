import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ROLES } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DayBook from './pages/DayBook';
import Financials from './pages/Financials';
import Employees from './pages/Employees';
import Compliance from './pages/Compliance';
import Bills from './pages/Bills';

// Temporary placeholders until pages are built
const Placeholder = ({ title }) => (
  <div className="flex items-center justify-center h-full">
    <h2 className="text-3xl font-light text-gray-400 dark:text-gray-600">{title} Module Coming Soon</h2>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes Wrapper */}
            <Route path="/" element={<MainLayout />}>
              
              {/* Dashboard Access */}
              <Route index element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT]}>
                  <Dashboard />
                </ProtectedRoute>
              } />

              {/* Day Book Access (All roles) */}
              <Route path="daybook" element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT, ROLES.STAFF]}>
                  <DayBook />
                </ProtectedRoute>
              } />

              {/* Financials Access */}
              <Route path="financials" element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT]}>
                  <Financials />
                </ProtectedRoute>
              } />

              {/* Employee Management Access */}
              <Route path="employees" element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OWNER]}>
                  <Employees />
                </ProtectedRoute>
              } />

              {/* Compliance Access */}
              <Route path="compliance" element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OWNER]}>
                  <Compliance />
                </ProtectedRoute>
              } />

              {/* Bills Storage Access */}
              <Route path="bills" element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT, ROLES.STAFF]}>
                  <Bills />
                </ProtectedRoute>
              } />

            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
