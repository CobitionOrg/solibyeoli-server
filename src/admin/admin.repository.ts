import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AdminRepository {
    constructor(private prisma: PrismaService) {}

    private readonly logger = new Logger(AdminRepository.name);

    /**
     * steps 테이블의 id로 단어들 조회
     * @param id
     * @returns
     */
    async getWordsByStepId(id: number) {
        try {
            const res = await this.prisma.krWord.findMany({
                where: {
                    step_id: id,
                    is_del: false,
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
     * 학년, 차수로 steps 테이블의 id 조회
     * @param grade
     * @param seq
     * @returns
     */
    async getIdFromStepsTable(grade: number, seq: number) {
        try {
            const res = await this.prisma.step.findFirst({
                where: {
                    grade: grade,
                    seq_id: seq,
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
     * 해당 id의 단어 soft delete
     * @param id
     * @returns
     */
    async deleteWord(id: number) {
        try {
            const res = await this.prisma.krWord.update({
                data: {
                    is_del: true,
                },
                where: {
                    id: id,
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
}
