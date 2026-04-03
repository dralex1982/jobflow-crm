import { Vacancy, VacancyStatus } from '@/entities/vacancy/model/vacancy';

export type VacanciesByStatus = Record<VacancyStatus, Vacancy[]>;

export const groupVacanciesByStatus = (
    vacancies: Vacancy[],
): VacanciesByStatus => {
    };
};