'use client';

import {useEffect} from 'react';
import {useAuthStore} from '@/features/auth/model/use-auth-store';

export function AuthProvider({children}: { children: React.ReactNode }) {

    const initAuth = useAuthStore((state) => state.initAuth);
    const isInitialized = useAuthStore((state) => state.isInitialized);

    useEffect(() => {
        if (!isInitialized) {
            initAuth();
        }
    }, [initAuth, isInitialized]);

    return <>{children}</>;
}