"use client"

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { getToken, saveToken, removeToken, isAuthenticated, getRole, getMyProfile, User } from '@/services/userService';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    isAuth: boolean;
    login: (token: string, role: string) => void;
    logout: () => void;
    isLoading: boolean;
    role: string | null;
    user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined> (undefined);

interface AuthContextProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [role, setRole] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const initializeAuth = async () => {
            const authStatus = isAuthenticated();
            setIsAuth(authStatus);
            setRole(getRole());
            
            if (authStatus) {
                try {
                    const profile = await getMyProfile();
                    setUser(profile);
                    setRole(profile.role as unknown as string);
                    if (typeof window !== "undefined") {
                        localStorage.setItem('userRole', String(profile.role));
                    }
                } catch (error) {
                    console.error("Token inválido o sesión expirada. Cerrando sesión.", error);
                    removeToken();
                    setIsAuth(false);
                    setRole(null);
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const login = useCallback((token: string, role: string) => {
        saveToken(token, role);
        setIsAuth(true);
        setRole(role);
        getMyProfile()
            .then(profile => {
                setUser(profile);
                setRole(profile.role as unknown as string);
                if (typeof window !== "undefined") {
                    localStorage.setItem('userRole', String(profile.role));
                }
            })
            .catch(error => {
                console.error("Error obteniendo perfil post-login:", error);
                logout();
            });
    }, []);

    const logout = useCallback(() => {
        removeToken();
        setIsAuth(false);
        setRole(null);
        setUser(null);
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
            if (event.key === 'userRole' && event.newValue) {
                setRole(event.newValue);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [isAuth, router]);
    return (
        <AuthContext.Provider value={{ isAuth, login, logout, isLoading, role, user }}>
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
