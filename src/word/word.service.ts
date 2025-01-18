import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { WordRepository } from './word.repository';
import { CreateWordDto } from './dto/createWord.dto';
import { GetStepsByGradeDto } from './dto/getStepsByGrade.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class WordService {
    constructor(
        private readonly wordRepository: WordRepository,
        private readonly prisma: PrismaService,
    ) {}

    private readonly logger = new Logger(WordService.name);

    async createWords(createWordDtos: Array<CreateWordDto>) {
        const createWords = await this.prisma.$transaction(
            async (tx) => {
                const deleteWords =
                    await this.wordRepository.deleteAllWords(tx);

                if (!deleteWords)
                    throw new HttpException(
                        {
                            success: false,
                            status: HttpStatus.INTERNAL_SERVER_ERROR,
                            msg: '내부 서버 에러',
                        },
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    );

                for (const createWordDto of createWordDtos) {
                    await this.wordRepository.createWord(tx, createWordDto);
                }
            },
            { timeout: 100000 },
        );

        return { success: true, status: HttpStatus.CREATED };
    }

    /**
     * 학년별로 차수 조회
     * @param gradeNum
     * @returns
     */
    async getStepsByGrade(getStepsByGrade: GetStepsByGradeDto) {
        if (getStepsByGrade.grade < 1 || getStepsByGrade.grade > 6)
            throw new HttpException(
                { success: false, msg: '잘못된 학년 입니다.' },
                HttpStatus.BAD_REQUEST,
            );

        const data = await this.wordRepository.getStepsByGrade(
            getStepsByGrade.grade,
        );

        const steps = data.reduce((acc, _, i) => {
            if (i % getStepsByGrade.amount === 0)
                acc.push(data.slice(i, i + getStepsByGrade.amount));
            return acc;
        }, []);

        return { success: true, status: HttpStatus.OK, data: steps };
    }

    /**
     * 차수로 단어 조회
     * @param stepId
     * @returns
     */
    async getWordsByStep(stepId: number) {
        const words = await this.wordRepository.getWordsByStep(stepId);

        return { success: true, status: HttpStatus.OK, data: words };
    }
}
