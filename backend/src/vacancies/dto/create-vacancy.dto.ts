import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateVacancyDto {
    @IsString()
    @MinLength(2)
    title: string;

    @IsString()
    @MinLength(2)
    company: string;

    @IsOptional()
    @IsString()
    notes?: string;
}