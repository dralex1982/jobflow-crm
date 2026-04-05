import { create } from 'zustand';
import { getMe, login, register} from '@/shared/api/auth';
import {removeAccessToken, setAccessToken} from "@/shared/lib/auth-token";
import {AuthUser, LoginRequest, RegisterRequest} from "@/shared/api/auth.types";

interface AuthState {
    user: AuthUser | null;
    token: string | null;
    isAuth: boolean;
    isInitialized: boolean;

    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
    initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuth: false,
    isInitialized: false,

    async login(data: LoginRequest) {
        const res = await login(data);

        setAccessToken(res.accessToken)

        set({
            user: res.user,
            token: res.accessToken,
            isAuth: true,
            isInitialized: true,
        });
    },

    async register(data: RegisterRequest) {
        const res = await register(data);

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

            const user = await getMe();

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