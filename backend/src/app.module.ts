import {Module} from '@nestjs/common';
import {PrismaModule} from "./prisma/prisma.module";
import {UsersModule} from './users/users.module';
import {AuthModule} from './auth/auth.module';
import {HealthModule} from './health/health.module';
import {VacanciesModule} from './vacancies/vacancies.module';

@Module({
    imports: [
        PrismaModule,
        UsersModule,
        AuthModule,
        HealthModule,
        VacanciesModule
    ],
})
export class AppModule {
}
