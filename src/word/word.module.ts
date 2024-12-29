import { Module } from '@nestjs/common';
import { WordService } from './word.service';
import { WordRepository } from './word.repository';
import { PrismaService } from 'src/prisma.service';
import { WordController } from './word.controller';

@Module({
  providers: [WordService, WordRepository, PrismaService],
  controllers: [WordController],
})
export class WordModule {}
