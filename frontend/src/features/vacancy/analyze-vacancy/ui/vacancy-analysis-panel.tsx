import {VacancyAnalysisResponse} from '@/shared/api/ai';

interface VacancyAnalysisPanelProps {
    title: string;
    company: string;
    result: VacancyAnalysisResponse | null;
    error: string;
    isLoading: boolean;
    isReanalyzing: boolean;
    onReanalyze: () => void;
    onClose: () => void;
}

export function VacancyAnalysisPanel({
                                         title,
                                         company,
                                         result,
                                         error,
                                         isLoading,
                                         isReanalyzing,
                                         onReanalyze,
                                         onClose,
                                     }: VacancyAnalysisPanelProps) {
    return (
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        AI Vacancy Analysis
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        {title} · {company}
                    </p>

                    {result?.updatedAt ? (
                        <p className="mt-1 text-xs text-gray-400">
                            Analyzed: {new Date(result.updatedAt).toLocaleString()}
                        </p>
                    ) : null}
                </div>

                <button
                    className="rounded-xl border px-3 py-2 text-sm font-medium"
                    onClick={onReanalyze}
                    disabled={isLoading || isReanalyzing}
                    type="button"
                >
                    {isReanalyzing ? 'Re-analyzing...' : 'Re-analyze'}
                </button>

                <button
                    className="rounded-xl border px-3 py-2 text-sm font-medium"
                    onClick={onClose}
                    type="button"
                >
                    Close
                </button>
            </div>

            <div className="mt-5">
                {error ? (
                    <p className="text-sm text-red-500">{error}</p>
                ) : isLoading ? (
                    <div className="space-y-3">
                        <p className="text-sm text-gray-500">Loading analysis...</p>
                        <div className="h-4 w-2/3 rounded bg-gray-100"/>
                        <div className="h-4 w-full rounded bg-gray-100"/>
                        <div className="h-4 w-5/6 rounded bg-gray-100"/>
                    </div>
                ) : !result ? (
                    <p className="text-sm text-gray-500">No analysis yet</p>
                ) : (
                    <div className="space-y-5">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Summary</h3>
                            <p className="mt-2 text-sm leading-6 text-gray-700">
                                {result.summary}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Key skills</h3>
                            <ul className="mt-2 space-y-1 text-sm text-gray-700">
                                {result.keySkills.map((skill) => (
                                    <li key={skill}>• {skill}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Risks</h3>
                            <ul className="mt-2 space-y-1 text-sm text-gray-700">
                                {result.risks.map((risk) => (
                                    <li key={risk}>• {risk}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Next actions</h3>
                            <ul className="mt-2 space-y-1 text-sm text-gray-700">
                                {result.nextActions.map((action) => (
                                    <li key={action}>• {action}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}