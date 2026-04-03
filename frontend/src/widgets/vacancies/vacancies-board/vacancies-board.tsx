import { Vacancy, VacancyStatus } from '@/entities/vacancy/model/vacancy';
import { VacancyBoardCard } from '@/entities/vacancy/ui/vacancy-board-card';
import { groupVacanciesByStatus } from '@/shared/lib/vacancies/group-vacancies-by-status';
import {VacanciesColumn} from "@/widgets/vacancies/vacancy-pipeline/vacancy-column";

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

export const VacanciesBoard = ({
                                   vacancies,
                                   onDelete,
                                   onStatusChange,
                               }: Props) => {
    const groupedVacancies = groupVacanciesByStatus(vacancies);

    return (
                <div className="grid auto-cols-[260px] grid-flow-col gap-4">
                    {STATUS_ORDER.map((status) => (
                        <VacanciesColumn
                            key={status}
                            status={status}
                            vacancies={groupedVacancies[status]}
                            onDelete={onDelete}
                            onStatusChange={onStatusChange}
                        />
                    ))}
                </div>
    );
};