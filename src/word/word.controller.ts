import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WordService } from './word.service';
import { CreateWordDto } from './dto/createWord.dto';
import * as NodeCache from 'node-cache';

@ApiTags('word')
@Controller('word')
export class WordController {
  cache: NodeCache;
  constructor(private readonly wordSevice: WordService) {
    this.cache = new NodeCache();
  }

  private readonly logger = new Logger(WordController.name);

  @ApiOperation({ summary: '엑셀 파일에서 데이터 생성' })
  @Post('/createBulk')
  async createBulk(@Body() createWordDtos: Array<CreateWordDto>) {
    const res = await this.wordSevice.createWords(createWordDtos);

    return res;
  }

  @ApiOperation({ summary: '학년 별 차수 조회' })
  @Get('/getSteps/:gradeNum')
  async getStepsByGrade(@Param('gradeNum') gradeNum: number) {
    this.logger.log('학년 별 차수 조회');

    const cacheKey = `/getSteps/${gradeNum}`;
    const cacheValue = this.cache.get(cacheKey);

    if (cacheValue) return cacheValue;

    const res = await this.wordSevice.getStepsByGrade(gradeNum);
    //캐시 세팅
    this.cache.set(cacheKey, res, 60 * 60);
    return res;
  }

  @ApiOperation({ summary: '차수로 단어 조회' })
  @Get('/getWords/:stepId')
  async getWordsByStep(@Param('stepId') stepId: number) {
    this.logger.log('차수 별 단어 조회');

    const cacheKey = `/getSteps/${stepId}`;
    const cacheValue = this.cache.get(cacheKey);

    if (cacheValue) return cacheValue;

    const res = await this.wordSevice.getWordsByStpe(stepId);
    //캐시 세팅
    this.cache.set(cacheKey, res, 60 * 60);

    return res;
  }
}
