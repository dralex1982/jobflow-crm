'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {useAuthStore} from "@/features/auth/model/use-auth-store";


export default function ProtectedLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const isAuth = useAuthStore((state) => state.isAuth);
    const isInitialized = useAuthStore((state) => state.isInitialized);

    useEffect(() => {
        if (isInitialized && !isAuth) {
            router.replace('/login');
        }
    }, [isInitialized, isAuth, router]);

    if (!isInitialized) {
        return (
            <div className="mx-auto max-w-5xl p-6">
                <p className="text-sm text-gray-500">Initializing session...</p>
            </div>
        );
    }

    if (!isAuth) {
        return null;
    }

    return <>{children}</>;
}