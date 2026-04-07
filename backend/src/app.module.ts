import {Module} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {PrismaModule} from "./prisma/prisma.module";
import {UsersModule} from './users/users.module';
import {AuthModule} from './auth/auth.module';
import {HealthModule} from './health/health.module';
import {VacanciesModule} from './vacancies/vacancies.module';
import {AiModule} from "./modules/ai/ai.module";


@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        PrismaModule,
        UsersModule,
        AuthModule,
        HealthModule,
        VacanciesModule,
        AiModule
    ],
})
export class AppModule {
}
