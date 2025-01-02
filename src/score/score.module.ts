import { Module } from '@nestjs/common';
import { ScoreService } from './score.service';
import { ScoreRepository } from './score.repository';
import { PrismaService } from 'src/prisma.service';
import { ScoreController } from './score.controller';

@Module({
    providers: [ScoreService, ScoreRepository, PrismaService],
    controllers: [ScoreController],
})
export class ScoreModule {}
