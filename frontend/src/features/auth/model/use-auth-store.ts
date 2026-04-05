import { create } from 'zustand';
import {AuthUser, getMe, login, register} from '@/shared/api/auth';
import {removeAccessToken, setAccessToken} from "@/shared/lib/auth-token";

interface AuthState {
    user: AuthUser | null;
    token: string | null;
    isAuth: boolean;
    isInitialized: boolean;

    login: (email: string, password: string) => Promise<void>;
    register: (
        email: string,
        password: string,
        firstName?: string,
        lastName?: string,
    ) => Promise<void>;
    logout: () => void;
    initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuth: false,
    isInitialized: false,

    async login(email, password) {
        const res = await login({ email, password });

        setAccessToken(res.accessToken)

        set({
            user: res.user,
            token: res.accessToken,
            isAuth: true,
            isInitialized: true,
        });
    },

    async register(email, password, firstName, lastName) {
        const res = await register({
            email,
            password,
            firstName,
            lastName,
        });

        setAccessToken(res.accessToken)

        set({
            user: res.user,
            token: res.accessToken,
            isAuth: true,
            isInitialized: true,
        });
    },

    logout() {

        removeAccessToken()

        set({
            user: null,
            token: null,
            isAuth: false,
            isInitialized: true,
        });
    },

    async initAuth() {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                set({
                    user: null,
                    token: null,
                    isAuth: false,
                    isInitialized: true,
                });
                return;
            }

            const user = await getMe(token);

            set({
                user,
                token,
                isAuth: true,
                isInitialized: true,
            });
        } catch {
            localStorage.removeItem('token');

            set({
                user: null,
                token: null,
                isAuth: false,
                isInitialized: true,
            });
        }
    },
}));