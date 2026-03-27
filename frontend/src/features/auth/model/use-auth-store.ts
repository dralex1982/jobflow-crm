'use client';

import { create } from 'zustand';
import { login, getMe, AuthUser } from '@/shared/api/auth';
import {
    getAccessToken,
    setAccessToken,
    removeAccessToken,
} from '@/shared/lib/auth-token';

interface AuthState {
    user: AuthUser | null;
    isAuth: boolean;
    isLoading: boolean;

    initAuth: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuth: false,
    isLoading: true,

    async initAuth() {
        const token = getAccessToken();

        if (!token) {
            set({ isLoading: false, isAuth: false });
            return;
        }

        try {
            const user = await getMe(token);
            set({ user, isAuth: true });
        } catch {
            removeAccessToken();
            set({ user: null, isAuth: false });
        } finally {
            set({ isLoading: false });
        }
    },

    async login(email, password) {
        const response = await login({ email, password });

        setAccessToken(response.accessToken);

        set({
            user: response.user,
            isAuth: true,
        });
    },

    logout() {
        removeAccessToken();
        set({
            user: null,
            isAuth: false,
        });
    },
}));