import { createContext, useEffect, useState, useCallback } from 'react';
import * as authApi from '../services/authApi';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, if we have a stored token, verify it's still valid
  // by fetching the profile — this also refreshes any stale user fields.
  useEffect(() => {
    const token = localStorage.getItem('eatery_token');
    const storedUser = localStorage.getItem('eatery_user');

    if (!token) {
      setLoading(false);
      return;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // ignore corrupt cache
      }
    }

    authApi
      .getProfile()
      .then((profile) => {
        setUser(profile);
        localStorage.setItem('eatery_user', JSON.stringify(profile));
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persistSession = (data) => {
    const { token, ...profile } = data;
    localStorage.setItem('eatery_token', token);
    localStorage.setItem('eatery_user', JSON.stringify(profile));
    setUser(profile);
  };

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials);
    persistSession(data);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authApi.register(payload);
    persistSession(data);
    return data;
  }, []);

  const updateProfile = useCallback(async (updates) => {
    const updated = await authApi.updateProfile(updates);
    setUser(updated);
    localStorage.setItem('eatery_user', JSON.stringify(updated));
    return updated;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('eatery_token');
    localStorage.removeItem('eatery_user');
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    loading,
    login,
    register,
    updateProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
