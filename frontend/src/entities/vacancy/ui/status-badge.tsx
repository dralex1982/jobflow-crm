import { VacancyStatus } from '@/entities/vacancy/model/vacancy';
import {
    VACANCY_STATUS_BADGE_STYLES,
    VACANCY_STATUS_LABELS,
} from '@/entities/vacancy/model/vacancy-status-config';

type Props = {
    status: VacancyStatus;
};

export const StatusBadge = ({ status }: Props) => {
    return (
        <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${VACANCY_STATUS_BADGE_STYLES[status]}`}
        >
      {VACANCY_STATUS_LABELS[status]}
    </span>
    );
};