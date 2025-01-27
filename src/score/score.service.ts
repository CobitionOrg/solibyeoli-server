import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ScoreRepository } from './score.repository';
import { CreateResultDto } from './dto/createResult.dto';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PageDto } from './dto/page.dto';

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
            (createResultDto.scoreResults.filter((i) => i.is_collect === true)
                .length /
                createResultDto.scoreResults.length) *
            100;

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

    /**
     * 점수 결과 가져오기
     * @param header
     * @returns
     */
    async getScoreList(header: string, pageDto: PageDto) {
        // const token = await this.jwtService.decode(header);

        // if (!token)
        //     throw new HttpException(
        //         {
        //             success: false,
        //             status: HttpStatus.UNAUTHORIZED,
        //             msg: '토큰이 유효하지 않습니다',
        //         },
        //         HttpStatus.UNAUTHORIZED,
        //     );

        const userId = 8;
        const skip = (pageDto.page - 1) * pageDto.limit; // 건너뛸 항목 수
        const take = pageDto.limit; // 가져올 항목 수
        const scoreList = await this.scoreRepository.getScoreList(
            userId,
            skip,
            take,
        );

        const data = scoreList.sort((a, b) => {
            if (a.Step.grade !== b.Step.grade) {
                return a.Step.grade - b.Step.grade;
            }
            return a.Step.seq_id - b.Step.seq_id;
        });

        return { success: true, status: HttpStatus.OK, data: data };
    }

    async deleteAllScore(header: string) {
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
        const res = await this.scoreRepository.deleteAllScore(userId);

        if (res)
            return {
                success: true,
                status: HttpStatus.NO_CONTENT,
                data: '초기화 되었습니다.',
            };
        else
            return {
                success: false,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                data: '내부 서버 에러',
            };
    }
}
