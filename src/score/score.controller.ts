import {
    Body,
    Controller,
    Logger,
    Post,
    Headers,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ScoreService } from './score.service';
import { CreateResultDto } from './dto/createResult.dto';
import { getToken } from 'src/utils/token';
import { AuthGuard } from 'src/auth/auth.guard';
import { HttpExceptionFilter } from 'src/filter/httpExceptionFilter';

@ApiTags('score')
@UseFilters(new HttpExceptionFilter())
@UseGuards(AuthGuard)
@Controller('score')
export class ScoreController {
    constructor(private readonly scoreService: ScoreService) {}

    private readonly logger = new Logger(ScoreController.name);

    @ApiOperation({ summary: '퀴즈 결과 조회' })
    @Post('/')
    async createScore(
        @Body() createResultDto: CreateResultDto,
        @Headers() header,
    ) {
        const res = await this.scoreService.createQuizResult(
            createResultDto,
            getToken(header),
        );

        return res;
    }
}
