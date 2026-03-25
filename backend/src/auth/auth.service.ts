import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from '../users/users.service';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {
    }

    async register(data: {
        email: string;
        password: string;
        firstName?: string;
    }) {
        const hash = await bcrypt.hash(data.password, 10);

        return this.usersService.create({
            email: data.email,
            passwordHash: hash,
            firstName: data.firstName,
        });
    }

    async login(data: {
        email: string;
        password: string;
    }) {
        const user = await this.usersService.findByEmail(data.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(data.password, user.passwordHash);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }
        //JWT - HEADER.PAYLOAD.SIGNATURE
        return {
            // message: 'Login success',
            // userId: user.id,
            access_token: this.jwtService.sign({
                sub: user.id,
                email: user.email,
            }),
            user: {
                id: user.id,
                email: user.email,
            },
        }

    }
}