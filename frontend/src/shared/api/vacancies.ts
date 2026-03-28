import {API_URL, getAuthHeaders} from './api';
import {getAccessToken} from '@/shared/lib/auth-token';

export interface Vacancy {
    id: string;
    title: string;
    company: string;
    status: string;
    notes?: string | null;
    createdAt: string;
}

export interface CreateVacancyRequest {
    title: string;
    company: string;
    notes?: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        let message = 'Request failed';

        try {
            const errorData = await res.json();
            message = errorData.message || message;
        } catch {
        }

        throw new Error(message);
    }

    return res.json();
}

export async function getVacancies(): Promise<Vacancy[]> {
    const token = getAccessToken();

    const res = await fetch(`${API_URL}/vacancies`, {
        method: 'GET',
        headers: getAuthHeaders(token || undefined),
    });

    return handleResponse<Vacancy[]>(res);
}

export async function createVacancy(
    data: CreateVacancyRequest,
): Promise<Vacancy> {
    const token = getAccessToken();

    const res = await fetch(`${API_URL}/vacancies`, {
        method: 'POST',
        headers: getAuthHeaders(token || undefined),
        body: JSON.stringify(data),
    });

    return handleResponse<Vacancy>(res);
}