import { useCallback, useMemo, useState } from 'react';
import { authApi } from '../services/api';
import { AuthContext } from './authContextValue';

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('esg_user')) || null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const persistSession = (data) => {
    localStorage.setItem('esg_access_token', data.tokens.accessToken);
    localStorage.setItem('esg_refresh_token', data.tokens.refreshToken);
    localStorage.setItem('esg_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = useCallback(async (payload) => {
    setLoading(true);
    setError('');
    try {
      const response = await authApi.login(payload);
      persistSession(response.data);
      return response.data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    setError('');
    try {
      const response = await authApi.register(payload);
      persistSession(response.data);
      return response.data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('esg_access_token');
    localStorage.removeItem('esg_refresh_token');
    localStorage.removeItem('esg_user');
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), loading, error, login, register, logout }),
    [user, loading, error, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
