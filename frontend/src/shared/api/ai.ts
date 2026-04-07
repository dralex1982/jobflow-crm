import {apiFetch} from './client';


export interface VacancyAnalysisResponse {
    summary: string;
    keySkills: string[];
    risks: string[];
    nextActions: string[];
    updatedAt?: string;
}

export function analyzeVacancy(
    vacancyId: string,
): Promise<VacancyAnalysisResponse> {
    return apiFetch<VacancyAnalysisResponse>(`/ai/vacancies/${vacancyId}/analyze`, {
        method: 'POST',
    });
}

export function getVacancyAnalysis(
    vacancyId: string,
): Promise<VacancyAnalysisResponse | null> {
    return apiFetch<VacancyAnalysisResponse | null>(
        `/ai/vacancies/${vacancyId}/analysis`,
    )
}