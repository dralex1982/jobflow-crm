import {Injectable, NotFoundException} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {OpenAI} from "openai";
import {VacancyAnalysisResult} from "./types/vacancy-analysis-result.type";
import {AnalyzeVacancyDto} from "./dto/analyze-vacancy.dto";
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class AiService {
    private openai: OpenAI;

    constructor(private readonly configService: ConfigService,
                private readonly prisma: PrismaService,) {
        this.openai = new OpenAI({
            apiKey: configService.get<string>('AI_SERVICE_KEY'),
        });
    }

    private normalizeStringArray(value: unknown): string[] {
        if (!Array.isArray(value)) return [];

        return value
            .filter((item): item is string => typeof item === 'string')
            .map((item) => item.trim())
            .filter(Boolean)
            .slice(0, 8);
    }

    private async generateVacancyAnalysis(dto: AnalyzeVacancyDto): Promise<VacancyAnalysisResult> {
        const prompt = `
You analyze job vacancies for a candidate and return structured career guidance.

Return ONLY valid JSON with this exact shape:
{
  "summary": "string",
  "keySkills": ["string"],
  "risks": ["string"],
  "nextActions": ["string"]
}

Rules:
- summary must be concise and practical
- keySkills must contain 3 to 8 concrete skills or technologies
- risks must contain realistic unclear points, missing details, or possible concerns
- nextActions must contain practical candidate actions, not generic advice
- do not include markdown
- do not include explanations outside JSON

Vacancy:
Title: ${dto.title}
Company: ${dto.company}
Notes: ${dto.notes ?? ''}
`;
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4.1-mini',
            temperature: 0.2,
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a precise job vacancy analysis assistant. Return only valid JSON.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });

        const content = response.choices[0]?.message?.content ?? '{}';

        try {
            const parsed = JSON.parse(content);

            return {
                summary: typeof parsed.summary === "string" ? parsed.summary : "",
                keySkills: this.normalizeStringArray(parsed.keySkills),
                risks: this.normalizeStringArray(parsed.risks),
                nextActions: this.normalizeStringArray(parsed.nextActions),
            };
        } catch {
            return {
                summary: 'AI analysis is temporarily unavailable.',
                keySkills: [],
                risks: ['The AI response could not be processed correctly.'],
                nextActions: ['Try running the analysis again.'],
            }
        }
    }


    async analyzeAndSaveVacancy(
        vacancyId: string,
        userId: string,
    ): Promise<VacancyAnalysisResult> {
        const vacancy = await this.prisma.vacancy.findFirst({
            where: {
                id: vacancyId,
                userId,
            },
        });

        if (!vacancy) {
            throw new NotFoundException('Vacancy not found');
        }

        const analysis = await this.generateVacancyAnalysis({
            title: vacancy.title,
            company: vacancy.company,
            notes: vacancy.notes ?? undefined,
        });

        const savedAnalysis = await this.prisma.vacancyAnalysis.upsert({
            where: {vacancyId: vacancy.id},
            update: {
                summary: analysis.summary,
                keySkills: analysis.keySkills,
                risks: analysis.risks,
                nextActions: analysis.nextActions,
            },
            create: {
                vacancyId: vacancy.id,
                summary: analysis.summary,
                keySkills: analysis.keySkills,
                risks: analysis.risks,
                nextActions: analysis.nextActions,
            },
        });

        return {
            summary: savedAnalysis.summary,
            keySkills: savedAnalysis.keySkills as string[],
            risks: savedAnalysis.risks as string[],
            nextActions: savedAnalysis.nextActions as string[],
            updatedAt: savedAnalysis.updatedAt.toISOString(),
        };
    }

    async getVacancyAnalysis(
        vacancyId: string,
        userId: string,
    ): Promise<VacancyAnalysisResult | null> {
        const vacancy = await this.prisma.vacancy.findFirst({
            where: {
                id: vacancyId,
                userId,
            },
            include: {
                analysis: true,
            },
        });

        if (!vacancy) {
            throw new NotFoundException('Vacancy not found');
        }

        if (!vacancy.analysis) {
            return null;
        }

        return {
            summary: vacancy.analysis.summary,
            keySkills: vacancy.analysis.keySkills as string[],
            risks: vacancy.analysis.risks as string[],
            nextActions: vacancy.analysis.nextActions as string[],
            updatedAt: vacancy.analysis.updatedAt.toISOString(),
        };
    }
}
