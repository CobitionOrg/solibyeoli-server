import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignInDto } from './dto/signIn.dto';
import { UsersRepository } from './users.repository';
import { BcryptUtilClass } from 'src/utils/bcrypt.util';

@Injectable()
export class UsersService {
    constructor(private usersRepository: UsersRepository) {}
    private readonly bcryptClass: BcryptUtilClass;

    create(createUserDto: CreateUserDto) {
        return 'This action adds a new user';
    }

    findAll() {
        return `This action returns all users`;
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }

    /////////////////////
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
            sub: res.data.user_email,
            name: res.data.name,
        };

        // jwt 토큰 발급 후 return
    }

    async test() {
        return await this.usersRepository.findOne('test');
    }
}
