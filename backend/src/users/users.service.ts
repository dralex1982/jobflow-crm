import {ConflictException, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {
    }

    async create(data: {
        email: string;
        passwordHash: string;
        firstName?: string;
        lastName?: string;
    }) {
        try {
            return await this.prisma.user.create({
                data,
            });
        } catch {
            throw new ConflictException('User with this email already exists');
        }
    }

    findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
            },
        });
    }

    findByEmail(email: string) {
        return this.prisma.user.findFirst({
            where: {email}
        })
    }
}
