import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminRepository } from './admin.repository';
import { PrismaService } from 'src/prisma.service';

@Module({
    controllers: [AdminController],
    providers: [AdminService, AdminRepository, PrismaService],
})
export class AdminModule {}
