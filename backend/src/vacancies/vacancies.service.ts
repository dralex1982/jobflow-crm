import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {CreateVacancyDto} from "./dto/create-vacancy.dto";

@Injectable()
class VacanciesService {
    constructor(private readonly prisma: PrismaService) {
    }

    create(userId: string,
           dto: CreateVacancyDto) {
        return this.prisma.vacancy.create({
            data: {
                title: dto.title,
                company: dto.company,
                notes: dto.notes,
                userId,
            },
            select: {
                id: true,
                title: true,
                company: true,
                status: true,
                notes: true,
                createdAt: true,
            },
        });
    }

    findAll(userId: string) {
        return this.prisma.vacancy.findMany({
            where: {userId},
            orderBy: {createdAt: 'desc'},
            select: {
                id: true,
                title: true,
                company: true,
                status: true,
                notes: true,
                createdAt: true,
            },
        });
    }
}

export default VacanciesService