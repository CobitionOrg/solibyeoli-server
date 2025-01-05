import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    /**
     * 로그인
     * @param signInDto
     * @returns
     * 성공: { success: true, status: 200, token: access_token }
     * 실패: { success: false, status: 401 }
     */
    @ApiOperation({ summary: '사용자 로그인' })
    @Post('/signIn')
    async signnIn(@Body() signInDto: SignInDto) {
        return await this.usersService.signIn(signInDto);
    }

    /**
     * 회원가입
     * @param signUpDto
     * @returns
     * 성공: { success: true, status: 200 }
     * 실패: { success: false, status: 409 }
     */
    @ApiOperation({ summary: '사용자 회원가입' })
    @Post('/signUp')
    async signUp(@Body() signUpDto: SignUpDto) {
        return await this.usersService.signUp(signUpDto);
    }
}
