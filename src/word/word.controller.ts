import {
    Body,
    Controller,
    Get,
    Logger,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WordService } from './word.service';
import { CreateWordDto } from './dto/createWord.dto';
import * as NodeCache from 'node-cache';
import { GetStepsByGradeDto } from './dto/getStepsByGrade.dto';

@ApiTags('word')
@Controller('word')
export class WordController {
    cache: NodeCache;
    constructor(private readonly wordSevice: WordService) {
        this.cache = new NodeCache({ stdTTL: 28800 });
    }

    private readonly logger = new Logger(WordController.name);

    @ApiOperation({ summary: '엑셀 파일에서 데이터 생성' })
    @Post('/createBulk')
    async createBulk(@Body() createWordDtos: Array<CreateWordDto>) {
        const res = await this.wordSevice.createWords(createWordDtos);

        return res;
    }

    @ApiOperation({ summary: '학년 별 차수 조회' })
    @Get('/getSteps')
    async getStepsByGrade(@Query() getStepsByGrade: GetStepsByGradeDto) {
        this.logger.log('학년 별 차수 조회');

        const cacheKey = `/getSteps/${getStepsByGrade.grade}`;
        const cacheValue = this.cache.get(cacheKey);

        if (cacheValue) return cacheValue;

        const res = await this.wordSevice.getStepsByGrade(getStepsByGrade);
        //캐시 세팅
        this.cache.set(cacheKey, res, 60 * 60);
        return res;
    }

    @ApiOperation({ summary: '차수로 단어 조회' })
    @Get('/getWords/:stepId')
    async getWordsByStep(@Param('stepId') stepId: number) {
        this.logger.log('차수 별 단어 조회');

        const cacheKey = `/getWords/${stepId}`;
        const cacheValue = this.cache.get(cacheKey);

        if (cacheValue) return cacheValue;

        const res = await this.wordSevice.getWordsByStep(stepId);
        //캐시 세팅
        this.cache.set(cacheKey, res, 60 * 60);

        return res;
    }

    @ApiOperation({ summary: '단어 검색' })
    @Get('/search')
    async searchWord(@Query('searchKeyword') searchKeyword: string) {
        this.logger.log('단어 검색');

        const cacheKey = `/searchWord/${searchKeyword}`;
        const cacheValue = this.cache.get(cacheKey);

        if (cacheValue) return cacheValue;

        const res = await this.wordSevice.searchWord(searchKeyword);

        return res;
    }
}
