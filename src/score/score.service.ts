import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ScoreRepository } from './score.repository';
import { CreateResultDto } from './dto/createResult.dto';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ScoreService {
    constructor(
        private readonly scoreRepository: ScoreRepository,
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    private readonly logger = new Logger(ScoreService.name);

    /**
     * 퀴즈 결과 내역 조회
     * @param createResultDto
     * @param header
     * @returns
     */
    async createQuizResult(createResultDto: CreateResultDto, header: string) {
        const token = await this.jwtService.decode(header);

        if (!token)
            throw new HttpException(
                {
                    success: false,
                    status: HttpStatus.UNAUTHORIZED,
                    msg: '토큰이 유효하지 않습니다',
                },
                HttpStatus.UNAUTHORIZED,
            );

        const userId = token.sub;

        const createScore =
            createResultDto.scoreResults.filter((i) => i.is_collect === true)
                .length / createResultDto.scoreResults.length;

        const createScoreResult = createResultDto.scoreResults;

        const createData = await this.prisma.$transaction(async (tx) => {
            const score = await this.scoreRepository.createScore(
                tx,
                userId,
                createResultDto.step_id,
                createScore,
            );

            const scoreResult =
                await this.scoreRepository.createScoreResultBulk(
                    tx,
                    createScoreResult,
                    score.id,
                );

            return { score, scoreResult };
        });

        return { success: true, status: HttpStatus.CREATED, data: createData };
    }
}
