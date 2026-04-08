'use client';

import { useEffect, useMemo, useState } from 'react';
import { Vacancy, VacancyStatus } from '@/entities/vacancy/model/vacancy';
import {
    getStorageItem,
    removeStorageItem,
    setStorageItem,
} from '@/shared/browser/local-storage';
import { LOCAL_STORAGE_KEYS } from '@/shared/config/local-storage';

type UseVacancyFiltersReturn = {
    searchValue: string;
    statusFilter: VacancyStatus | '';
    isFiltered: boolean;
    filteredVacancies: Vacancy[];
    isFiltersHydrated: boolean;
    setSearchValue: (value: string) => void;
    setStatusFilter: (value: VacancyStatus | '') => void;
    handleResetFilters: () => void;
};

export function useVacancyFilters(
    vacancies: Vacancy[],
): UseVacancyFiltersReturn {
    const [searchValue, setSearchValue] = useState('');
    const [statusFilter, setStatusFilter] = useState<VacancyStatus | ''>('');
    const [isFiltersHydrated, setIsFiltersHydrated] = useState(false);

    const isFiltered = Boolean(searchValue || statusFilter);

    const filteredVacancies = useMemo(() => {
        return vacancies.filter((vacancy) => {
            const matchesSearch =
                vacancy.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                vacancy.company.toLowerCase().includes(searchValue.toLowerCase());

            const matchesStatus = !statusFilter || vacancy.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [vacancies, searchValue, statusFilter]);

    const handleResetFilters = () => {
        setSearchValue('');
        setStatusFilter('');

        removeStorageItem(LOCAL_STORAGE_KEYS.vacanciesSearchValue);
        removeStorageItem(LOCAL_STORAGE_KEYS.vacanciesStatusFilter);
    };

    useEffect(() => {
        const savedSearchValue = getStorageItem(
            LOCAL_STORAGE_KEYS.vacanciesSearchValue,
        );

        const savedStatusFilter = getStorageItem(
            LOCAL_STORAGE_KEYS.vacanciesStatusFilter,
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

        setIsFiltersHydrated(true);
    }, []);

    useEffect(() => {
        if (!isFiltersHydrated) return;

        setStorageItem(
            LOCAL_STORAGE_KEYS.vacanciesSearchValue,
            searchValue,
        );
    }, [searchValue, isFiltersHydrated]);

    useEffect(() => {
        if (!isFiltersHydrated) return;

        if (statusFilter) {
            setStorageItem(
                LOCAL_STORAGE_KEYS.vacanciesStatusFilter,
                statusFilter,
            );
            return;
        }

        removeStorageItem(LOCAL_STORAGE_KEYS.vacanciesStatusFilter);
    }, [statusFilter, isFiltersHydrated]);

    return {
        searchValue,
        statusFilter,
        isFiltered,
        filteredVacancies,
        isFiltersHydrated,
        setSearchValue,
        setStatusFilter,
        handleResetFilters,
    };
}