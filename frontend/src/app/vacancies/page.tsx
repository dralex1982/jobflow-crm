'use client';

import {useEffect, useState} from 'react';
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

export default function VacanciesPage() {

    const router = useRouter();

    const {user, isAuth, isLoading, logout} = useAuthStore();

    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [isVacanciesLoading, setIsVacanciesLoading] = useState(true);
    const [vacanciesError, setVacanciesError] = useState('');

    const [searchValue, setSearchValue] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

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

    if (isLoading) {
        return <div>Loading auth...</div>;
    }

    if (!isAuth) {
        return null;
    }

    return (<main className="p-6 space-y-6">
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

        {!isVacanciesLoading && !vacanciesError && filteredVacancies.length > 0 &&
            (<div className="space-y-4">
                {filteredVacancies.map((vacancy) => (
                    <VacancyCard
                        key={vacancy.id}
                        vacancy={vacancy}
                        onDelete={handleDeleteVacancy}
                        onStatusChange={handleChangeStatus}
                    />
                ))}
            </div>)}
    </main>)
}