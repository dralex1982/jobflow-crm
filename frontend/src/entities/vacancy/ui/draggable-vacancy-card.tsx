'use client';

import {useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';

import {StatusBadge} from './status-badge';
import {Vacancy} from "@/entities/vacancy/model/vacancy";

interface DraggableVacancyCardProps {
    vacancy: Vacancy;
    isDeleting?: boolean;
    onDelete?: (vacancyId: string) => Promise<void>;
}

export function DraggableVacancyCard({
                                         vacancy,
                                         isDeleting = false,
                                         onDelete,
                                     }: DraggableVacancyCardProps) {
    const {attributes, listeners, setNodeRef, transform, isDragging} =
        useDraggable({
            id: vacancy.id,
            data: {
                type: 'vacancy',
                vacancyId: vacancy.id,
                currentStatus: vacancy.status,
            },
        });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="rounded-2xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
            <div
                {...listeners}
                {...attributes}
                className="cursor-grab active:cursor-grabbing"
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-gray-900">
                            {vacancy.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">{vacancy.company}</p>
                    </div>

                    <StatusBadge status={vacancy.status}/>
                </div>

                {vacancy.notes ? (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-700">
                        {vacancy.notes}
                    </p>
                ) : (
                    <p className="mt-3 text-sm text-gray-400">No notes yet</p>
                )}
            </div>

            {onDelete ? (
                <div className="mt-4">
                    <button
                        className="w-full rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 disabled:opacity-50"
                        disabled={isDeleting}
                        onClick={() => onDelete(vacancy.id)}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            ) : null}
        </div>
    );
}