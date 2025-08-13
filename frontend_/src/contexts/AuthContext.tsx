// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginApi, getMe } from '../services/auth';

// ----------------------
// Type Definitions
// ----------------------
type UserProfile = {
  first_name: string | null;
  last_name: string | null;
  profile_picture: string | null;
  bio: string;
  location: string;
  role: 'student' | 'recruiter' | string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  profile: UserProfile;
};

interface AuthContextType {
  user: User | null;
  login: (credentials: { username: string; password: string }) => Promise<{ ok: boolean; message?: string }>;
  logout: () => void;
  refreshMe: () => void;
  loading: boolean;
}

// ----------------------
// Create Context
// ----------------------
const AuthContext = createContext<AuthContextType | null>(null);

// ----------------------
// Auth Provider
// ----------------------
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  // ----------------------
  // Login
  // ----------------------
  async function login(credentials: { username: string; password: string }) {
    setLoading(true);
    try {
      const data = await loginApi(credentials); // POST /api/token/
      if (data?.access) localStorage.setItem('access_token', data.access);

      // Fetch current user
      const me = await getMe(); // GET /me/
      setUser(me);
      localStorage.setItem('user', JSON.stringify(me));

      return { ok: true };
    } catch (e: any) {
      return { ok: false, message: e?.response?.data?.detail || 'Login failed' };
    } finally {
      setLoading(false);
    }
  }

  // ----------------------
  // Logout
  // ----------------------
  function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  }

  // ----------------------
  // Refresh current user
  // ----------------------
  async function refreshMe() {
    try {
      const me = await getMe();
      setUser(me as User);
    } catch (_) {
      setUser(null);
    }
  }

  // ----------------------
  // Memoized context value
  // ----------------------
  const value: AuthContextType = useMemo(
    () => ({ user, login, logout, refreshMe, loading }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ----------------------
// Hook for components
// ----------------------
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
