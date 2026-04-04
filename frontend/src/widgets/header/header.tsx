'use client';

import {useRouter} from 'next/navigation';
import {useAuthStore} from '@/features/auth/model/use-auth-store';

export const Header = () => {
    const router = useRouter();
    const {isAuth, logout} = useAuthStore();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <div className="flex items-center justify-between border-b p-4">
            <div className="font-semibold">JobFlow CRM</div>

            {isAuth && (<button
                onClick={handleLogout}
                className="rounded-lg border px-3 py-1 text-sm"
            >
                Logout
            </button>)}
        </div>
    );
};