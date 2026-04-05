import { apiFetch } from './client';
import {
    AuthResponse,
    AuthUser,
    LoginRequest,
    RegisterRequest,
} from './auth.types';

export async function login(data: LoginRequest): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function getMe(): Promise<AuthUser> {
    return apiFetch<AuthUser>('/users/me');
}