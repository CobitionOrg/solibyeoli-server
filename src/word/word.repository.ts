import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateWordDto } from './dto/createWord.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class WordRepository {
    constructor(private prisma: PrismaService) {}

    private readonly logger = new Logger(WordRepository.name);

    async createWord(
        tx: Prisma.TransactionClient,
        createWordDto: CreateWordDto,
    ) {
        try {
            const res = await tx.krWord.create({
                data: { ...createWordDto },
            });

            return { success: true, status: HttpStatus.CREATED, data: res };
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

    async deleteAllWords(tx: Prisma.TransactionClient) {
        try {
            await tx.krWord.updateMany({
                where: { NOT: { id: 0 } },
                data: { is_del: true },
            });

            return true;
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
     * 학년으로 차수 조회
     * @param gradeNum : 학년 숫자
     * @returns
     */
    async getStepsByGrade(gradeNum: number) {
        try {
            const steps = await this.prisma.step.findMany({
                where: { grade: gradeNum, is_del: false },
                orderBy: { seq_id: 'asc' },
            });

            return steps;
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
     * 차수로 단어 조회
     * @param stepId : step 테이블 id
     * @returns
     */
    async getWordsByStep(stepId: number) {
        try {
            const words = await this.prisma.krWord.findMany({
                where: { step_id: stepId, is_del: false },
            });

            return words;
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
