'use client';

import {useEffect, useMemo, useState} from 'react';
import {useRouter} from 'next/navigation';

import {useAuthStore} from '@/features/auth/model/use-auth-store';
import {
    createVacancy,
    deleteVacancy,
    getVacancies,
    updateVacancy
} from '@/shared/api/vacancies';

import {Vacancy, VacancyStatus} from '@/entities/vacancy/model/vacancy';
import {VacancyCard} from '@/entities/vacancy/ui/vacancy-card';
import {CreateVacancyForm} from '@/features/vacancy/create-vacancy-form/create-vacancy-form';
import {VacanciesToolbar} from '@/features/vacancy/vacancies-toolbar/vacancies-toolbar';
import {getDashboardStats} from "@/shared/lib/vacancies/get-dashboard-stats";
import Link from "next/link";
import {VacancyPipeline} from "@/widgets/vacancy-pipeline/vacancy-pipeline";
import {groupVacanciesByStatus} from "@/shared/lib/vacancies/group-vacancies-by-status";

export default function VacanciesPage() {

    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'pipeline'>('list');

    const [isVacanciesLoading, setIsVacanciesLoading] = useState(true);
    const [error, setError] = useState('');

    const [moveError, setMoveError] = useState('');
    const [isMoving, setIsMoving] = useState(false);

    const router = useRouter();

    const {user, isAuth, isLoading, logout} = useAuthStore();
    const [vacanciesError, setVacanciesError] = useState('');

    const filteredVacancies = vacancies.filter((vacancy) => {
        const matchesSearch =
            vacancy.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            vacancy.company.toLowerCase().includes(searchValue.toLowerCase());

        const matchesStatus =
            !statusFilter || vacancy.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleResetFilters = () => {
        setSearchValue('');
        setStatusFilter('');
    };

    useEffect(() => {
        if (!isLoading && !isAuth) {
            router.push('/login');
        }
    }, [isLoading, isAuth, router]);

    const loadVacancies = async () => {
        try {
            setIsVacanciesLoading(true);
            setVacanciesError('');

            const data = await getVacancies();
            setVacancies(data);
        } catch (error) {
            console.error(error);
            setVacanciesError('Failed to load vacancies');
        } finally {
            setIsVacanciesLoading(false);
        }
    };

    useEffect(() => {
        if (!isLoading && isAuth) {
            loadVacancies();
        }
    }, [isLoading, isAuth]);

    const handleCreateVacancy = async (payload: {
        title: string;
        company: string;
        notes?: string;
    }) => {
        try {
            await createVacancy(payload);
            await loadVacancies();
        } catch (error) {
            console.error(error);
            alert('Failed to create vacancy');
        }
    };

    const handleDeleteVacancy = async (id: string) => {
        try {
            await deleteVacancy(id);
            await loadVacancies();
        } catch (error) {
            console.error(error);
            alert('Failed to delete vacancy');
        }
    };

    const handleChangeStatus = async (id: string, status: VacancyStatus) => {
        try {
            await updateVacancy(id, {status});
            await loadVacancies();
        } catch (error) {
            console.error(error);
            alert('Failed to update vacancy status');
        }
    };


    const handleDropVacancy = async (
        vacancyId: string,
        nextStatus: VacancyStatus,
    ) => {

        if (isMoving) return;

        const currentVacancy = vacancies.find(v => v.id === vacancyId);

        if (!currentVacancy) return;
        if (currentVacancy.status === nextStatus) return;

        const previousVacancies = vacancies;

        const updatedVacancies = vacancies.map(v =>
            v.id === vacancyId ? { ...v, status: nextStatus } : v,
        );

        setVacancies(updatedVacancies);
        setError('');
        setIsMoving(true);

        try {
            await updateVacancy(vacancyId, { status: nextStatus });
        } catch (e) {
            console.error(e);
            setVacancies(previousVacancies);
            setError('Failed to move vacancy');
        }
    };
    if (isLoading) {
        return <div>Loading auth...</div>;
    }

    if (!isAuth) {
        return null;
    }

    return (
        <main className="p-6 space-y-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Vacancies</h1>
                    <p className="text-sm text-gray-500">
                        Manage your job applications and pipeline
                    </p>
                </div>
                <Link
                    href="/dashboard"
                    className="rounded-lg border px-4 py-2 text-sm"
                >
                    Back to dashboard
                </Link>
            </div>
            <CreateVacancyForm onCreate={handleCreateVacancy}/>
            <VacanciesToolbar
                searchValue={searchValue}
                statusFilter={statusFilter}
                onSearchChange={setSearchValue}
                onStatusFilterChange={setStatusFilter}
                onReset={handleResetFilters}
            />
            <div className="flex gap-2">
                <button onClick={() => setViewMode('list')}>List</button>
                <button onClick={() => setViewMode('pipeline')}>Pipeline</button>
            </div>

            {isVacanciesLoading && <div>Loading vacancies...</div>}

            {vacanciesError && <div>{vacanciesError}</div>}

            {!isVacanciesLoading && !vacanciesError && vacancies.length === 0 && (
                <div>No vacancies yet</div>
            )}

            {!isVacanciesLoading &&
                !vacanciesError &&
                vacancies.length > 0 &&
                filteredVacancies.length === 0 && (
                    <div>No vacancies match current filters</div>
                )}

            {moveError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    {moveError}
                </div>
            ) : null}

            {isMoving ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
                    Updating vacancy status...
                </div>
            ) : null}


            {!isVacanciesLoading && !vacanciesError && filteredVacancies.length > 0 &&
                (viewMode === 'list' ?
                    (<div className="space-y-4">
                        {filteredVacancies.map((vacancy) => (
                            <VacancyCard
                                key={vacancy.id}
                                vacancy={vacancy}
                                onDelete={handleDeleteVacancy}
                                onStatusChange={handleChangeStatus}
                            />
                        ))}
                    </div>) : (
                        <VacancyPipeline
                            vacancies={filteredVacancies}
                            onDropVacancy={handleDropVacancy}
                            isMoving={isMoving}
                        />
                    ))}
        </main>)
}