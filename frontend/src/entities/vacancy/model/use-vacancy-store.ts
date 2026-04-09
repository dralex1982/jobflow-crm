import { create } from 'zustand';
import { Vacancy, VacancyStatus } from '@/entities/vacancy/model/vacancy';

type VacancyStore = {
    vacancies: Vacancy[];
    isVacanciesLoading: boolean;
    vacanciesError: string;

    setVacancies: (vacancies: Vacancy[]) => void;
    setIsVacanciesLoading: (value: boolean) => void;
    setVacanciesError: (value: string) => void;

    addVacancy: (vacancy: Vacancy) => void;
    removeVacancyById: (id: string) => void;
    replaceVacancy: (vacancy: Vacancy) => void;
    updateVacancyStatusLocally: (vacancyId: string, status: VacancyStatus) => void;
    resetVacanciesState: () => void;
};

export const useVacancyStore = create<VacancyStore>((set) => ({
    vacancies: [],
    isVacanciesLoading: true,
    vacanciesError: '',

    setVacancies: (vacancies) => set({ vacancies }),

    setIsVacanciesLoading: (value) => set({ isVacanciesLoading: value }),

    setVacanciesError: (value) => set({ vacanciesError: value }),

    addVacancy: (vacancy) =>
        set((state) => ({
            vacancies: [vacancy, ...state.vacancies],
        })),

    removeVacancyById: (id) =>
        set((state) => ({
            vacancies: state.vacancies.filter((vacancy) => vacancy.id !== id),
        })),

    replaceVacancy: (updatedVacancy) =>
        set((state) => ({
            vacancies: state.vacancies.map((vacancy) =>
                vacancy.id === updatedVacancy.id ? updatedVacancy : vacancy,
            ),
        })),

    updateVacancyStatusLocally: (vacancyId, status) =>
        set((state) => ({
            vacancies: state.vacancies.map((vacancy) =>
                vacancy.id === vacancyId
                    ? { ...vacancy, status }
                    : vacancy,
            ),
        })),

    resetVacanciesState: () =>
        set({
            vacancies: [],
            isVacanciesLoading: true,
            vacanciesError: '',
        }),
}));