import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {CreateVacancyDto} from "./dto/create-vacancy.dto";
import {UpdateVacancyDto} from "./dto/update-vacancy.dto";

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

    async update(
        userId: string,
        vacancyId: string,
        dto: UpdateVacancyDto) {
        const vacancy = await this.prisma.vacancy.findFirst({
            where: {
                id: vacancyId,
                userId,
            },
        });

        if (!vacancy) {
            throw new NotFoundException('Types not found');
        }

        return this.prisma.vacancy.update({
            where: {id: vacancyId},
            data: dto,
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

    async remove(userId: string, vacancyId: string) {
        const vacancy = await this.prisma.vacancy.findFirst({
            where: {
                id: vacancyId,
                userId,
            },
        });

        if (!vacancy) {
            throw new NotFoundException('Types not found');
        }

        await this.prisma.vacancy.delete({
            where: {id: vacancyId},
        });

        return {success: true};
    }
}

export default VacanciesService