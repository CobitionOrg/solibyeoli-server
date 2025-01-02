import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ScoreRepository {
    constructor(private prisma: PrismaService) {}

    private readonly logger = new Logger(ScoreRepository.name);
}
