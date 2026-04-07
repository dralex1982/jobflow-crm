export interface VacancyAnalysisResult {
    summary: string;
    keySkills: string[];
    risks: string[];
    nextActions: string[];
    updatedAt?: string;
}