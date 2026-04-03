import { Vacancy, VacancyStatus } from '@/entities/vacancy/model/vacancy';
import { VacancyBoardCard } from '@/entities/vacancy/ui/vacancy-board-card';
import { groupVacanciesByStatus } from '@/shared/lib/vacancies/group-vacancies-by-status';

type Props = {
    vacancies: Vacancy[];
    onDelete: (id: string) => void;
    onStatusChange: (id: string, status: VacancyStatus) => void;
};

const STATUS_ORDER: VacancyStatus[] = [
    VacancyStatus.SAVED,
    VacancyStatus.APPLIED,
    VacancyStatus.SCREENING,
    VacancyStatus.INTERVIEW,
    VacancyStatus.OFFER,
    VacancyStatus.REJECTED,
];

const STATUS_LABELS: Record<VacancyStatus, string> = {
    SAVED: 'Saved',
    APPLIED: 'Applied',
    SCREENING: 'Screening',
    INTERVIEW: 'Interview',
    OFFER: 'Offer',
    REJECTED: 'Rejected',
};

export const VacanciesBoard = ({
                                   vacancies,
                                   onDelete,
                                   onStatusChange,
                               }: Props) => {
    const grouped = groupVacanciesByStatus(vacancies);

    return (
        <div className="overflow-x-auto scroll-smooth">
            <div className="inline-flex flex-nowrap gap-4 p-1">
                {STATUS_ORDER.map((status) => {
                    const items = grouped[status];

                    return (
                        <div
                            key={status}
                            className="w-[220px] min-w-[220px] shrink-0 rounded-xl border bg-gray-50 p-3"
                        >
                            {/* Header */}
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-sm font-semibold">
                                    {STATUS_LABELS[status]}
                                </h2>

                                <span className="rounded-full border px-2 py-0.5 text-xs">
                  {items.length}
                </span>
                            </div>

                            {/* Content */}
                            <div className="space-y-3">
                                {items.length === 0 ? (
                                    <div className="rounded-lg border border-dashed p-3 text-sm text-gray-500">
                                        No vacancies
                                    </div>
                                ) : (
                                    items.map((vacancy) => (
                                        <VacancyBoardCard
                                            key={vacancy.id}
                                            vacancy={vacancy}
                                            onDelete={onDelete}
                                            onStatusChange={onStatusChange}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};