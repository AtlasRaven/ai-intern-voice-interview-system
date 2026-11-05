import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { apiClient } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHR: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; fullName: string; phone?: string; role?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  useEffect(() => {
    if (token && !user) {
      apiClient.get('/auth/me')
        .then((res) => {
          const userData = res.data?.data;
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        })
        .catch(() => {
          logout();
        });
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await apiClient.post<{ data: AuthResponse }>('/auth/login', { email, password });
    const authData = res.data.data;
    setToken(authData.token);
    setUser(authData.user);
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
  };

  const register = async (data: { email: string; password: string; fullName: string; phone?: string; role?: string }) => {
    const res = await apiClient.post<{ data: AuthResponse }>('/auth/register', data);
    const authData = res.data.data;
    setToken(authData.token);
    setUser(authData.user);
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isHR = user?.role === 'ROLE_INTERVIEWER' || user?.role === 'ROLE_ADMIN';
  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isHR, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
