import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { WordRepository } from './word.repository';
import { CreateWordDto } from './dto/createWord.dto';
import { GetStepsByGradeDto } from './dto/getStepsByGrade.dto';

@Injectable()
export class WordService {
    constructor(private readonly wordRepository: WordRepository) {}

    private readonly logger = new Logger(WordService.name);

    async createWords(createWordDtos: Array<CreateWordDto>) {
        for (const createWordDto of createWordDtos) {
            await this.wordRepository.createWord(createWordDto);
        }

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
        const res = await this.wordRepository.getWordsByStep(stepId);

        return res;
    }
}
