import { Vacancy } from '@/entities/vacancy/model/vacancy';
import Link from "next/link";

type Props = {
    vacancies: Vacancy[];
};

export const RecentVacancies = ({ vacancies }: Props) => {
    return (
        <div className="rounded-xl border p-4">
            <div className="mb-4 flex items-center justify-between">
                <div className="text-lg font-semibold">Recent vacancies</div>

                <Link
                    href="/vacancies"
                    className="text-sm text-blue-600 hover:underline"
                >
                    View all
                </Link>
            </div>
            {vacancies.length === 0 ? (
                <div className="text-sm text-gray-500">No recent vacancies yet</div>
            ) : (
                <div className="space-y-3">
                    {vacancies.map(vacancy => (
                        <div
                            key={vacancy.id}
                            className="flex items-center justify-between rounded-lg border p-3"
                        >
                            <div>
                                <div className="font-medium">{vacancy.title}</div>
                                <div className="text-sm text-gray-500">{vacancy.company}</div>
                            </div>

                            <div className="text-sm">{vacancy.status}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};