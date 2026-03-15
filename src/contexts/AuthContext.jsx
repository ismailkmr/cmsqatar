import React, { createContext, useContext, useState, useEffect } from 'react';

// The 4 Roles
export const ROLES = {
  ADMIN: 'Admin',
  OWNER: 'Shop Owner',
  ACCOUNTANT: 'Accountant',
  STAFF: 'Staff'
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Mock initial state: Not logged in
  const [user, setUser] = useState(null);

  // For simulation, load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('csmsUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (role) => {
    const mockUser = {
      id: `u-${Date.now()}`,
      name: `Mock ${role}`,
      role: role,
    };
    setUser(mockUser);
    localStorage.setItem('csmsUser', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('csmsUser');
  };

  // Helper function to check role access
  const hasAccess = (allowedRoles) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
