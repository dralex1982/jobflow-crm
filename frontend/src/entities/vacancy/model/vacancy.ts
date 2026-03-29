export type VacancyStatus =
    | 'SAVED'
    | 'APPLIED'
    | 'SCREENING'
    | 'INTERVIEW'
    | 'OFFER'
    | 'REJECTED';

export interface Vacancy {
    id: string;
    title: string;
    company: string;
    status: string;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
}