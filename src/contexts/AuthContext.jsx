import React, { createContext, useContext, useState, useEffect } from 'react';

// The 4 Roles
export const ROLES = {
  ADMIN: 'Admin',
  OWNER: 'Shop Owner',
  ACCOUNTANT: 'Accountant',
  STAFF: 'Staff',
  SHOP: 'Shop'
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

  const login = async (email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        const userWithToken = {
          ...data.user,
          token: data.token
        };
        setUser(userWithToken);
        localStorage.setItem('csmsUser', JSON.stringify(userWithToken));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Server connection failed' };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Server connection failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('csmsUser');
  };

  // Helper function to check role access
  const hasAccess = (allowedRoles) => {
    if (!user) return false;
    const userRole = user.role?.toLowerCase();
    return allowedRoles.some(role => role.toLowerCase() === userRole);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
