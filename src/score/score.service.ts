import { Injectable, Logger } from '@nestjs/common';
import { ScoreRepository } from './score.repository';

@Injectable()
export class ScoreService {
    constructor(private readonly scoreRepository: ScoreRepository) {}

    private readonly logger = new Logger(ScoreService.name);
}
