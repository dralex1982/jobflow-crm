'use client';
import {useRouter} from 'next/navigation';
import {useAuthStore} from "@/features/auth/model/use-auth-store";
import {useEffect, useState} from "react";
import {
    createVacancy,
    deleteVacancy,
    getVacancies,
    updateVacancy,
} from "@/shared/api/vacancies";
import {Vacancy, VacancyStatus} from "@/entities/vacancy/model/vacancy";
import VacanciesPage from "@/app/vacancies/page";
import {getDashboardStats} from "@/shared/lib/vacancies/get-dashboard-stats";
import {SummaryCards} from "@/widgets/dashboard/summary-cards/summary-cards";
import {RecentVacancies} from "@/widgets/dashboard/recent-vacancies/recent-vacancies";
import {groupVacanciesByStatus} from "@/shared/lib/vacancies/group-vacancies-by-status";
import {VacancyPipeline} from "@/widgets/vacancy-pipeline/vacancy-pipeline";

export default function DashboardPage() {
    const router = useRouter();

    const {user, isAuth, isLoading, logout} = useAuthStore();

    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [isVacanciesLoading, setIsVacanciesLoading] = useState(true);
    const [vacanciesError, setVacanciesError] = useState('');

    useEffect(() => {
        if (!isLoading && !isAuth) {
            router.replace('/login');
        }
    }, [isLoading, isAuth, router]);

    useEffect(() => {
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

        loadVacancies();
    }, [isLoading, isAuth]);

    const stats = getDashboardStats(vacancies);

    const recentVacancies = [...vacancies]
        .sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        })
        .slice(0, 5);


    if (isLoading || isVacanciesLoading) {
        return <div className={"p-6"}>Loading dashboard...</div>;
    }

    if (vacanciesError) {
        return <div>{vacanciesError}</div>;
    }

    if (!isAuth) {
        return null;
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-sm text-gray-500">
                        Overview of your job search process
                    </p>
                </div>



                <div className="flex gap-2">


                    <button
                        className="rounded-lg border px-4 py-2"
                        onClick={() => router.push('/vacancies')}
                    >
                        View all vacancies
                    </button>

                    <button
                        className="rounded-lg border px-4 py-2"
                        onClick={() => router.push('/vacancies')}
                    >
                        Add vacancy
                    </button>
                </div>
            </div>

            <SummaryCards
                total={stats.total}
                applied={stats.applied}
                interview={stats.interview}
                offers={stats.offers}
            />

            <RecentVacancies vacancies={recentVacancies} />
        </div>
    );
}