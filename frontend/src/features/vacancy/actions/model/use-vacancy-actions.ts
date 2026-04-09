'use client';

import {useState} from 'react';
import {
    createVacancy,
    deleteVacancy,
    updateVacancy,
    CreateVacancyRequest,
} from '@/shared/api/vacancies';
import {Vacancy} from '@/entities/vacancy/model/vacancy';
import {VacancyStatus} from '@/entities/vacancy/model/vacancy';
import {useVacancyStore} from "@/entities/vacancy/model/use-vacancy-store";

type UseVacancyActionsParams = {
    vacancies: Vacancy[];
};

export function useVacancyActions({
                                      vacancies,
                                  }: UseVacancyActionsParams) {
    const addVacancy = useVacancyStore((state) => state.addVacancy);
    const removeVacancyById = useVacancyStore((state) => state.removeVacancyById);
    const replaceVacancy = useVacancyStore((state) => state.replaceVacancy);
    const updateVacancyStatusLocally = useVacancyStore(
        (state) => state.updateVacancyStatusLocally
    );

    const setVacancies = useVacancyStore((state) => state.setVacancies);

    const [deletingVacancyId, setDeletingVacancyId] = useState<string | null>(null);
    const [actionError, setActionError] = useState('');

    const handleCreateVacancy = async (payload: CreateVacancyRequest) => {
        try {
            setActionError('');
            const createdVacancy = await createVacancy(payload);
            addVacancy(createdVacancy);
        } catch (error) {
            console.error(error);
            setActionError(
                error instanceof Error ? error.message : 'Failed to create vacancy',
            );
        }
    };

    const handleDeleteVacancy = async (id: string) => {
        try {
            setDeletingVacancyId(id);
            setActionError('');
            await deleteVacancy(id);
            removeVacancyById(id);
        } catch (error) {
            console.error(error);
            setActionError(
                error instanceof Error ? error.message : 'Failed to delete vacancy',
            );
        } finally {
            setDeletingVacancyId(null);
        }
    };

    const handleUpdateVacancyStatus = async (
        vacancyId: string,
        nextStatus: VacancyStatus,
    ) => {
        const previousVacancies = vacancies;

        updateVacancyStatusLocally(vacancyId, nextStatus);

        try {
            const updated = await updateVacancy(vacancyId, {
                status: nextStatus,
            });
            setActionError('');


            replaceVacancy(updated);
        } catch (error) {
            setVacancies(previousVacancies);
            setActionError(
                error instanceof Error ? error.message : 'Failed to update status',
            );
        }
    };

    return {
        deletingVacancyId,
        actionError,
        handleCreateVacancy,
        handleDeleteVacancy,
        handleUpdateVacancyStatus,
    };
}