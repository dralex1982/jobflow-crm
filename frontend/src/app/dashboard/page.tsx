'use client';
import { useRouter } from 'next/navigation';
import {useAuthStore} from "@/features/auth/model/use-auth-store";
import {useEffect} from "react";

export default function DashboardPage() {
    const router = useRouter();

    const { user, isAuth, isLoading, logout } = useAuthStore();

    useEffect(() => {
        if (!isLoading && !isAuth) {
            router.replace('/login');
        }
    }, [isLoading, isAuth, router]);


    if (isLoading) {
        return <div className={"p-6"}>Loading...</div>;
    }

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold">JobFlow Dashboard</h1>
            <p className="mt-2 text-gray-500">
                Welcome, {user?.firstName ?? user?.email}
            </p>

            <button
                onClick={logout}
                className="mt-4 rounded-lg border px-4 py-2"
            >
                Logout
            </button>
        </main>
    );
}