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
import {DndContext, DragOverlay} from "@dnd-kit/core";
import {DraggableVacancyCard} from "@/entities/vacancy/ui/draggable-vacancy-card";
import {VacancyAnalysisPanel} from "@/features/vacancy/analyze-vacancy/ui/vacancy-analysis-panel";

export default function VacanciesPage() {

    const {
        vacancies,
        isVacanciesLoading,
        vacanciesError,
        viewMode,
        isHydrated,

        setViewMode,

        deletingVacancyId,
        actionError,
        handleCreateVacancy,
        handleDeleteVacancy,
        handleUpdateVacancyStatus,

        searchValue,
        statusFilter,
        isFiltered,
        filteredVacancies,
        isFiltersHydrated,
        setSearchValue,
        setStatusFilter,
        handleResetFilters,

        activeVacancy,
        handleDragStart,
        handleDragEnd,

        loadingAnalysisVacancyId,
        reanalyzingVacancyId,
        analysisResult,
        analysisTargetVacancy,
        analysisError,
        handleAnalyzeVacancy,
        handleReanalyzeVacancy,
        handleCloseAnalysis,
    } = useVacanciesPage();


    if (isVacanciesLoading || !isHydrated) {
        return <PageLoader text="Loading vacancies..."/>;
    }

    if (vacanciesError) {
        return <ErrorMessage message={vacanciesError}/>;
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

            {actionError ? <ErrorMessage message={actionError}/> : null}

            {vacancies.length === 0 ? (
                <EmptyState
                    title="No vacancies yet"
                    description="Create your first vacancy to start tracking your pipeline."
                />
            ) : filteredVacancies.length === 0 ? (
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
                        />
                    ))}
                </div>
            ) : (

                <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    <div className="h-[calc(100vh-220px)] overflow-x-auto">
                        <p className="mt-2 text-sm text-gray-500">
                            Drag cards between columns to update vacancy stage
                        </p>
                        <VacanciesBoard
                            vacancies={filteredVacancies}
                            deletingVacancyId={deletingVacancyId}
                            analyzingVacancyId={loadingAnalysisVacancyId ?? reanalyzingVacancyId}
                            onDelete={handleDeleteVacancy}
                            onAnalyze={handleAnalyzeVacancy}
                        />
                    </div>
                    {analysisTargetVacancy ? (
                        <div className="mt-6">
                            <VacancyAnalysisPanel
                                title={analysisTargetVacancy.title}
                                company={analysisTargetVacancy.company}
                                result={analysisResult}
                                error={analysisError}
                                isLoading={loadingAnalysisVacancyId === analysisTargetVacancy.id}
                                isReanalyzing={reanalyzingVacancyId === analysisTargetVacancy.id}
                                onReanalyze={() => handleReanalyzeVacancy(analysisTargetVacancy.id)}
                                onClose={handleCloseAnalysis}
                            />
                        </div>
                    ) : null}
                    <DragOverlay>
                        {activeVacancy ? (
                            <div className="w-[300px] opacity-95">
                                <DraggableVacancyCard
                                    vacancy={activeVacancy}
                                    onDelete={handleDeleteVacancy}
                                />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            )}
        </PageShell>)
}