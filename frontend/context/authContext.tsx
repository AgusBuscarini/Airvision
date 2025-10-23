"use client"

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { getToken, saveToken, removeToken, isAuthenticated } from '@/services/userService';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    isAuth: boolean;
    login: (token: string) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined> (undefined);

interface AuthContextProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        setIsAuth(isAuthenticated());
        setIsLoading(false);
    }, []);

    const login = useCallback((token: string) => {
        saveToken(token);
        setIsAuth(true);
    }, []);

    const logout = useCallback(() => {
        removeToken();
        setIsAuth(false);
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
        <AuthContext.Provider value={{ isAuth, login, logout, isLoading }}>
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