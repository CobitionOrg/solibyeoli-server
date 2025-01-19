import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminRepository } from './admin.repository';
import { PrismaService } from 'src/prisma.service';
import { S3Module } from 'src/s3/s3.module';

@Module({
    controllers: [AdminController],
    providers: [AdminService, AdminRepository, PrismaService],
    imports: [S3Module],
})
export class AdminModule {}
