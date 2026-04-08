'use client'

import {analyzeVacancy, getVacancyAnalysis, VacancyAnalysisResponse} from "@/shared/api/ai";
import {useState} from "react";
import {Vacancy} from "@/entities/vacancy/model/vacancy";
import {getAccessToken} from "@/shared/lib/auth-token";

type UseVacancyAnalysisReturn = {
    loadingAnalysisVacancyId: string | null;
    reanalyzingVacancyId: string | null;
    analysisResult: VacancyAnalysisResponse | null;
    analysisTargetVacancy: Vacancy | null;
    analysisError: string;
    handleAnalyzeVacancy: (vacancyId: string) => Promise<void>;
    handleReanalyzeVacancy: (vacancyId: string) => Promise<void>;
    handleCloseAnalysis: () => void;
};

export function useVacancyAnalysis(vacancies: Vacancy[]): UseVacancyAnalysisReturn {

    const [loadingAnalysisVacancyId, setLoadingAnalysisVacancyId] = useState<string | null>(null);
    const [reanalyzingVacancyId, setReanalyzingVacancyId] = useState<string | null>(null);
    const [analysisTargetVacancy, setAnalysisTargetVacancy] = useState<Vacancy | null>(null);
    const [analysisResult, setAnalysisResult] = useState<VacancyAnalysisResponse | null>(null);
    const [analysisError, setAnalysisError] = useState('');

    const handleAnalyzeVacancy = async (vacancyId: string) => {
        if (!getAccessToken()) return;

        const vacancy = vacancies.find((item) => item.id === vacancyId);
        if (!vacancy) return;

        try {
            setLoadingAnalysisVacancyId(vacancyId);
            setAnalysisError('');
            setAnalysisResult(null)
            setAnalysisTargetVacancy(vacancy);

            const existingAnalysis = await getVacancyAnalysis(vacancyId);

            if (existingAnalysis) {
                setAnalysisResult(existingAnalysis);
                return;
            }

            const generatedAnalysis = await analyzeVacancy(vacancyId);
            setAnalysisResult(generatedAnalysis);

        } catch (error) {
            setAnalysisError(
                error instanceof Error ? error.message : 'Failed to load vacancy analysis',
            );
            setAnalysisResult(null);
        } finally {
            setLoadingAnalysisVacancyId(null);
        }
    };

    const handleReanalyzeVacancy = async (vacancyId: string) => {
        if (!getAccessToken()) return;

        const vacancy = vacancies.find((item) => item.id === vacancyId);
        if (!vacancy) return;

        try {
            setReanalyzingVacancyId(vacancyId);
            setAnalysisError('');
            setAnalysisTargetVacancy(vacancy);

            const freshAnalysis = await analyzeVacancy(vacancyId);
            setAnalysisResult(freshAnalysis);
        } catch (error) {
            setAnalysisError(
                error instanceof Error ? error.message : 'Failed to re-analyze vacancy',
            );
        } finally {
            setReanalyzingVacancyId(null);
        }
    };

    const handleCloseAnalysis = () => {
        setAnalysisResult(null);
        setAnalysisTargetVacancy(null);
        setAnalysisError('');
        setReanalyzingVacancyId(null);
    };

    return {
        loadingAnalysisVacancyId,
        reanalyzingVacancyId,
        analysisResult,
        analysisTargetVacancy,
        analysisError,
        handleAnalyzeVacancy,
        handleReanalyzeVacancy,
        handleCloseAnalysis,
    };
}

