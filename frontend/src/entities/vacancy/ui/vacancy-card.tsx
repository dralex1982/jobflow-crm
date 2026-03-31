'use client';

import { Vacancy, VacancyStatus } from '@/entities/vacancy/model/vacancy';
import {vacancyStatuses} from "@/shared/lib/constants/vacancy-status";


interface VacancyCardProps {
    vacancy: Vacancy;
    onStatusChange: (id: string, status: VacancyStatus) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export function VacancyCard({
                                vacancy,
                                onStatusChange,
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
                <select
                    value={vacancy.status}
                    onChange={(event) =>
                        onStatusChange(vacancy.id, event.target.value as VacancyStatus)
                    }
                    className="rounded border px-2 py-1 text-sm"
                >
                    {vacancyStatuses.map((status: string) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>

                <button
                    onClick={() => onDelete(vacancy.id)}
                    className="rounded border px-3 py-1 text-sm">
                    Delete
                </button>
            </div>
        </li>
    );
}