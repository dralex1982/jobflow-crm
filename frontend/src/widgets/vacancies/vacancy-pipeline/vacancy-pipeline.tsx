'use client';

import { useMemo, useState } from 'react';
import { Vacancy, VacancyStatus } from '@/entities/vacancy/model/vacancy';

import { groupVacanciesByStatus } from '@/shared/lib/vacancies/group-vacancies-by-status';

type Props = {
    vacancies: Vacancy[];
    onDropVacancy: (vacancyId: string, nextStatus:VacancyStatus) => void;
    isMoving?: boolean;
};

function VacancyColumn(props: {
    title: string,
    status: VacancyStatus,
    vacancies: Vacancy[],
    onDropVacancy: (vacancyId: string, nextStatus: VacancyStatus) => void,
    isMoving: boolean | undefined
}) {
    return null;
}

export const VacancyPipeline = ({
                                    vacancies,
                                    onDropVacancy,
                                    isMoving = false, }: Props) => {

    const grouped = useMemo(() => {
        return groupVacanciesByStatus(vacancies);
    }, [vacancies]);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 2xl:grid-cols-6">
                <VacancyColumn
                    title="Saved"
                    status={VacancyStatus.SAVED}
                    vacancies={grouped[VacancyStatus.SAVED]}
                    onDropVacancy={onDropVacancy}
                    isMoving={isMoving}
                />

                <VacancyColumn
                    title="Applied"
                    status={VacancyStatus.APPLIED}
                    vacancies={grouped[VacancyStatus.APPLIED]}
                    onDropVacancy={onDropVacancy}
                    isMoving={isMoving}
                />

                <VacancyColumn
                    title="Screening"
                    status={VacancyStatus.SCREENING}
                    vacancies={grouped[VacancyStatus.SCREENING]}
                    onDropVacancy={onDropVacancy}
                    isMoving={isMoving}
                />

                <VacancyColumn
                    title="Interview"
                    status={VacancyStatus.INTERVIEW}
                    vacancies={grouped[VacancyStatus.INTERVIEW]}
                    onDropVacancy={onDropVacancy}
                    isMoving={isMoving}
                />

                <VacancyColumn
                    title="Offer"
                    status={VacancyStatus.OFFER}
                    vacancies={grouped[VacancyStatus.OFFER]}
                    onDropVacancy={onDropVacancy}
                    isMoving={isMoving}
                />

                <VacancyColumn
                    title="Rejected"
                    status={VacancyStatus.REJECTED}
                    vacancies={grouped[VacancyStatus.REJECTED]}
                    onDropVacancy={onDropVacancy}
                    isMoving={isMoving}
                />
            </div>
        </div>
    );
};