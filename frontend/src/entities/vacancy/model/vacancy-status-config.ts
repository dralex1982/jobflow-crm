import { VacancyStatus } from './vacancy';

export const VACANCY_STATUS_LABELS: Record<VacancyStatus, string> = {
    [VacancyStatus.SAVED]: 'Saved',
    [VacancyStatus.APPLIED]: 'Applied',
    [VacancyStatus.SCREENING]: 'Screening',
    [VacancyStatus.INTERVIEW]: 'Interview',
    [VacancyStatus.OFFER]: 'Offer',
    [VacancyStatus.REJECTED]: 'Rejected',
};

export const VACANCY_STATUS_BADGE_STYLES: Record<VacancyStatus, string> = {
    [VacancyStatus.SAVED]: 'bg-gray-100 text-gray-700 border-gray-200',
    [VacancyStatus.APPLIED]: 'bg-blue-100 text-blue-700 border-blue-200',
    [VacancyStatus.SCREENING]: 'bg-violet-100 text-violet-700 border-violet-200',
    [VacancyStatus.INTERVIEW]: 'bg-amber-100 text-amber-700 border-amber-200',
    [VacancyStatus.OFFER]: 'bg-green-100 text-green-700 border-green-200',
    [VacancyStatus.REJECTED]: 'bg-red-100 text-red-700 border-red-200',
};