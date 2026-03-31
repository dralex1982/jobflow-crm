import { Vacancy, VacancyStatus } from '@/entities/vacancy/model/vacancy';

export type DashboardStats = {
    total: number;
    applied: number;
    interview: number;
    offers: number;
};

export const getDashboardStats = (vacancies: Vacancy[]): DashboardStats => {
    return {
        total: vacancies.length,
        applied: vacancies.filter(
            vacancy => vacancy.status === VacancyStatus.APPLIED
        ).length,
        interview: vacancies.filter(
            vacancy => vacancy.status === VacancyStatus.INTERVIEW
        ).length,
        offers: vacancies.filter(
            vacancy => vacancy.status === VacancyStatus.OFFER
        ).length,
    };
};