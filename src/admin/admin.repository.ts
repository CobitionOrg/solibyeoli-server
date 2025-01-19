import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateWordDto } from './dto/createWord.dto';
import { UpdateWordDto } from './dto/updateWord.dto';
import { Prisma } from '@prisma/client';

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
                where: {
                    id: id,
                },
                data: {
                    is_del: true,
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
     * 단어 관련 데이터 생성
     * @param createWordDto
     * @param step_id
     * @returns
     */
    async createWordData(createWordDto: CreateWordDto, step_id: number) {
        try {
            const res = await this.prisma.krWord.create({
                data: {
                    kr_word: createWordDto.kr_word,
                    pronunciation: createWordDto.pronunciation,
                    example: createWordDto.example,
                    step_id: step_id,
                    pronunciation_url: createWordDto.pronunciation_url || '',
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
     * 단어 관련 데이터 수정정
     * @param updateWordDto
     * @param step_id
     * @returns
     */
    async updateWordData(updateWordDto: UpdateWordDto, step_id: number) {
        try {
            const res = await this.prisma.krWord.update({
                where: {
                    id: updateWordDto.id,
                },
                data: {
                    kr_word: updateWordDto.kr_word,
                    pronunciation: updateWordDto.pronunciation,
                    example: updateWordDto.example,
                    step_id: step_id,
                    pronunciation_url: updateWordDto.pronunciation_url || '',
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
