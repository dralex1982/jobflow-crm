import { Vacancy, VacancyStatus } from '@/entities/vacancy/model/vacancy';
import { VacancyBoardCard } from '@/entities/vacancy/ui/vacancy-board-card';
import { groupVacanciesByStatus } from '@/shared/lib/vacancies/group-vacancies-by-status';
import {VacanciesColumn} from "@/entities/vacancy/ui/vacancy-column";
import {DroppableVacancyColumn} from "@/entities/vacancy/ui/droppable-vacancy-column";

type Props = {
    vacancies: Vacancy[];
    deletingVacancyId?: string | null;
    onDelete: (id: string) => Promise<void>;
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
                                   deletingVacancyId = null,
                                   onDelete,
                               }: Props) => {
    const groupedVacancies = groupVacanciesByStatus(vacancies);

    return (
                <div className="grid auto-cols-[300px] grid-flow-col gap-4">
                    {STATUS_ORDER.map((status) => (
                        <DroppableVacancyColumn
                            key={status}
                            status={status}
                            title={status}
                            vacancies={groupedVacancies[status]}
                            deletingVacancyId={deletingVacancyId}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
    );
};