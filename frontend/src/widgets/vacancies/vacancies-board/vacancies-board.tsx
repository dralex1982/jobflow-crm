import {Vacancy, VacancyStatus} from '@/entities/vacancy/model/vacancy';
import {groupVacanciesByStatus} from '@/shared/lib/vacancies/group-vacancies-by-status';
import {DroppableVacancyColumn} from "@/entities/vacancy/ui/droppable-vacancy-column";
import {VACANCY_STATUS_LABELS} from "@/entities/vacancy/model/vacancy-status-config";

type VacanciesBoardProps = {
    vacancies: Vacancy[];
    deletingVacancyId?: string | null;
    analyzingVacancyId?: string | null;
    onDelete: (id: string) => Promise<void>;
    onAnalyze: (id: string) => Promise<void>;
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
                                   analyzingVacancyId,
                                   onDelete,
                                   onAnalyze,
                               }: VacanciesBoardProps) => {
    const groupedVacancies = groupVacanciesByStatus(vacancies);

    return (
        <div className="grid auto-cols-[300px] grid-flow-col gap-4">
            {STATUS_ORDER.map((status) => (
                <DroppableVacancyColumn
                    key={status}
                    status={status}
                    title={VACANCY_STATUS_LABELS[status]}
                    vacancies={groupedVacancies[status]}
                    deletingVacancyId={deletingVacancyId}
                    loadingAnalysisVacancyId={analyzingVacancyId}
                    onDelete={onDelete}
                    onOpenAnalysis={onAnalyze}
                />
            ))}
        </div>
    );
};