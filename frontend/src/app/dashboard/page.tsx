'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken, removeAccessToken } from '@/shared/lib/auth-token';
import { AuthUser, getMe } from '@/shared/api/auth';

export default function DashboardPage() {
    const router = useRouter();

    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            const token = getAccessToken();

            if (!token) {
                router.replace('/login');
                return;
            }

            try {
                const currentUser = await getMe(token);
                setUser(currentUser);
            } catch {
                removeAccessToken();
                router.replace('/login');
            } finally {
                setIsLoading(false);
            }
        }

        checkAuth();
    }, [router]);

    function handleLogout() {
        removeAccessToken();
        router.replace('/login');
    }

    if (isLoading) {
        return <div className="p-6">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold">JobFlow Dashboard</h1>
            <p className="mt-2 text-gray-500">
                Welcome, {user.firstName ?? user.email}
            </p>

            <button
                onClick={handleLogout}
                className="mt-4 rounded-lg border px-4 py-2"
            >
                Logout
            </button>
        </main>
    );
}