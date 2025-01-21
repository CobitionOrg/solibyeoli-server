import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminRepository } from './admin.repository';
import { PrismaService } from 'src/prisma.service';

@Module({
    controllers: [AdminController],
    providers: [AdminService, AdminRepository, PrismaService],
})
export class AdminModule {}
