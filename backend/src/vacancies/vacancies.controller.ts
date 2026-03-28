import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import VacanciesService from "./vacancies.service";
import {CreateVacancyDto} from "./dto/create-vacancy.dto";

@Controller('vacancies')
@UseGuards(JwtAuthGuard)
export class VacanciesController {
    constructor(private readonly vacanciesService: VacanciesService) {
    }

    @Post()
    create(@Req() req: any, @Body() body: CreateVacancyDto) {
        return this.vacanciesService.create(req.user.id, body);
    }

    @Get()
    findAll(@Req() req: any) {
        return this.vacanciesService.findAll(req.user.id);
    }
}
