import { Vacancy, VacancyStatus } from '@/entities/vacancy/model/vacancy';

export const getVacancySummary = (vacancies: Vacancy[]) => {
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