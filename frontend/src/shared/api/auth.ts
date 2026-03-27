import {API_URL, getAuthHeaders} from './api';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

export interface AuthUser {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    role: 'USER' | 'ADMIN';
}

export interface LoginResponse {
    accessToken: string;
    user: AuthUser;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error('Invalid email or password');
    }

    return res.json();
}

export async function register(data: RegisterRequest): Promise<void> {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => null);

        if (errorData?.message) {
            if (Array.isArray(errorData.message)) {
                throw new Error(errorData.message.join(', '));
            }
            throw new Error(errorData.message);
        }

        throw new Error('Registration failed');
    }

    return res.json();
}

export async function getMe(token: string): Promise<AuthUser> {
    const res = await fetch(`${API_URL}/users/me`, {
        method: 'GET',
        headers: getAuthHeaders(token),
    });

    if (!res.ok) {
        throw new Error('Unauthorized');
    }

    return res.json();
}