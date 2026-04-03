import { VacancyStatus } from '@/entities/vacancy/model/vacancy';
import { ViewModeSwitcher } from '@/features/vacancy/view-mode-switcher/view-mode-switcher';

type ViewMode = 'list' | 'board';

type Props = {
    searchValue: string;
    statusFilter: VacancyStatus | '';
    viewMode: ViewMode;
    onSearchChange: (value: string) => void;
    onStatusFilterChange: (value: VacancyStatus | '') => void;
    onViewModeChange: (value: ViewMode) => void;
    onResetFilters: () => void;
};

export const VacanciesToolbar = ({
                                     searchValue,
                                     statusFilter,
                                     viewMode,
                                     onSearchChange,
                                     onStatusFilterChange,
                                     onViewModeChange,
                                     onResetFilters,
                                 }: Props) => {
    return (
        <div className="flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-col gap-3 md:flex-row">
                <input
                    className="rounded-lg border px-3 py-2"
                    type="text"
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
                    <option value={VacancyStatus.SAVED}>Saved</option>
                    <option value={VacancyStatus.APPLIED}>Applied</option>
                    <option value={VacancyStatus.SCREENING}>Screening</option>
                    <option value={VacancyStatus.INTERVIEW}>Interview</option>
                    <option value={VacancyStatus.OFFER}>Offer</option>
                    <option value={VacancyStatus.REJECTED}>Rejected</option>
                </select>

                <button
                    type="button"
                    className="rounded-lg border px-3 py-2"
                    onClick={onResetFilters}
                >
                    Reset
                </button>
            </div>

            <ViewModeSwitcher
                value={viewMode}
                onChange={onViewModeChange}
            />
        </div>
    );
};