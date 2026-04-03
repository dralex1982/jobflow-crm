import { Vacancy, VacancyStatus } from '@/entities/vacancy/model/vacancy';

export type VacanciesByStatus = Record<VacancyStatus, Vacancy[]>;

export const groupVacanciesByStatus = (
    vacancies: Vacancy[],
): VacanciesByStatus => {
    return {
        [VacancyStatus.SAVED]: vacancies.filter(
            vacancy => vacancy.status === VacancyStatus.SAVED,
        ),
        [VacancyStatus.APPLIED]: vacancies.filter(
            vacancy => vacancy.status === VacancyStatus.APPLIED,
        ),
        [VacancyStatus.SCREENING]: vacancies.filter(
            vacancy => vacancy.status === VacancyStatus.SCREENING,
        ),
        [VacancyStatus.INTERVIEW]: vacancies.filter(
            vacancy => vacancy.status === VacancyStatus.INTERVIEW,
        ),
        [VacancyStatus.OFFER]: vacancies.filter(
            vacancy => vacancy.status === VacancyStatus.OFFER,
        ),
        [VacancyStatus.REJECTED]: vacancies.filter(
            vacancy => vacancy.status === VacancyStatus.REJECTED,
        ),
    };
};