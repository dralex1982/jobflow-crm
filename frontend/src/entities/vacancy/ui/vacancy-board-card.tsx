import { Vacancy, VacancyStatus } from '@/entities/vacancy/model/vacancy';
import { StatusBadge } from '@/entities/vacancy/ui/status-badge';

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
        <article className="space-y-3 rounded-xl border bg-white p-3 shadow-sm">
            <div className="space-y-1">
                <h3 className="text-sm font-semibold leading-5">{vacancy.title}</h3>
                <p className="text-sm text-gray-500">{vacancy.company}</p>
            </div>

            <StatusBadge status={vacancy.status} />

            <select
                className="w-full rounded-lg border px-3 py-2 text-sm"
                value={vacancy.status}
                onChange={(event) =>
                    onStatusChange(vacancy.id, event.target.value as VacancyStatus)
                }
            >
                {Object.values(VacancyStatus).map((status) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>

            <button
                className="w-full rounded-lg border px-3 py-2 text-sm"
                onClick={() => onDelete(vacancy.id)}
            >
                Delete
            </button>
        </article>
    );
};