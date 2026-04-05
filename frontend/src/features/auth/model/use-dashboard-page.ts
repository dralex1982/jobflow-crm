'use client';

import { useEffect, useMemo, useState } from 'react';
import { getVacancies } from '@/shared/api/vacancies';
import { Vacancy } from '@/entities/vacancy/model/vacancy';
import { getVacancySummary } from '@/entities/vacancy/lib/get-vacancy-summary';

export function useDashboardPage() {
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadVacancies = async () => {
            try {
                setError('');
                setIsLoading(true);

                const data = await getVacancies();
                setVacancies(data);
            } catch (error) {
                console.error(error);
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Failed to load dashboard data',
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadVacancies();
    }, []);

    const summary = useMemo(() => {
        return getVacancySummary(vacancies);
    }, [vacancies]);

    const recentVacancies = useMemo(() => {
        return [...vacancies]
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            )
            .slice(0, 5);
    }, [vacancies]);

    return {
        vacancies,
        summary,
        recentVacancies,
        isLoading,
        error,
    };
}