'use client';
import {useRouter} from 'next/navigation';
import {useAuthStore} from "@/features/auth/model/use-auth-store";
import {useEffect, useState} from "react";
import {createVacancy, getVacancies, Vacancy} from "@/shared/api/vacancies";

export default function DashboardPage() {
    const router = useRouter();

    const {user, isAuth, isLoading, logout} = useAuthStore();

    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [isVacanciesLoading, setIsVacanciesLoading] = useState(true);
    const [vacanciesError, setVacanciesError] = useState('');

    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [notes, setNotes] = useState('');

    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState('');

    useEffect(() => {
        if (!isLoading && !isAuth) {
            router.replace('/login');
        }
    }, [isLoading, isAuth, router]);

    useEffect(() => {
        if (!isAuth) {
            return;
        }

        async function loadVacancies() {
            try {
                setVacanciesError('');
                setIsVacanciesLoading(true);

                const data = await getVacancies();
                setVacancies(data);
            } catch (error) {
                setVacanciesError('Failed to load vacancies');
            } finally {
                setIsVacanciesLoading(false);
            }
        }

        loadVacancies();
    }, [isAuth]);

    async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setCreateError('');

        if (!title.trim() || !company.trim()) {
            setCreateError('Title and company are required');
            return;
        }

        try {
            setIsCreating(true);

            const newVacancy = await createVacancy({
                title: title.trim(),
                company: company.trim(),
                notes: notes.trim() || undefined,
            });

            setVacancies((prev) => [newVacancy, ...prev]);

            setTitle('');
            setCompany('');
            setNotes('');
        } catch (error) {
            setCreateError('Failed to create vacancy');
        } finally {
            setIsCreating(false);
        }
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
                    onClick={logout}
                    className="rounded border px-4 py-2"
                >
                    Logout
                </button>
            </div>

            <section className="mt-8 rounded-xl border p-4">
                <h2 className="text-lg font-semibold">Add Vacancy</h2>

                <form onSubmit={handleCreate} className="mt-4 space-y-3">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Position
                        </label>
                        <input
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Frontend Developer"
                            className="w-full rounded-md border px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Company
                        </label>
                        <input
                            value={company}
                            onChange={(event) => setCompany(event.target.value)}
                            placeholder="Google"
                            className="w-full rounded-md border px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Notes
                        </label>
                        <textarea
                            value={notes}
                            onChange={(event) => setNotes(event.target.value)}
                            placeholder="React + TypeScript, remote, strong UI focus"
                            className="w-full rounded-md border px-3 py-2"
                            rows={4}
                        />
                    </div>

                    {createError ? (
                        <p className="text-sm text-red-500">{createError}</p>
                    ) : null}

                    <button
                        type="submit"
                        disabled={isCreating}
                        className="rounded-md border px-4 py-2"
                    >
                        {isCreating ? 'Creating...' : 'Add Vacancy'}
                    </button>
                </form>
            </section>

            <section className="mt-8">
                <h2 className="text-lg font-semibold">Vacancies</h2>

                {isVacanciesLoading ? (
                    <p className="mt-4 text-sm text-gray-500">Loading vacancies...</p>
                ) : vacanciesError ? (
                    <p className="mt-4 text-sm text-red-500">{vacanciesError}</p>
                ) : vacancies.length === 0 ? (
                    <p className="mt-4 text-sm text-gray-500">
                        No vacancies yet. Add your first one.
                    </p>
                ) : (
                    <ul className="mt-4 space-y-3">
                        {vacancies.map((vacancy) => (
                            <li
                                key={vacancy.id}
                                className="rounded-xl border p-4"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="font-semibold">{vacancy.title}</h3>
                                        <p className="text-sm text-gray-500">{vacancy.company}</p>
                                    </div>

                                    <span className="rounded-full border px-3 py-1 text-xs">
                    {vacancy.status}
                  </span>
                                </div>

                                {vacancy.notes ? (
                                    <p className="mt-3 text-sm text-gray-600">{vacancy.notes}</p>
                                ) : null}

                                <p className="mt-3 text-xs text-gray-400">
                                    Created at: {new Date(vacancy.createdAt).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}