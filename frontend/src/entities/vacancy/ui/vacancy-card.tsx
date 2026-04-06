'use client';

import {Vacancy} from '@/entities/vacancy/model/vacancy';


interface VacancyCardProps {
    vacancy: Vacancy;
    onDelete: (id: string) => Promise<void>;
}

export function VacancyCard({
                                vacancy,
                                onDelete,
                            }: VacancyCardProps) {
    return (
        <li className="rounded-xl border p-4">

            <div className="font-medium">{vacancy.title}</div>
            <div className="text-sm text-gray-500">{vacancy.company}</div>

            {vacancy.notes ? (
                <p className="mt-2 text-sm text-gray-700">{vacancy.notes}</p>
            ) : null}

            <div className="mt-4 flex items-center gap-2">
                <button
                    onClick={() => onDelete(vacancy.id)}
                    className="rounded border px-3 py-1 text-sm">
                    Delete
                </button>
            </div>
        </li>
    );
}