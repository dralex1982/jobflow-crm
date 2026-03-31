export enum VacancyStatus {
    SAVED = 'SAVED',
    APPLIED = 'APPLIED',
    SCREENING = 'SCREENING',
    INTERVIEW = 'INTERVIEW',
    OFFER = 'OFFER',
    REJECTED = 'REJECTED',
}

export interface Vacancy {
    id: string;
    title: string;
    company: string;
    status: string;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
}