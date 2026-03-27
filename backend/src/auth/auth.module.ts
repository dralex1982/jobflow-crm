import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UsersModule} from "../users/users.module";
import {JwtModule} from '@nestjs/jwt';
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {PassportModule} from "@nestjs/passport";

@Module({
    imports: [
        JwtModule.register({
        secret: process.env.JWT_ACCESS_SECRET,
        signOptions: {expiresIn: '1d'},
    }),
        PassportModule,
        UsersModule
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtAuthGuard, JwtStrategy],
    exports: [AuthService, JwtAuthGuard, JwtModule],
})
export class AuthModule {
}
