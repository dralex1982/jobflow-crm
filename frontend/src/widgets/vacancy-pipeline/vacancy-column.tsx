import { Vacancy, VacancyStatus } from '@/entities/vacancy/model/vacancy';
import { VacancyKanbanCard } from '@/entities/vacancy/ui/vacancy-kanban-card';
import {useState} from "react";

type Props = {
    title: string;
    status: VacancyStatus;
    vacancies: Vacancy[];
    onDropVacancy: (vacancyId: string, nextStatus: VacancyStatus) => void;
    isMoving?: boolean;
};

export const VacancyColumn = ({
                                  title,
                                  status,
                                  vacancies,
                                  onDropVacancy,
                                  isMoving = false,
                              }: Props) => {

    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        const vacancyId = e.dataTransfer.getData('vacancyId');
        setIsOver(false);

        if (!vacancyId || isMoving) return;

        onDropVacancy(vacancyId, status);
    };


    return (
        <div
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="min-h-[150px] rounded-xl border p-4"
        >
            <div className="mb-4 text-sm font-semibold text-gray-500">
                {title} ({vacancies.length})
            </div>

            <div className="space-y-3">
                {vacancies.map(vacancy => (
                    <VacancyKanbanCard
                        key={vacancy.id}
                        vacancy={vacancy}
                        isDisabled={isMoving} />
                ))}
            </div>
        </div>
    );
};