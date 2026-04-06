'use client';

import { useDroppable } from '@dnd-kit/core';
import { DraggableVacancyCard } from './draggable-vacancy-card';
import {Vacancy, VacancyStatus} from "@/entities/vacancy/model/vacancy";

interface DroppableVacancyColumnProps {
    status: VacancyStatus;
    title: string;
    vacancies: Vacancy[];
    deletingVacancyId?: string | null;
    onDelete: (vacancyId: string) => Promise<void>;
}

export function DroppableVacancyColumn({
                                           status,
                                           title,
                                           vacancies,
                                           deletingVacancyId = null,
                                           onDelete,
                                       }: DroppableVacancyColumnProps) {
    const { isOver, setNodeRef } = useDroppable({
        id: status,
        data: {
            type: 'column',
            status,
        },
    });

    return (
        <div
            ref={setNodeRef}
            className={`min-w-[300px] flex-1 rounded-2xl border p-4 transition-all ${
                isOver
                    ? 'bg-blue-50 border-blue-300 shadow-sm'
                    : 'bg-gray-50/80 border-gray-200'
            }`}
        >
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-500">
          {vacancies.length}
        </span>
            </div>

            {vacancies.length === 0 ? (
                <div
                    className={`rounded-2xl border border-dashed bg-white p-6 text-center text-sm transition-colors ${
                        isOver ? 'border-blue-300 text-blue-600' : 'text-gray-400'
                    }`}
                >
                    Drop vacancy here
                </div>
            ) : (
                <div className="space-y-3">
                    {vacancies.map((vacancy) => (
                        <DraggableVacancyCard
                            key={vacancy.id}
                            vacancy={vacancy}
                            isDeleting={deletingVacancyId === vacancy.id}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}