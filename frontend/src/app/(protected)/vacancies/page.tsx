'use client';

import {useEffect, useMemo, useState} from 'react';
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
import Link from "next/link";
import {VacanciesBoard} from "@/widgets/vacancies/vacancies-board/vacancies-board";
import {VacancyViewMode} from "@/features/vacancy/view-mode-switcher/model/view-mode";
import {getStorageItem, removeStorageItem, setStorageItem} from "@/shared/browser/local-storage";
import {LOCAL_STORAGE_KEYS} from "@/shared/config/local-storage";
import {ErrorMessage} from "@/shared/ui/error-message/error-message";
import {PageLoader} from "@/shared/ui/page-loader/page-loader";
import {EmptyState} from "@/shared/ui/empty-state/empty-state";

export default function VacanciesPage() {

    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [isVacanciesLoading, setIsVacanciesLoading] = useState(true);
    const [vacanciesError, setVacanciesError] = useState('');

    const [searchValue, setSearchValue] = useState('');
    const [statusFilter, setStatusFilter] = useState<VacancyStatus | ''>('');
    const [viewMode, setViewMode] = useState<VacancyViewMode>('list');

    const [isHydrated, setIsHydrated] = useState<boolean>(false);

    const isFiltered = Boolean(searchValue || statusFilter);

    const [moveError] = useState('');
    const [isMoving, setIsMoving] = useState(false);

    const [actionError, setActionError] = useState('');

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

    const filteredVacancies = useMemo(() => {
        return vacancies.filter((vacancy) => {
            const matchesSearch =
                vacancy.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                vacancy.company.toLowerCase().includes(searchValue.toLowerCase());

            const matchesStatus =
                !statusFilter || vacancy.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [vacancies, searchValue, statusFilter]);

    useEffect(() => {
        loadVacancies();
    }, []);

    const handleResetFilters = () => {
        setSearchValue('');
        setStatusFilter('');

        removeStorageItem(LOCAL_STORAGE_KEYS.vacanciesSearchValue);
        removeStorageItem(LOCAL_STORAGE_KEYS.vacanciesStatusFilter);
    };

    useEffect(() => {
        const savedSearchValue = getStorageItem(
            LOCAL_STORAGE_KEYS.vacanciesSearchValue,
        );

        const savedStatusFilter = getStorageItem(
            LOCAL_STORAGE_KEYS.vacanciesStatusFilter,
        );

        const savedViewMode = getStorageItem(
            LOCAL_STORAGE_KEYS.vacanciesViewMode,
        );

        if (savedSearchValue) {
            setSearchValue(savedSearchValue);
        }

        if (
            savedStatusFilter &&
            Object.values(VacancyStatus).includes(savedStatusFilter as VacancyStatus)
        ) {
            setStatusFilter(savedStatusFilter as VacancyStatus);
        }

        if (savedViewMode === 'list' || savedViewMode === 'board') {
            setViewMode(savedViewMode);
        }

        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (!isHydrated) return;

        setStorageItem(
            LOCAL_STORAGE_KEYS.vacanciesSearchValue,
            searchValue,
        );
    }, [searchValue, isHydrated]);

    useEffect(() => {
        if (!isHydrated) return;

        setStorageItem(
            LOCAL_STORAGE_KEYS.vacanciesViewMode,
            viewMode,
        );
    }, [viewMode, isHydrated]);

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
            setActionError(
                error instanceof Error ? error.message : 'Failed to create vacancy',
            );
        }
    };

    const handleDeleteVacancy = async (id: string) => {
        try {
            await deleteVacancy(id);
            await loadVacancies();
        } catch (error) {
            console.error(error);
            setActionError(
                error instanceof Error ? error.message : 'Failed to delete vacancy',
            );
        }
    };

    const handleChangeStatusVacancy = async (id: string, status: VacancyStatus) => {
        try {
            setActionError('');

            const updatedVacancy = await updateVacancy(id, {status});

            setVacancies((prev) =>
                prev.map((vacancy) =>
                    vacancy.id === id ? updatedVacancy : vacancy,
                ),
            );
        } catch (error) {
            console.error(error);
            setActionError(
                error instanceof Error ? error.message : 'Failed to update vacancy status',
            );
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
            v.id === vacancyId ? {...v, status: nextStatus} : v,
        );

        setVacancies(updatedVacancies);
        setVacanciesError('');
        setIsMoving(true);

        try {
            await updateVacancy(vacancyId, {status: nextStatus});
        } catch (error) {
            console.error(error);
            setVacancies(previousVacancies);
            setActionError(
                error instanceof Error ? error.message : 'Failed to move vacancy',
            );
        }
    };


    if (isVacanciesLoading || !isHydrated) {
        return <PageLoader text={"Loading vacancies..."}/>
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
                viewMode={viewMode}
                onSearchChange={setSearchValue}
                onStatusFilterChange={setStatusFilter}
                onViewModeChange={setViewMode}
                onResetFilters={handleResetFilters}
            />

            <div
                className="flex items-center justify-between rounded-lg border bg-gray-50 px-4 py-2 text-sm text-gray-600">
                <span>
                    {isFiltered
                        ? `Showing ${filteredVacancies.length} of ${vacancies.length} vacancies`
                        : `${vacancies.length} vacancies`}
                </span>

                <span>{viewMode === 'board' ? 'Board view' : 'List view'}</span>
            </div>

            {vacanciesError && <ErrorMessage message={vacanciesError}/>}

            {!isVacanciesLoading && !vacanciesError && vacancies.length === 0 && (
                <EmptyState title={"No vacancies yet"}/>
            )}

            {!isVacanciesLoading &&
                !vacanciesError &&
                vacancies.length > 0 &&
                filteredVacancies.length === 0 && (
                    <EmptyState
                        title={"No vacancies match current filters"}
                        description={"Create your first vacancy to start tracking your pipeline."
                        }/>
                )}

            {moveError ? <ErrorMessage message={moveError}/> : null}

            {isMoving ? <PageLoader text={"Updating vacancy status..."}/> : null}

            {actionError ? <ErrorMessage message={actionError}/> : null}

            {filteredVacancies.length === 0 ? (
                <EmptyState
                    title="No vacancies match current filters"
                    description="Try changing search or status filters."
                />
            ) : viewMode === 'list' ? (
                <div className="space-y-4">
                    {filteredVacancies.map(vacancy => (
                        <VacancyCard
                            key={vacancy.id}
                            vacancy={vacancy}
                            onDelete={handleDeleteVacancy}
                            onStatusChange={handleChangeStatusVacancy}
                        />
                    ))}
                </div>
            ) : (
                <div className="h-[calc(100vh-220px)] overflow-auto">
                    <div className="h-[calc(100vh-220px)] overflow-x-auto">
                        <VacanciesBoard
                            vacancies={filteredVacancies}
                            onDelete={handleDeleteVacancy}
                            onStatusChange={handleChangeStatusVacancy}
                        />
                    </div>
                </div>

            )}
        </main>)
}