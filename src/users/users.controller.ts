import {
    Controller,
    Post,
    Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    /**
     * 로그인
     * @param signInDto
     * @returns
     */
    @Post('/signIn')
    signnIn(@Body() signInDto: SignInDto) {
        return this.usersService.signIn(signInDto);
    }

    /**
     * 회원가입
     * @param signUpDto
     * @returns
     */
    @Post('/signUp')
    signUp(@Body() signUpDto: SignUpDto) {
        return this.usersService.signUp(signUpDto);
    }
}
