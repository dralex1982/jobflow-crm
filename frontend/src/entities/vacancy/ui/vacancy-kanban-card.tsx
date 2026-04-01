import {Vacancy} from '@/entities/vacancy/model/vacancy';

type Props = {
    vacancy: Vacancy;
    isDisabled?: boolean;
};

export const VacancyKanbanCard = ({
                                      vacancy, isDisabled = false,
                                  }: Props) => {
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('vacancyId', vacancy.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div
            draggable={!isDisabled}
            onDragStart={handleDragStart}
            className="cursor-grab rounded-lg border bg-white p-3 active:cursor-grabbing"
        >
            <div className="font-medium">{vacancy.title}</div>
            <div className="text-sm text-gray-500">{vacancy.company}</div>
        </div>
    );
};