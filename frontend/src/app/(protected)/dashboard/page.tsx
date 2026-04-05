'use client';

import Link from 'next/link';

import { PageLoader } from '@/shared/ui/page-loader/page-loader';
import { ErrorMessage } from '@/shared/ui/error-message/error-message';
import { EmptyState } from '@/shared/ui/empty-state/empty-state';
import {SummaryCards} from "@/widgets/dashboard/summary-cards/summary-cards";
import {RecentVacancies} from "@/widgets/dashboard/recent-vacancies/recent-vacancies";
import {useDashboardPage} from "@/features/dashboard/model/use-dashboard-page";
import {PageShell} from "@/shared/ui/page-shell/page-shell";
import {PageHeader} from "@/shared/ui/page-header/page-header";

export default function DashboardPage() {
    const {
        summary,
        recentVacancies,
        vacancies,
        isLoading,
        error,
    } = useDashboardPage();

    if (isLoading) {
        return <PageLoader text="Loading dashboard..." />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    return (
        <PageShell>
            <PageHeader
                title={"Dashboard"}
                description={"Overview of your job search pipeline"}
                action={
                    <Link
                        href="/vacancies"
                        className="rounded-lg border px-4 py-2 text-sm"
                    >
                        Open vacancies
                    </Link>
                }/>

            <SummaryCards summary={summary} />

            {vacancies.length === 0 ? (
                <EmptyState
                    title="No vacancies yet"
                    description="Create your first vacancy to start tracking your job search."
                />
            ) : (
                <RecentVacancies vacancies={recentVacancies} />
            )}
        </PageShell>
    );
}