import { Vacancy, VacancyStatus } from '@/entities/vacancy/model/vacancy';

type Props = {
    vacancy: Vacancy;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, status: VacancyStatus) => void;
};

export const VacancyBoardCard = ({
                                     vacancy,
                                     onDelete,
                                     onStatusChange,
                                 }: Props) => {
    return (
        <div className="rounded-lg border bg-white p-2 shadow-sm hover:shadow-md transition">
            {/* Title */}
            <div className="text-sm font-medium line-clamp-2">
                {vacancy.title}
            </div>

            {/* Company */}
            <div className="text-xs text-gray-500 truncate">
                {vacancy.company}
            </div>

            {/* Status select */}
            <select
                className="text-[10px] text-gray-400 mb-1"
                value={vacancy.status}
                onChange={(e) =>
                    onStatusChange(vacancy.id, e.target.value as VacancyStatus)
                }
            >
                {Object.values(VacancyStatus).map((status) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>

            {/* Delete */}
            <button
                className="w-full rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
                onClick={() => onDelete(vacancy.id)}
            >
                Delete
            </button>
        </div>
    );
};