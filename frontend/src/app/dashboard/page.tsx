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
import {VacancyCard} from "@/entities/vacancy/ui/vacancy-card";
import {CreateVacancyForm} from "@/features/vacancy/create-vacancy-form/create-vacancy-form";
import VacanciesPage from "@/app/vacancies/page";

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
        if (!isAuth) {
            return;
        }

        getVacancies()
            .then((data) => setVacancies(data))
            .finally(() => setIsVacanciesLoading(false));
    }, [isAuth]);


    async function handleCreateVacancy(data: {
        title: string;
        company: string;
        notes?: string;
    }) {
        const newVacancy = await createVacancy(data);

        setVacancies((prev) => [newVacancy, ...prev]);
    }


    async function handleStatusChange(id: string, status: VacancyStatus) {
        const updatedVacancy = await updateVacancy(id, {status});

        setVacancies((prev) =>
            prev.map((item) => (item.id === id ? updatedVacancy : item)),
        );
    }

    async function handleDelete(id: string) {
        await deleteVacancy(id);

        setVacancies((prev) => prev.filter((item) => item.id !== id));
    }

    if (isLoading) {
        return <div className={"p-6"}>Loading...</div>;
    }

    if (!isAuth) {
        return null;
    }

    return (
        <main className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        Welcome, {user?.firstName ?? user?.email}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Here is your job search dashboard
                    </p>
                </div>

                <button
                    onClick={logout} className="rounded border px-4 py-2">
                    Logout
                </button>
            </div>

            <VacanciesPage/>
        </main>
    );
}