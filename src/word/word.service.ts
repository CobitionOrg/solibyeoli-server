import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { WordRepository } from './word.repository';
import { CreateWordDto } from './dto/createWord.dto';

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
  async getStepsByGrade(gradeNum: number) {
    if (gradeNum < 1 || gradeNum > 6)
      throw new HttpException(
        { success: false, msg: '잘못된 학년 입니다.' },
        HttpStatus.BAD_REQUEST,
      );

    const res = await this.wordRepository.getStepsByGrade(gradeNum);

    return res;
  }

  /**
   * 차수로 단어 조회
   * @param stepId
   * @returns
   */
  async getWordsByStpe(stepId: number) {
    const res = await this.wordRepository.getWordsBySteps(stepId);

    return res;
  }
}
