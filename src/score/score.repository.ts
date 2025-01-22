import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateScoreResultDto } from './dto/createScoreResult.dto';

@Injectable()
export class ScoreRepository {
    constructor(private prisma: PrismaService) {}

    private readonly logger = new Logger(ScoreRepository.name);

    /**
     * 점수 데이터 생성
     * @param tx
     * @param user_id
     * @param step_id
     * @param score
     * @returns
     */
    async createScore(
        tx: Prisma.TransactionClient,
        user_id: number,
        step_id: number,
        score: number,
    ) {
        try {
            const res = await tx.score.create({
                data: {
                    user_id: user_id,
                    score: score,
                    step_id: step_id,
                },
            });

            return res;
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                {
                    success: false,
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    msg: '내부 서버 에러',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * 시험 결과 데이터 생성
     * @param tx
     * @param score_id
     * @param question_id
     * @param is_collect
     * @returns
     */
    async createScoreResult(
        tx: Prisma.TransactionClient,
        score_id: number,
        question_id: number,
        is_collect: boolean,
    ) {
        try {
            const res = await tx.scoreResult.create({
                data: {
                    score_id,
                    question_id,
                    is_collect,
                },
            });

            return res;
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                {
                    success: false,
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    msg: '내부 서버 에러',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * 퀴즈 결과 생성
     * @param tx
     * @param createScoreResult
     * @param scoreId
     */
    async createScoreResultBulk(
        tx: Prisma.TransactionClient,
        createScoreResult: Array<CreateScoreResultDto>,
        scoreId: number,
    ) {
        try {
            const qryArr = [];

            for (const e of createScoreResult) {
                const qry = tx.scoreResult.create({
                    data: {
                        score_id: scoreId,
                        question_id: e.question_id,
                        is_collect: e.is_collect,
                    },
                });

                qryArr.push(qry);
            }

            await Promise.all([...qryArr])
                .then((value) => {
                    //console.log(value);
                    return { success: true, status: HttpStatus.OK };
                })
                .catch((err) => {
                    this.logger.error(err);
                    return {
                        success: false,
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                    };
                });
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                {
                    success: false,
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    msg: '내부 서버 에러',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * 점수 리스트 출력
     * @param userId
     * @returns
     */
    async getScoreList(userId: number) {
        try {
            const scoreList = await this.prisma.score.findMany({
                where: { user_id: userId, is_del: false },
                select: {
                    id: true,
                    score: true,
                    createdAt: true,
                    Step: {
                        select: {
                            id: true,
                            grade: true,
                            seq_id: true,
                        },
                    },
                    ScoreResults: {
                        select: {
                            id: true,
                            question_id: true,
                            is_collect: true,
                        },
                    },
                },
            });

            return scoreList;
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                {
                    success: false,
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    msg: '내부 서버 에러',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
