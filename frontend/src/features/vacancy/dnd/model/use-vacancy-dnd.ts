'use client';

import {useMemo, useState} from 'react';
import {DragEndEvent, DragStartEvent} from '@dnd-kit/core';
import {Vacancy, VacancyStatus} from '@/entities/vacancy/model/vacancy';

type UseVacancyDndParams = {
    vacancies: Vacancy[];
    onUpdateStatus: (vacancyId: string, nextStatus: VacancyStatus) => Promise<void>;
};

type UseVacancyDndReturn = {
    activeVacancy: Vacancy | null;
    handleDragStart: (event: DragStartEvent) => void;
    handleDragEnd: (event: DragEndEvent) => Promise<void>;
};

export function useVacancyDnd({
                                  vacancies,
                                  onUpdateStatus,
                              }: UseVacancyDndParams): UseVacancyDndReturn {
    const [activeVacancyId, setActiveVacancyId] = useState<string | null>(null);

    const activeVacancy = useMemo(() => {
        if (!activeVacancyId) {
            return null;
        }

        return vacancies.find((vacancy) => vacancy.id === activeVacancyId) ?? null;
    }, [activeVacancyId, vacancies]);

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

        if (currentVacancy.status === nextStatus) {
            return;
        }

        await onUpdateStatus(vacancyId, nextStatus);
    };

    return {
        activeVacancy,
        handleDragStart,
        handleDragEnd,
    };
}