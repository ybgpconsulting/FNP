import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getStoredAdminUser,
  loginAdminWithCredentials,
  logoutAdminUser,
  resetAdminPassword,
  subscribeToAuthChanges,
} from '../firebase/authService';
import { AdminUser } from '../types';

interface AuthContextType {
  adminUser: AdminUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => getStoredAdminUser());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setAdminUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const user = await loginAdminWithCredentials(email, pass);
      setAdminUser(user);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutAdminUser();
    setAdminUser(null);
  };

  const forgotPassword = async (email: string) => {
    await resetAdminPassword(email);
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        loading,
        login,
        logout,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
