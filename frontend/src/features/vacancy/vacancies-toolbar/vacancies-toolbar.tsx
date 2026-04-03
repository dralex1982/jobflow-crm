'use client';

import {VacancyStatus} from '@/entities/vacancy/model/vacancy';
import {ViewModeSwitcher} from "@/features/vacancy/view-mode-switcher/view-mode-switcher";
import {VacancyViewMode} from "@/features/vacancy/view-mode-switcher/model/view-mode";

type ViewMode = 'list' | 'board';

type Props = {
    searchValue: string;
    statusFilter: VacancyStatus | '';
    viewMode: ViewMode;
    onSearchChange: (value: string) => void;
    onStatusFilterChange: (value: VacancyStatus | '') => void;
    onViewModeChange: (value: VacancyViewMode) => void;
    onResetFilters: () => void;
};

export function VacanciesToolbar({
                                     searchValue,
                                     statusFilter,
                                     viewMode,
                                     onSearchChange,
                                     onStatusFilterChange,
                                     onViewModeChange,
                                     onResetFilters
                                 }: Props) {
    return (
        <div className="flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center">
            <input
                className="rounded-lg border px-3 py-2"
                placeholder="Search by title or company"
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
            />

            <select
                className="rounded-lg border px-3 py-2"
                value={statusFilter}
                onChange={(event) =>
                    onStatusFilterChange(event.target.value as VacancyStatus | '')
                }
            >
                <option value="">All statuses</option>
                {Object.values(VacancyStatus).map((status) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>

            <button
                type="button"
                className="rounded-lg border px-3 py-2"
                onClick={onResetFilters}
            >
                Reset
            </button>

            <ViewModeSwitcher
                value={viewMode}
                onChange={onViewModeChange}
            />
        </div>
    );
}