'use client';

import {VacancyStatus} from '@/entities/vacancy/model/vacancy';
import {vacancyStatuses} from '@/shared/lib/constants/vacancy-status';

interface VacanciesToolbarProps {
    searchValue: string;
    statusFilter: string;
    onSearchChange: (value: string) => void;
    onStatusFilterChange: (value: string) => void;
    onReset: () => void;
}

export function VacanciesToolbar({
                                     searchValue,
                                     statusFilter,
                                     onSearchChange,
                                     onStatusFilterChange,
                                     onReset,
                                 }: VacanciesToolbarProps) {
    return (
        <div className="flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center">
            <input
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search by title or company"
                className="w-full rounded border px-3 py-2"
            />

            <select
                value={statusFilter}
                onChange={(event) => onStatusFilterChange(event.target.value)}
                className="rounded border px-3 py-2"
            >
                <option value="">All statuses</option>


                {vacancyStatuses.map((status: string) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>

            <button
                type="button"
                onClick={onReset}
                className="rounded border px-4 py-2"
            >
                Reset
            </button>
        </div>
    );
}