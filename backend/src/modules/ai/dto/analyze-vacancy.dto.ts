import { IsOptional, IsString, MaxLength } from 'class-validator';

export class AnalyzeVacancyDto {
    @IsString()
    @MaxLength(200)
    title: string;

    @IsString()
    @MaxLength(200)
    company: string;

    @IsOptional()
    @IsString()
    @MaxLength(4000)
    notes?: string;
}