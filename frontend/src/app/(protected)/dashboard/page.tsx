'use client';

import {useEffect, useMemo, useState} from "react";
import {getVacancies} from "@/shared/api/vacancies";
import {Vacancy} from "@/entities/vacancy/model/vacancy";
import {SummaryCards} from "@/widgets/dashboard/summary-cards/summary-cards";
import {RecentVacancies} from "@/widgets/dashboard/recent-vacancies/recent-vacancies";
import {getVacancySummary} from "@/entities/vacancy/lib/get-vacancy-summary";
import {router} from "next/client";


export default function DashboardPage() {

    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [isVacanciesLoading, setIsVacanciesLoading] = useState(true);
    const [vacanciesError, setVacanciesError] = useState('');


    const summary = useMemo(() => getVacancySummary(vacancies), [vacancies]);

    useEffect(() => {
        const loadVacancies = async () => {
            try {
                setIsVacanciesLoading(true);
                setVacanciesError('');
                const data = await getVacancies();

                console.log(data);
                setVacancies(data);
            } catch (error) {
                console.error(error);
                setVacanciesError('Failed to load vacancies');
            } finally {
                setIsVacanciesLoading(false);
            }
        };

        loadVacancies();
    }, []);

    const stats = getVacancySummary(vacancies);

    const recentVacancies = [...vacancies]
        .sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        })
        .slice(0, 5);


    if (vacanciesError) {
        return <div>{vacanciesError}</div>;
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

            <SummaryCards summary={summary}/>

            <RecentVacancies vacancies={recentVacancies} />
        </div>
    );
}