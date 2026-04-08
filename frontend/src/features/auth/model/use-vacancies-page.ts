'use client';

import {useEffect, useState} from 'react';
import {getVacancies} from '@/shared/api/vacancies';
import {Vacancy} from '@/entities/vacancy/model/vacancy';
import {VacancyViewMode} from '@/features/vacancy/view-mode-switcher/model/view-mode';
import {getStorageItem, setStorageItem} from '@/shared/browser/local-storage';
import {LOCAL_STORAGE_KEYS} from '@/shared/config/local-storage';
import {useVacancyAnalysis} from "@/features/vacancy/analyze-vacancy/model/use-vacancy-analysis";
import {useVacancyActions} from "@/features/vacancy/actions/model/use-vacancy-actions";
import {useVacancyFilters} from "@/features/vacancy/filters";
import {useVacancyDnd} from "@/features/vacancy/dnd";

export function useVacanciesPage() {
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [isVacanciesLoading, setIsVacanciesLoading] = useState(true);
    const [vacanciesError, setVacanciesError] = useState('');

    const [viewMode, setViewMode] = useState<VacancyViewMode>('list');

    const [isHydrated, setIsHydrated] = useState(false);

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

        void loadVacancies();
    }, []);


    useEffect(() => {
        const savedViewMode = getStorageItem(
            LOCAL_STORAGE_KEYS.vacanciesViewMode,
        );

        if (savedViewMode === 'list' || savedViewMode === 'board') {
            setViewMode(savedViewMode);
        }

        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (!isHydrated) return;

        setStorageItem(
            LOCAL_STORAGE_KEYS.vacanciesViewMode,
            viewMode,
        );
    }, [viewMode, isHydrated]);

    const actions = useVacancyActions({
        vacancies,
        setVacancies
    })

    const filters = useVacancyFilters(vacancies);

    const analysis = useVacancyAnalysis(vacancies);

    const dnd = useVacancyDnd({
        vacancies,
        onUpdateStatus: actions.handleUpdateVacancyStatus,
    });

    return {
        vacancies,
        isVacanciesLoading,
        vacanciesError,
        viewMode,
        isHydrated,

        setViewMode,

        ...actions,
        ...filters,
        ...dnd,
        ...analysis
    };
}