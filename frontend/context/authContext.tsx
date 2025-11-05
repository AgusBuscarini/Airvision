"use client"

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { getToken, saveToken, removeToken, isAuthenticated, getRole } from '@/services/userService';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    isAuth: boolean;
    login: (token: string, role: string) => void;
    logout: () => void;
    isLoading: boolean;
    role: string | null;
}

const AuthContext = createContext<AuthContextType | undefined> (undefined);

interface AuthContextProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [role, setRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        setIsAuth(isAuthenticated());
        setRole(getRole());
        setIsLoading(false);
    }, []);

    const login = useCallback((token: string, role: string) => {
        saveToken(token, role);
        setIsAuth(true);
        setRole(role);
    }, []);

    const logout = useCallback(() => {
        removeToken();
        setIsAuth(false);
        setRole(null);
        router.push('/login');
    }, [router]);

    useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'authToken') {
            const currentAuthStatus = isAuthenticated();
            if (isAuth !== currentAuthStatus) {
                setIsAuth(currentAuthStatus);
                if (!currentAuthStatus) {
                router.push('/login');
                }
            }
        }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [isAuth, router]);
    return (
        <AuthContext.Provider value={{ isAuth, login, logout, isLoading, role }}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};