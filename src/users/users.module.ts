import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            global: true,
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_CONSTANT'),
                signOptions: { expiresIn: '11h' },
            }),
        }),
    ],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository, PrismaService],
})
export class UsersModule {}
