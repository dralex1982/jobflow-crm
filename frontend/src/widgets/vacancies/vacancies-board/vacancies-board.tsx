import { Vacancy, VacancyStatus } from '@/entities/vacancy/model/vacancy';
import { groupVacanciesByStatus } from '@/shared/lib/vacancies/group-vacancies-by-status';
import {VacancyCard} from "@/entities/vacancy/ui/vacancy-card";
import {VacancyBoardCard} from "@/widgets/vacancies/vacancies-board-card/vacancies-board-card";

type Props = {
    vacancies: Vacancy[];
    onDelete: (id: string) => Promise<void>;
    onStatusChange: (id: string, status: VacancyStatus) => Promise<void>;
};

const STATUS_ORDER: VacancyStatus[] = [
    VacancyStatus.SAVED,
    VacancyStatus.APPLIED,
    VacancyStatus.SCREENING,
    VacancyStatus.INTERVIEW,
    VacancyStatus.OFFER,
    VacancyStatus.REJECTED,
];

export const VacanciesBoard = ({
                                   vacancies,
                                   onDelete,
                                   onStatusChange,
                               }: Props) => {
    const groupedVacancies = groupVacanciesByStatus(vacancies);

    return (
        <div className="overflow-x-auto scroll-smooth">
            <div className="flex gap-4 min-w-max">
                {STATUS_ORDER.map((status) => (
                    <div
                        key={status}
                        className="w-[240px] shrink-0 rounded-xl border bg-gray-50 p-3"
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-sm font-semibold">{status}</h2>

                            <span className="rounded-full border px-2 py-0.5 text-xs">
                {groupedVacancies[status].length}
              </span>
                        </div>

                        <div className="space-y-3">
                            {groupedVacancies[status].length === 0 ? (
                                <div className="rounded-lg border border-dashed p-3 text-sm text-gray-500">
                                    No vacancies
                                </div>
                            ) : (
                                groupedVacancies[status].map((vacancy) => (
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
                ))}
            </div>
        </div>
    );
};