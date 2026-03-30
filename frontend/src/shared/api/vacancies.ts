import {API_URL, getAuthHeaders} from './api';
import {getAccessToken} from '@/shared/lib/auth-token';
import {Vacancy, VacancyStatus} from "@/entities/vacancy/model/vacancy";

export interface CreateVacancyPayload {
    title: string;
    company: string;
    notes?: string;
}

export interface UpdateVacancyPayload {
    title?: string;
    company?: string;
    notes?: string;
    status?: VacancyStatus;
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
    data: CreateVacancyPayload,
): Promise<Vacancy> {
    const token = getAccessToken();

    const res = await fetch(`${API_URL}/vacancies`, {
        method: 'POST',
        headers: getAuthHeaders(token || undefined),
        body: JSON.stringify(data),
    });

    return handleResponse<Vacancy>(res);
}

export async function updateVacancy(
    id: string,
    data: UpdateVacancyPayload,
): Promise<Vacancy> {
    const token = getAccessToken();

    const res = await fetch(`${API_URL}/vacancies/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(token || undefined),
        body: JSON.stringify(data),
    });

    return handleResponse<Vacancy>(res);
}

export async function deleteVacancy(id: string): Promise<void> {
    const token = getAccessToken();

    const res = await fetch(`${API_URL}/vacancies/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token || undefined),
    });

    if (!res.ok) {
        throw new Error('Failed to delete vacancy');
    }
}