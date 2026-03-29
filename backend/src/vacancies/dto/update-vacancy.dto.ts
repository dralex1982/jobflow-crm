import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { VacancyStatus } from '@prisma/client';

export class UpdateVacancyDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    title?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    company?: string;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsEnum(VacancyStatus)
    status?: VacancyStatus;
}