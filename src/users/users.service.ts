import { HttpStatus, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signIn.dto';
import { UsersRepository } from './users.repository';
import { BcryptUtilClass } from 'src/utils/bcrypt.util';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signUp.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(
        private usersRepository: UsersRepository,
        private jwtService: JwtService,
    ) {}
    private readonly bcryptClass = new BcryptUtilClass();

    async signIn(signInDto: SignInDto) {
        const userEmail = signInDto.user_email;
        const userPassword = signInDto.user_password;

        const res = await this.usersRepository.findOne(userEmail);
        if (res.success === false) {
            return { success: false, status: 401 };
        }

        const pwCheck = await this.bcryptClass.checkLogin(
            userPassword,
            res.data.user_password,
        );
        if (!pwCheck) {
            return { success: false, status: 401 };
        }

        const payload = {
            sub: res.data.id,
            name: res.data.name,
            email: res.data.user_email,
            is_admin: res.data.is_admin,
        };

        const access_token = await this.jwtService.signAsync(payload);

        return {
            success: true,
            status: HttpStatus.OK,
            token: access_token,
        };
    }

    async signUp(signUpDto: SignUpDto) {
        const existEmailCheck = await this.usersRepository.findOne(
            signUpDto.user_email,
        );

        if (existEmailCheck.success === true) {
            return { success: false, status: HttpStatus.CONFLICT };
        }

        const user_password = await this.bcryptClass.hashing(
            signUpDto.user_password,
        );

        const date = new Date();

        const userData: Prisma.UserCreateInput = {
            name: signUpDto.name,
            createdAt: date,
            updatedAt: date,
            is_admin: false,
            is_del: false,
            user_email: signUpDto.user_email,
            user_password: user_password,
        };

        await this.usersRepository.signUp(userData);

        return {
            success: true,
            status: HttpStatus.OK,
        };
    }
}
