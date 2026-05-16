import { createContext, useContext, useState, useEffect } from 'react';
import * as bankingApi from '../services/bankingApi';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await bankingApi.login(email.trim().toLowerCase(), password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          (error.request ? 'Cannot reach the API server. Make sure the backend is running on port 3000.' : error.message) ||
          'Login failed',
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await bankingApi.register(name.trim(), email.trim().toLowerCase(), password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          (error.request ? 'Cannot reach the API server. Make sure the backend is running on port 3000.' : error.message) ||
          'Registration failed',
      };
    }
  };

  const logout = async () => {
    try {
      await bankingApi.logout();
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
