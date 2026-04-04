import Link from 'next/link';
import {Vacancy} from "@/entities/vacancy/model/vacancy";


interface RecentVacanciesProps {
    vacancies: Vacancy[];
}

export function RecentVacancies({ vacancies }: RecentVacanciesProps) {
    const recentVacancies = [...vacancies]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    return (
        <div className="rounded-xl border p-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent vacancies</h2>
                <Link href="/vacancies" className="text-sm underline">
                    View all
                </Link>
            </div>

            <div className="mt-4 space-y-3">
                {recentVacancies.length === 0 ? (
                    <p className="text-sm text-gray-500">No vacancies yet</p>
                ) : (
                    recentVacancies.map((vacancy) => (
                        <div
                            key={vacancy.id}
                            className="flex items-center justify-between rounded-lg border p-3"
                        >
                            <div>
                                <p className="font-medium">{vacancy.title}</p>
                                <p className="text-sm text-gray-500">{vacancy.company}</p>
                            </div>

                            <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium">
                {vacancy.status}
              </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}