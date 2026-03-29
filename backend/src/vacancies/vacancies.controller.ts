import {Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import VacanciesService from "./vacancies.service";
import {CreateVacancyDto} from "./dto/create-vacancy.dto";
import {UpdateVacancyDto} from "./dto/update-vacancy.dto";

@Controller('vacancies')
@UseGuards(JwtAuthGuard)
export class VacanciesController {
    constructor(private readonly vacanciesService: VacanciesService) {
    }

    @Post()
    create(@Req() req: any, @Body() dto: CreateVacancyDto) {
        return this.vacanciesService.create(req.user.id, dto);
    }

    @Get()
    findAll(@Req() req: any) {
        return this.vacanciesService.findAll(req.user.id);
    }

    @Patch(':id')
    update(
        @Req() req: any,
        @Param('id') id: string,
        @Body() dto: UpdateVacancyDto
    ) {
        return this.vacanciesService.update(req.user.id, id, dto);
    }

    @Delete(':id')
    remove
    (
        @Req() req: any,
        @Param('id') id: string
    ) {
        return this.vacanciesService.remove(req.user.id, id);
    }
}
