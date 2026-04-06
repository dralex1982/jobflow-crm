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
import {DragEndEvent, DragStartEvent} from "@dnd-kit/core";
import {updateVacancyStatusLocally} from "@/shared/lib/vacancies/update-vacancy-status-locally";

export function useVacanciesPage() {
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [isVacanciesLoading, setIsVacanciesLoading] = useState(true);
    const [vacanciesError, setVacanciesError] = useState('');

    const [deletingVacancyId, setDeletingVacancyId] = useState<string | null>(null);
    const [activeVacancyId, setActiveVacancyId] = useState<string | null>(null);

    const [searchValue, setSearchValue] = useState('');
    const [statusFilter, setStatusFilter] = useState<VacancyStatus | ''>('');
    const [viewMode, setViewMode] = useState<VacancyViewMode>('list');

    const [isHydrated, setIsHydrated] = useState(false);
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

    useEffect(() => {
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

    const activeVacancy = activeVacancyId
        ? vacancies.find((vacancy) => vacancy.id === activeVacancyId) ?? null
        : null;

    const handleDragStart = (event: DragStartEvent) => {
        setActiveVacancyId(String(event.active.id));
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        setActiveVacancyId(null);

        const vacancyId = String(event.active.id);
        const nextStatus = event.over?.id as VacancyStatus | undefined;

        if (!nextStatus) return;

        const currentVacancy = vacancies.find((vacancy) => vacancy.id === vacancyId);
        if (!currentVacancy) return;

        const previousStatus = currentVacancy.status;

        if (previousStatus === nextStatus) {
            return;
        }

        const previousVacancies = vacancies;

        setVacancies((prev) =>
            updateVacancyStatusLocally(prev, vacancyId, nextStatus),
        );

        try {
            const updatedVacancy = await updateVacancy(vacancyId, {
                status: nextStatus,
            });

            setVacancies((prev) =>
                prev.map((vacancy) =>
                    vacancy.id === vacancyId ? updatedVacancy : vacancy,
                ),
            );
        } catch(error) {
            setVacancies(previousVacancies);
            setActionError(
                error instanceof Error ? error.message : 'Failed to update vacancy status',
            );
        }
    };

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


    return {
        vacancies,
        filteredVacancies,
        isVacanciesLoading,
        vacanciesError,
        searchValue,
        deletingVacancyId,
        statusFilter,
        viewMode,
        isHydrated,
        isFiltered,
        actionError,

        setSearchValue,
        setStatusFilter,
        setViewMode,

        handleResetFilters,
        handleCreateVacancy,
        handleDeleteVacancy,

        activeVacancy,
        handleDragStart,
        handleDragEnd,
    };
}