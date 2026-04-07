import {Controller, Get, Param, Post, Req, UseGuards} from '@nestjs/common';

import {AiService} from "./ai.service";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";


@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
    constructor(private readonly aiService: AiService) {}

    @Post('vacancies/:id/analyze')
    analyzeVacancy(
        @Param('id') vacancyId: string,
        @Req() req: { user: { userId: string } },
    ) {
        return this.aiService.analyzeAndSaveVacancy(vacancyId, req.user.userId);
    }

    @Get('vacancies/:id/analysis')
    getVacancyAnalysis(
        @Param('id') vacancyId: string,
        @Req() req: { user: { userId: string } },
    ) {
        return this.aiService.getVacancyAnalysis(vacancyId, req.user.userId);
    }
}