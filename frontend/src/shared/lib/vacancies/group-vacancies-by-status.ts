import { Vacancy, VacancyStatus } from '@/entities/vacancy/model/vacancy';

export type VacanciesByStatus = Record<VacancyStatus, Vacancy[]>;

export const groupVacanciesByStatus = (
    vacancies: Vacancy[],
): VacanciesByStatus => {
    const initial: VacanciesByStatus = {
        [VacancyStatus.SAVED]: [],
        [VacancyStatus.APPLIED]: [],
        [VacancyStatus.SCREENING]: [],
        [VacancyStatus.INTERVIEW]: [],
        [VacancyStatus.OFFER]: [],
        [VacancyStatus.REJECTED]: [],
    };

    return vacancies.reduce((acc, vacancy) => {
        acc[vacancy.status].push(vacancy);
        return acc;
    }, initial);
};