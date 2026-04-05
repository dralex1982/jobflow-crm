'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    createVacancy, CreateVacancyRequest,
    deleteVacancy,
    getVacancies,
    updateVacancy,
} from '@/shared/api/vacancies';
import { Vacancy, VacancyStatus } from '@/entities/vacancy/model/vacancy';
import { VacancyViewMode } from '@/features/vacancy/view-mode-switcher/model/view-mode';
import {
    getStorageItem,
    removeStorageItem,
    setStorageItem,
} from '@/shared/browser/local-storage';
import { LOCAL_STORAGE_KEYS } from '@/shared/config/local-storage';

export function useVacanciesPage() {
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [isVacanciesLoading, setIsVacanciesLoading] = useState(true);
    const [vacanciesError, setVacanciesError] = useState('');

    const [searchValue, setSearchValue] = useState('');
    const [statusFilter, setStatusFilter] = useState<VacancyStatus | ''>('');
    const [viewMode, setViewMode] = useState<VacancyViewMode>('list');

    const [isHydrated, setIsHydrated] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    const [actionError, setActionError] = useState('');

    const isFiltered = Boolean(searchValue || statusFilter);

    const filteredVacancies = useMemo(() => {
        return vacancies.filter((vacancy) => {
            const matchesSearch =
                vacancy.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                vacancy.company.toLowerCase().includes(searchValue.toLowerCase());

            const matchesStatus =
                !statusFilter || vacancy.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [vacancies, searchValue, statusFilter]);

    const loadVacancies = async () => {
        try {
            setIsVacanciesLoading(true);
            setVacanciesError('');

            const data = await getVacancies();
            setVacancies(data);
        } catch (error) {
            console.error(error);
            setVacanciesError(
                error instanceof Error ? error.message : 'Failed to load vacancies',
            );
        } finally {
            setIsVacanciesLoading(false);
        }
    };

    useEffect(() => {
        loadVacancies();
    }, []);

    useEffect(() => {
        const savedSearchValue = getStorageItem(
            LOCAL_STORAGE_KEYS.vacanciesSearchValue,
        );

        const savedStatusFilter = getStorageItem(
            LOCAL_STORAGE_KEYS.vacanciesStatusFilter,
        );

        const savedViewMode = getStorageItem(
            LOCAL_STORAGE_KEYS.vacanciesViewMode,
        );

        if (savedSearchValue) {
            setSearchValue(savedSearchValue);
        }

        if (
            savedStatusFilter &&
            Object.values(VacancyStatus).includes(savedStatusFilter as VacancyStatus)
        ) {
            setStatusFilter(savedStatusFilter as VacancyStatus);
        }

        if (savedViewMode === 'list' || savedViewMode === 'board') {
            setViewMode(savedViewMode);
        }

        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (!isHydrated) return;

        setStorageItem(
            LOCAL_STORAGE_KEYS.vacanciesSearchValue,
            searchValue,
        );
    }, [searchValue, isHydrated]);

    useEffect(() => {
        if (!isHydrated) return;

        if (statusFilter) {
            setStorageItem(
                LOCAL_STORAGE_KEYS.vacanciesStatusFilter,
                statusFilter,
            );
            return;
        }

        removeStorageItem(LOCAL_STORAGE_KEYS.vacanciesStatusFilter);
    }, [statusFilter, isHydrated]);

    useEffect(() => {
        if (!isHydrated) return;

        setStorageItem(
            LOCAL_STORAGE_KEYS.vacanciesViewMode,
            viewMode,
        );
    }, [viewMode, isHydrated]);

    const handleResetFilters = () => {
        setSearchValue('');
        setStatusFilter('');

        removeStorageItem(LOCAL_STORAGE_KEYS.vacanciesSearchValue);
        removeStorageItem(LOCAL_STORAGE_KEYS.vacanciesStatusFilter);
    };

    const handleCreateVacancy = async (payload: CreateVacancyRequest) => {
        try {
            setActionError('');
            await createVacancy(payload);
            await loadVacancies();
        } catch (error) {
            console.error(error);
            setActionError(
                error instanceof Error ? error.message : 'Failed to create vacancy',
            );
        }
    };

    const handleDeleteVacancy = async (id: string) => {
        try {
            setActionError('');
            await deleteVacancy(id);
            await loadVacancies();
        } catch (error) {
            console.error(error);
            setActionError(
                error instanceof Error ? error.message : 'Failed to delete vacancy',
            );
        }
    };

    const handleChangeStatusVacancy = async (
        id: string,
        status: VacancyStatus,
    ) => {
        try {
            setActionError('');
            await updateVacancy(id, { status });
            await loadVacancies();
        } catch (error) {
            console.error(error);
            setActionError(
                error instanceof Error ? error.message : 'Failed to update vacancy status',
            );
        }
    };

    const handleDropVacancy = async (
        vacancyId: string,
        nextStatus: VacancyStatus,
    ) => {
        if (isMoving) return;

        const currentVacancy = vacancies.find((v) => v.id === vacancyId);

        if (!currentVacancy) return;
        if (currentVacancy.status === nextStatus) return;

        const previousVacancies = vacancies;

        const updatedVacancies = vacancies.map((v) =>
            v.id === vacancyId ? { ...v, status: nextStatus } : v,
        );

        setVacancies(updatedVacancies);
        setActionError('');
        setIsMoving(true);

        try {
            await updateVacancy(vacancyId, { status: nextStatus });
        } catch (error) {
            console.error(error);
            setVacancies(previousVacancies);
            setActionError(
                error instanceof Error ? error.message : 'Failed to move vacancy',
            );
        } finally {
            setIsMoving(false);
        }
    };

    return {
        vacancies,
        filteredVacancies,
        isVacanciesLoading,
        vacanciesError,
        searchValue,
        statusFilter,
        viewMode,
        isHydrated,
        isFiltered,
        isMoving,
        actionError,

        setSearchValue,
        setStatusFilter,
        setViewMode,

        handleResetFilters,
        handleCreateVacancy,
        handleDeleteVacancy,
        handleChangeStatusVacancy,
        handleDropVacancy,
    };
}