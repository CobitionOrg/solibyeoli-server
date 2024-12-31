import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersRepository {
    constructor(private prisma: PrismaService) {}

    private readonly logger = new Logger(UsersRepository.name);

    /**
     * email로 사용자 조회
     */
    async findOne(email: string) {
        try {
            const userData = await this.prisma.user.findUnique({
                where: {
                    user_email: email,
                    is_del: false,
                },
            });
            // 없으면 null 나옴

            if (userData === null) {
                return { success: false };
            }

            return { success: true, data: userData };
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                {
                    success: false,
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async signUp(userData: Prisma.UserCreateInput) {
        try {
            await this.prisma.user.create({
                data: userData,
            });

            return { success: true };
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                {
                    success: false,
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
