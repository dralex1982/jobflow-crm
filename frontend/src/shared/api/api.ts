export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function getAuthHeaders(token?: string): HeadersInit {
    if (!token) {
        return {
            'Content-Type': 'application/json',
        };
    }

    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
}