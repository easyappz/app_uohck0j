import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as apiLogin, register as apiRegister, me as apiMe, logoutClientSide } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const profile = await apiMe();
          if (mounted) setUser(profile);
        }
      } catch (e) {
        // token invalid
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    return () => { mounted = false; };
  }, []);

  async function login(loginData) {
    setAuthError(null);
    const data = await apiLogin(loginData);
    localStorage.setItem('token', data.access);
    localStorage.setItem('refresh', data.refresh);
    const profile = await apiMe();
    setUser(profile);
  }

  async function register(registerData) {
    setAuthError(null);
    const data = await apiRegister(registerData);
    localStorage.setItem('token', data.access);
    localStorage.setItem('refresh', data.refresh);
    const profile = await apiMe();
    setUser(profile);
  }

  function logout() {
    logoutClientSide();
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, authError, setAuthError, login, register, logout }), [user, loading, authError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
