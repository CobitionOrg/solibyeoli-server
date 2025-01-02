import { Controller, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ScoreService } from './score.service';

@ApiTags('score')
@Controller('score')
export class ScoreController {
    constructor(private readonly scoreService: ScoreService) {}

    private readonly logger = new Logger(ScoreController.name);
}
