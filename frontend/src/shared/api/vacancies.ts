import { apiFetch } from './client';
import { Vacancy, VacancyStatus } from '@/entities/vacancy/model/vacancy';

export async function getVacancies(): Promise<Vacancy[]> {
    return apiFetch<Vacancy[]>('/vacancies');
}

export async function createVacancy(data: {
    title: string;
    company: string;
    notes?: string;
}): Promise<Vacancy> {
    return apiFetch<Vacancy>('/vacancies', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateVacancy(
    id: string,
    data: Partial<{
        title: string;
        company: string;
        notes: string;
        status: VacancyStatus;
    }>,
): Promise<Vacancy> {
    return apiFetch<Vacancy>(`/vacancies/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function deleteVacancy(id: string): Promise<{ success: true }> {
    return apiFetch<{ success: true }>(`/vacancies/${id}`, {
        method: 'DELETE',
    });
}