import {Test, TestingModule} from '@nestjs/testing';
import {VacanciesService} from './vacancies.service';
import {PrismaService} from '../prisma/prisma.service';

describe('VacanciesService', () => {
    let service: VacanciesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [VacanciesService,
                {
                    provide: PrismaService,
                    useValue: {
                        vacancy: {
                            create: jest.fn(),
                            findMany: jest.fn(),
                            findFirst: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<VacanciesService>(VacanciesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
