'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '@/lib/i18n';

interface AuthUser {
  token: string;
  role: string;
  user_id: number;
  name: string;
}

interface AppContextType {
  user: AuthUser | null;
  lang: Language;
  setLang: (l: Language) => void;
  login: (user: AuthUser) => void;
  logout: () => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType>({
  user: null,
  lang: 'en',
  setLang: () => {},
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [lang, setLangState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('coopskill_user');
    const storedLang = localStorage.getItem('coopskill_lang') as Language | null;
    if (stored) setUser(JSON.parse(stored));
    if (storedLang) setLangState(storedLang);
    setIsLoading(false);
  }, []);

  const login = (userData: AuthUser) => {
    setUser(userData);
    localStorage.setItem('coopskill_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('coopskill_user');
    window.location.href = '/';
  };

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem('coopskill_lang', l);
  };

  return (
    <AppContext.Provider value={{ user, lang, setLang, login, logout, isLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
