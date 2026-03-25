import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UsersModule} from "../users/users.module";
import {JwtModule} from '@nestjs/jwt';
import {JwtAuthGuard} from "./jwt.guard";

@Module({
    imports: [
        JwtModule.register({
        secret: process.env.JWT_ACCESS_SECRET,
        signOptions: {expiresIn: '1h'},
    }),
        UsersModule
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtAuthGuard],
    exports: [AuthService, JwtAuthGuard, JwtModule],
})
export class AuthModule {
}
