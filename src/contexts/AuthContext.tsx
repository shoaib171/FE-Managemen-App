
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'team_lead';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
});

// Create API with auth header
export const API_URL = 'http://localhost:5000/api';

export const createApi = (token: string | null) => {
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  return api;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize API
  const api = createApi(token);

  // Load user from token
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Error loading user:', err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data);
      setIsAuthenticated(true);
      setError(null);
      toast.success('Registration successful!');
    } catch (err: any) {
      const message = err.response?.data?.msg || 'Registration failed';
      setError(message);
      toast.error(message);
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data);
      setIsAuthenticated(true);
      setError(null);
      toast.success('Login successful!');
    } catch (err: any) {
      const message = err.response?.data?.msg || 'Login failed';
      setError(message);
      toast.error(message);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
