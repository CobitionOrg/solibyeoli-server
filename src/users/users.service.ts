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

    /**
     * 사용자 로그인
     * @param signInDto
     * @returns
     * 성공: { success: true, status: 200, token: access_token }
     * 실패: { success: false, status: 401 }
     */
    async signIn(signInDto: SignInDto) {
        const userEmail = signInDto.user_email;
        const userPassword = signInDto.user_password;

        const res = await this.usersRepository.findOne(userEmail);
        if (res.success === false) {
            return { success: false, status: HttpStatus.UNAUTHORIZED };
        }

        const pwCheck = await this.bcryptClass.checkLogin(
            userPassword,
            res.data.user_password,
        );
        if (!pwCheck) {
            return { success: false, status: HttpStatus.UNAUTHORIZED };
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

    /**
     * 사용자 회원가입
     * @param signUpDto
     * @returns
     * 성공: { success: true, status: 200 }
     * 실패: { success: false, status: 409 }
     */
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

        const userData: Prisma.UserCreateInput = {
            name: signUpDto.name,
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
