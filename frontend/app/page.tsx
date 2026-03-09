'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';

export default function Home() {
    const { isAuth, isLoading } = useAuth(); 
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (isAuth) {
                router.replace('/map'); 
            } else {
                router.replace('/login');
            }
        }
    }, [isAuth, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-900">
                <div className="text-white flex flex-col items-center">
                    <svg className="animate-spin h-8 w-8 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-sm font-light tracking-wider">CARGANDO...</p>
                </div>
            </div>
        );
    }

    return null;
}