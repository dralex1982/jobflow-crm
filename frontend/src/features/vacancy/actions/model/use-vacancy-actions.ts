'use client';

import { useState, type Dispatch, type SetStateAction } from 'react';
import {
    createVacancy,
    deleteVacancy,
    updateVacancy,
    CreateVacancyRequest,
} from '@/shared/api/vacancies';
import { Vacancy } from '@/entities/vacancy/model/vacancy';
import { VacancyStatus } from '@/entities/vacancy/model/vacancy';
import {updateVacancyStatusLocally} from "@/shared/lib/vacancies/update-vacancy-status-locally";

type UseVacancyActionsParams = {
    vacancies: Vacancy[];
    setVacancies: Dispatch<SetStateAction<Vacancy[]>>;
};

export function useVacancyActions({
                                      vacancies,
                                      setVacancies,
                                  }: UseVacancyActionsParams) {

    const [deletingVacancyId, setDeletingVacancyId] = useState<string | null>(null);
    const [actionError, setActionError] = useState('');

    const handleCreateVacancy = async (payload: CreateVacancyRequest) => {
        try {
            setActionError('');
            const createdVacancy = await createVacancy(payload);
            setVacancies((prev) => [createdVacancy, ...prev]);
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
            setVacancies((prev) => prev.filter((vacancy) => vacancy.id !== id));
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

        setVacancies((prev) =>
            updateVacancyStatusLocally(prev, vacancyId, nextStatus),
        );

        try {
            setActionError('');
            const updated = await updateVacancy(vacancyId, {
                status: nextStatus,
            });

            setVacancies((prev) =>
                prev.map((v) => (v.id === vacancyId ? updated : v)),
            );
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