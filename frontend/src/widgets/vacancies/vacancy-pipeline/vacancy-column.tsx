import { Vacancy, VacancyStatus } from '@/entities/vacancy/model/vacancy';
import { VacancyBoardCard } from '@/entities/vacancy/ui/vacancy-board-card';
import { VACANCY_STATUS_LABELS } from '@/entities/vacancy/model/vacancy-status-config';

type Props = {
    status: VacancyStatus;
    vacancies: Vacancy[];
    onDelete: (id: string) => void;
    onStatusChange: (id: string, status: VacancyStatus) => void;
};

export const VacanciesColumn = ({
                                    status,
                                    vacancies,
                                    onDelete,
                                    onStatusChange,
                                }: Props) => {
    return (
        <section className="flex min-h-[500px] flex-col rounded-2xl border bg-gray-50 p-3">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                    {VACANCY_STATUS_LABELS[status]}
                </h2>

                <span className="rounded-full border bg-white px-2.5 py-1 text-xs font-medium">
          {vacancies.length}
        </span>
            </div>

            {vacancies.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed bg-white/70 p-4 text-center text-sm text-gray-400">
                    No vacancies in this status
                </div>
            ) : (
                <div className="space-y-3">
                    {vacancies.map((vacancy) => (
                        <VacancyBoardCard
                            key={vacancy.id}
                            vacancy={vacancy}
                            onDelete={onDelete}
                            onStatusChange={onStatusChange}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};