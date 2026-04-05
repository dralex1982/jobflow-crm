import {getAccessToken} from "@/shared/lib/auth-token";
import {getAuthHeaders} from "@/shared/api/auth-headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

export async function apiFetch<T>(
    input: string,
    init?: RequestInit,
): Promise<T> {
    const token = getAccessToken();

    const res = await fetch(`${API_URL}${input}`, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? getAuthHeaders(token) : {}),
            ...init?.headers,
        },
    });

    if (!res.ok) {
        let message = `API error: ${res.status}`;

        try {
            const errorData = await res.json();

            if (typeof errorData?.message === 'string') {
                message = errorData.message;
            } else if (Array.isArray(errorData?.message)) {
                message = errorData.message.join(', ');
            }
        } catch {
            // fallback остается дефолтным
        }

        throw new ApiError(message, res.status);
    }

    if (res.status === 204) {
        return undefined as T;
    }

    return res.json() as Promise<T>;
}