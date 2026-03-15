import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, hasAccess } = useAuth();

  // Wait for auth to initialize ideally, but since it's synchronous localStorage, we can check directly
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !hasAccess(allowedRoles)) {
    // Redirect to unauthorized or dashboard if they lack role permissions
    // In actual app, might show a "Not Authorized" screen.
    // For prototype, we just push them to Day Book or dashboard.
    return <Navigate to="/daybook" replace />;
  }

  return children;
}
