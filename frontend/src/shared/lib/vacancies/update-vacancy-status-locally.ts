import {Vacancy, VacancyStatus} from "@/entities/vacancy/model/vacancy";


export function updateVacancyStatusLocally(
    vacancies: Vacancy[],
    vacancyId: string,
    nextStatus: VacancyStatus,
): Vacancy[] {
    return vacancies.map((vacancy) => {
        if (vacancy.id !== vacancyId) {
            return vacancy;
        }

        if (vacancy.status === nextStatus) {
            return vacancy;
        }

        return {
            ...vacancy,
            status: nextStatus,
            updatedAt: new Date().toISOString(),
        };
    });
}