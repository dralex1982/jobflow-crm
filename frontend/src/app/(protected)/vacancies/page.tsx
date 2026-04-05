'use client';

import {VacancyCard} from '@/entities/vacancy/ui/vacancy-card';
import {CreateVacancyForm} from '@/features/vacancy/create-vacancy-form/create-vacancy-form';
import {VacanciesToolbar} from '@/features/vacancy/vacancies-toolbar/vacancies-toolbar';
import Link from "next/link";
import {VacanciesBoard} from "@/widgets/vacancies/vacancies-board/vacancies-board";
import {ErrorMessage} from "@/shared/ui/error-message/error-message";
import {PageLoader} from "@/shared/ui/page-loader/page-loader";
import {EmptyState} from "@/shared/ui/empty-state/empty-state";
import {useVacanciesPage} from "@/features/auth/model/use-vacancies-page";
import {PageShell} from "@/shared/ui/page-shell/page-shell";
import {PageHeader} from "@/shared/ui/page-header/page-header";

export default function VacanciesPage() {

    const {
        filteredVacancies,
        vacancies,
        isVacanciesLoading,
        vacanciesError,
        searchValue,
        statusFilter,
        viewMode,
        isHydrated,
        isFiltered,
        isMoving,
        actionError,
        setSearchValue,
        setStatusFilter,
        setViewMode,
        handleResetFilters,
        handleCreateVacancy,
        handleDeleteVacancy,
        handleChangeStatusVacancy,
        handleDropVacancy,
    } = useVacanciesPage();


    if (isVacanciesLoading || !isHydrated) {
        return <PageLoader text="Loading vacancies..." />;
    }

    if (vacanciesError) {
        return <ErrorMessage message={vacanciesError} />;
    }

    return (
        <PageShell>
            <PageHeader
                title={"Vacancies"}
                description={"Manage your job applications and pipeline"}
                action={
                <Link
                    href="/dashboard"
                    className="rounded-lg border px-4 py-2 text-sm">
                    Back to dashboard
                </Link>}
            />
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
        </PageShell>)
}